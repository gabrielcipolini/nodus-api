import { Request, Response, NextFunction } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

async function ensureIsMember(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const team_id = request.body.team_id || request.params.team_id
    const user_id = request.user?.id

    if (!team_id || !user_id) {
      throw new AppError("User ID or Team ID incorrect.")
    }

    const isMember = await prisma.teamMember.findFirst({
      where: {
        userId: user_id,
        teamId: team_id,
      },
    })

    if (!isMember) {
      throw new AppError("You're not a member of this team")
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export { ensureIsMember }
