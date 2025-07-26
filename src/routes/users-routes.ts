import { Router } from "express"

import { UsersController } from "@/controllers/users-controller"
import { asyncHandler } from "@/utils/asyncHandler"

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", asyncHandler(usersController.create))

export { usersRoutes }
