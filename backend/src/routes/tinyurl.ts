import { Router, Request, Response } from "express"
import { authMiddleware } from "../middleware/auth"
import { analytics, create, deleteUrl, getAllUrls } from "../controller/tinyurlController"

const router = Router()

router.post("/create", authMiddleware, create)

export { router as tinyurlRoutes }