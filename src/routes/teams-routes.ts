import { Router } from "express"

import { TeamsController } from "@/controllers/teams-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { asyncHandler } from "@/utils/asyncHandler"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import { ensureTeamExists } from "@/middlewares/ensure-team-exists"
import { ensureIsMember } from "@/middlewares/ensure-is-member"

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  asyncHandler(teamsController.create)
)

teamsRoutes.get("/", ensureAuthenticated, asyncHandler(teamsController.index))

teamsRoutes.patch(
  "/:team_id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureTeamExists,
  ensureIsMember,
  asyncHandler(teamsController.update)
)

teamsRoutes.delete(
  "/:team_id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureTeamExists,
  ensureIsMember,
  asyncHandler(teamsController.del)
)

export { teamsRoutes }
