import { Request, Response } from "express"
import z from "zod"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamMembersController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const bodySchema = z.object({
      user_id: z.uuid(),
    })

    const { user_id } = bodySchema.parse(request.body)

    const { team_id } = paramsSchema.parse(request.params)

    const isMemberTeam = await prisma.teamMember.findFirst({
      where: { userId: user_id, teamId: team_id },
    })

    if (isMemberTeam) {
      throw new AppError("User already is a member of this team.")
    }

    await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team_id,
      },
    })

    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const { team_id } = paramsSchema.parse(request.params)

    const isMemberTeam = await prisma.teamMember.findFirst({
      where: { userId: request.user?.id, teamId: team_id },
    })

    if (!isMemberTeam) {
      throw new AppError("You area not member of this team.")
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        teamId: team_id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return response.json(teamMembers)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.uuid(),
      team_id: z.uuid(),
    })

    const { user_id, team_id } = paramsSchema.parse(request.params)

    const isMemberTeam = await prisma.teamMember.findFirst({
      where: { userId: request.user?.id, teamId: team_id },
    })

    if (!isMemberTeam) {
      throw new AppError("You are not member of this team.")
    }

    const teamMemberId = await prisma.teamMember.findFirst({
      where: { userId: user_id, teamId: team_id },
    })

    await prisma.teamMember.delete({
      where: { id: teamMemberId?.id },
    })

    return response.json()
  }
}

export { TeamMembersController }
