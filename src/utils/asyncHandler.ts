import { Request, Response, NextFunction } from "express"

const asyncHandler =
  (fn: Function) =>
  (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(fn(request, response, next)).catch(next)
  }

export { asyncHandler }
