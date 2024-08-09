import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "../lib/db";


export const signup = async (req: Request, res: Response) => {
  try {
    const userDetails = req.body
    const hashedPassword = await bcrypt.hash(userDetails.password, 10)

    const user = await db.user.create({
      data: {
        name: userDetails.name,
        email: userDetails.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);

    return res.status(201).json({
      token,
      userId: user.id,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
}




export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExist = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExist) {
      return res.status(404).json("User not found");
    }

    const isPasswordValid = bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        msg: "wrong Credentials",
      });
    }

    const token = jwt.sign(
      { id: userExist.id },
      process.env.JWT_SECRET as string
    );
    return res.json({
      token,
      userId: userExist.id,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong"
    })
  }
}