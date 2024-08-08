import express from "express"
import cors from "cors"
import { authRoutes } from "./routes/auth"
import { redirect } from "./controller/redirectController"
import { tinyurlRoutes } from "./routes/tinyurl"

// Use best practices like learnScape
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/user", authRoutes)
app.use("/api/tinyurl", tinyurlRoutes)
app.get("/:redirect", redirect)

app.listen("3000", () => console.log("Server started on port 3000"))