import express from "express"

import { errorHandling } from "@/middlewares/error-handling"
import { routes } from "@/routes/index"

const app = express()

app.use(express.json())

app.use(routes)

app.use(errorHandling)
export { app }
