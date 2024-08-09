import { Request, Response } from "express";
import db from "../lib/db";
// Implement Zod
export const redirect = async (req: Request, res: Response) => {
  try {
    const hashedUrl = req.body.params
    const shortUrlExists = await db.shortUrl.findFirst({
      where: {
        shortUrl: hashedUrl
      }
    })

    if(!shortUrlExists) {
      return res.status(404).json({
        msg: "This url doesn't exists",  // Improve the error message by seeing dub.sh
      })
    }

    // Increase the vists count of the url
    await db.shortUrl.update({
      where: {
        shortUrl: hashedUrl,
      },
      data: {
        visits: shortUrlExists.visits.push(new Date())
      }
    })

    res.redirect(shortUrlExists.originalUrl)

  } catch (error: any) {
    return res.status(500).json({
      msg: "Something went wrong",
      err: error.message
    })
  }
}