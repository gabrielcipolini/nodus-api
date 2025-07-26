import { Request, Response } from "express"
import z from "zod"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(2).max(30),
      description: z.string().max(50),
    })

    const { name, description } = bodySchema.parse(request.body)

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    })

    await prisma.teamMember.create({
      data: {
        userId: request.user!.id,
        teamId: team.id,
      },
    })

    return response.status(201).json(team)
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany()

    if (teams.length === 0) {
      return response.json({ message: "No results found" })
    }

    return response.json(teams)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const bodySchema = z.object({
      name: z.string().min(2).max(30),
      description: z.string().max(100),
    })

    const { team_id } = paramsSchema.parse(request.params)

    const { name, description } = bodySchema.parse(request.body)

    await prisma.team.update({
      data: {
        name,
        description,
      },
      where: {
        id: team_id,
      },
    })

    return response.json()
  }

  async del(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const { team_id } = paramsSchema.parse(request.params)

    await prisma.teamMember.deleteMany({
      where: {
        teamId: team_id,
      },
    })

    await prisma.team.delete({
      where: {
        id: team_id,
      },
    })

    return response.json()
  }
}

export { TeamsController }
