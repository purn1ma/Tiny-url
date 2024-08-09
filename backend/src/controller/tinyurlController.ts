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
export async function getAllUrls(req: Request, res: Response) {
  try {
    const { userId } = req.body
    const allUrls = await db.shortUrl.findMany({
      where: {
        user: userId
      }
    })

    return res.json(allUrls)
  } catch (error: any) {
    console.log(error)
  }
}

export async function analytics(req: Request, res: Response) {
  try {
    const { shortUrl } = req.body
    const tinyUrlExits = await db.shortUrl.findFirst({
      where: {
        shortUrl
      }
    })

    if (!tinyUrlExits) {
      return res.status(400).json("URL doesn't exist");
    }

    const visitsCount = tinyUrlExits.visits.length;

    return res.status(200).json({
      id: tinyUrlExits.id,
      totalVisitsCount: visitsCount,
      originalUrl: tinyUrlExits.originalURL,
      createdAt: tinyUrlExits.createdAt
    });
  } catch (error: any) {
    return res.json({
      msg: "Something went wrong",
      err: error.message,
    });
  }
}

export async function deleteUrl(req: Request, res: Response) {
  try {
    const { url } = req.body

    const tinyUrlExists = await db.shortUrl.findFirst({
      where: {
        shortUrl: url
      }
    })

    if(!tinyUrlExists) {
      return res.status(404).json({
        msg: "Tiny Url does not exists"
      })
    }

    await db.shortUrl.delete({
      where: {
        shortUrl: url
      }
    })

    return res.status(200).json("Url Deleted Succesfully")
    
  } catch (error: any) {
    return res.json({
      msg: "Something went wrong",
      err: error.message
    })
  }
}