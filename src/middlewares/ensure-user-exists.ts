import { Request, Response, NextFunction } from "express"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

async function ensureUserExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.body.user_id || request.params.user_id

    if (!userId) {
      throw new AppError("User ID is required.")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      response
        .status(400)
        .json({ message: "Invalid User ID or user does not exist." })
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export { ensureUserExists }
