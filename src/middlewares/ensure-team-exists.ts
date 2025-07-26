import { Request, Response, NextFunction } from "express"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

async function ensureTeamExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const teamId = request.body.team_id || request.params.team_id

    if (!teamId) {
      throw new AppError("Team ID is required.")
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      response.status(404).json({ message: "Team not found." })
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export { ensureTeamExists }
