import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req: Request, res: Response) => {
  try {
    const userDetails = req.body
    const hashedPassword = await bcrypt.hash(userDetails.password, 10)

    const user = await db.user.create({
      data: {
        name: userDetails.name,
        email: userDetails.email,
        username: userDetails.username,
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


