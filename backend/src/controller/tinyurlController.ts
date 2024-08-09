import { Request, Response } from "express";
import * as crypto from "crypto"
import { encryption } from "../lib/utils";
import db from "../lib/db";


// Use singletton pattern to make an encryption key
export async function create(req: Request, res: Response) {
  try {
    const { url, userId } = req.body

    // Authentication check

    // Check if url is valid
    if(!url.startsWith("http://") && !url.startsWith("https://")) {
      return res.status(400).json({
        msg: "Invalid Url",
      })
    }

    const urlExists = await db.shortUrl.findFirst({
      originalUrl: url
    })

    // If tinyUrl already exists then return it.
    if (urlExists) {
      return res.json({
        tinyURL: urlExists.shortUrl,
      });
    }

    // If we want to make our application more scaleable we can use hashing to hash the original url so that we can more combinations so that it can cause less clash of two or more url are pointed by same tinyUrl

    const shortId = encryption(url)

    const newTinyUrl = await db.shortUrl.create({
      data: {
        shortUrl: `http://localhost:3000/${shortId}`,
        originalURL: url,
        visits: [],
        user: userId
      }
    })

    return res.status(201).json({
      tinyURL: newTinyUrl?.shortUrl
    });
  } catch (error: any) {
    return res.json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
}
