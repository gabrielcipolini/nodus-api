import { Router } from "express"

import { TasksController } from "@/controllers/tasks-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { ensureIsMember } from "@/middlewares/ensure-is-member"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import { asyncHandler } from "@/utils/asyncHandler"

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.post(
  "/:team_id/tasks",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureIsMember,
  asyncHandler(tasksController.create)
)

tasksRoutes.get(
  "/:team_id/tasks",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  ensureIsMember,
  asyncHandler(tasksController.index)
)

tasksRoutes.patch(
  "/:team_id/tasks/:task_id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  ensureIsMember,
  asyncHandler(tasksController.update)
)

tasksRoutes.delete(
  "/:team_id/tasks/:task_id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureIsMember,
  asyncHandler(tasksController.del)
)

export { tasksRoutes }
