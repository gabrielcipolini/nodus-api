import { Router } from "express"

import { SessionsController } from "@/controllers/sessions-controller"
import { asyncHandler } from "@/utils/asyncHandler"

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post("/", asyncHandler(sessionsController.create))

export { sessionsRoutes }
