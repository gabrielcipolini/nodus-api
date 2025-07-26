import { Request, Response, NextFunction } from "express"
import z from "zod"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { authConfig } from "@/configs/auth"

class SessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().trim().min(6).max(100),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new AppError("Email or password incorrect", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("Email or password incorrect", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({ role: user.role ?? "member" }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: hashedPassword, ...userWithoutPassword } = user

    return response.status(201).json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }
