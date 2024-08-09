import { Request, Response } from "express";
import * as crypto from "crypto"
import { encryption } from "../lib/utils";
import db from "../lib/db";


// Use singletton pattern to make an encryption key
export async function create(req: Request, res: Response) {
  try {
    const { url } = req.body
     // @ts-ignore
     const userId = req.userId

    // Authentication check

    // Check if url is valid
    if(!url.startsWith("http://") && !url.startsWith("https://")) {
      return res.status(400).json({
        msg: "Invalid Url",
      })
    }

    const urlExists = await db.shortUrl.findFirst({
      where: {
        originalUrl: url
      }
    })

    // If tinyUrl already exists then return it.
    if (urlExists) {
      return res.json({
        tinyURL: urlExists.shortUrl,
      });
    }

    // If we want to make our application more scaleable we can use hashing to hash the original url so that we can more combinations so that it can cause less clash of two or more url are pointed by same tinyUrl

    const shortId = await encryption(url)

    const newTinyUrl = await db.shortUrl.create({
      data: {
        shortUrl: `http://localhost:3000/${shortId}`,
        originalUrl: url,
        userId,
      }
    })

    return res.status(201).json({
      tinyURL: newTinyUrl?.shortUrl
    });
  } catch (error: any) {
    return res.status(500).json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
}
export async function getAllUrls(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.userId
    const allUrls = await db.user.findFirst({
      where: {
        id: userId
      },
      include: {
        shortUrls: {
          include: {
            visits: true
          }
        }
      }
    })

    return res.json(allUrls?.shortUrls)
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
      },
      include: {
        visits: true
      }
    })

    if (!tinyUrlExits) {
      return res.status(400).json("URL doesn't exist");
    }

    const visitsCount = tinyUrlExits.visits.length;

    return res.status(200).json({
      id: tinyUrlExits.id,
      totalVisitsCount: visitsCount,
      originalUrl: tinyUrlExits.originalUrl,
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
    const url = req.query.url

    const tinyUrlExists = await db.shortUrl.findFirst({
      where: {
        shortUrl: typeof(url) === "string" ? url : ""
      }
    })

    if(!tinyUrlExists) {
      return res.status(404).json({
        msg: "Tiny Url does not exists"
      })
    }

    await db.shortUrl.delete({
      where: {
        shortUrl: typeof(url) === "string" ? url : ""
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