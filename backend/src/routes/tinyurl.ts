import { Router, Request, Response } from "express"
import { authMiddleware } from "../middleware/auth"
import { analytics, create, deleteUrl, getAllUrls } from "../controller/tinyurlController"

const router = Router()

router.post("/create", authMiddleware, create)
router.get("/getAllUrls", authMiddleware, getAllUrls) 
router.get("/analytics", authMiddleware, analytics) 
router.delete("/delete", authMiddleware, deleteUrl)

export { router as tinyurlRoutes }