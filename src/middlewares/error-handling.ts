import { Request, Response, NextFunction } from "express"

import { AppError } from "@/utils/AppError"
import z, { ZodError } from "zod"

function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: "Validation error", issues: z.treeifyError(error) })
  }

  return response.status(500).json({
    message: error.message,
  })
}

export { errorHandling }
