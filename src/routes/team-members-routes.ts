import { Router } from "express"

import { TeamMembersController } from "@/controllers/team-members-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"
import { asyncHandler } from "@/utils/asyncHandler"
import { ensureTeamExists } from "@/middlewares/ensure-team-exists"
import { ensureUserExists } from "@/middlewares/ensure-user-exists"
import { ensureIsMember } from "@/middlewares/ensure-is-member"

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post(
  "/:team_id/members",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureUserExists,
  ensureTeamExists,
  ensureIsMember,
  asyncHandler(teamMembersController.create)
)

teamMembersRoutes.get(
  "/:team_id/members",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  ensureTeamExists,
  ensureIsMember,
  asyncHandler(teamMembersController.index)
)

teamMembersRoutes.delete(
  "/:team_id/members/:user_id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  ensureTeamExists,
  ensureIsMember,
  asyncHandler(teamMembersController.remove)
)

export { teamMembersRoutes }
