import { Router } from "express"

import { TaskHistoryController } from "@/controllers/task-history-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { ensureIsMember } from "@/middlewares/ensure-is-member"
import { ensureTeamExists } from "@/middlewares/ensure-team-exists"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import { asyncHandler } from "@/utils/asyncHandler"

const taskHistoryRoutes = Router()
const taskHistoryController = new TaskHistoryController()

taskHistoryRoutes.get(
  "/:team_id/tasks/:task_id/log",
  ensureAuthenticated,
  ensureTeamExists,
  ensureIsMember,
  verifyUserAuthorization(["admin", "member"]),
  asyncHandler(taskHistoryController.index)
)

export { taskHistoryRoutes }
