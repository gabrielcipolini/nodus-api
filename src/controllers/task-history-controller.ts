import { Request, Response } from "express"
import z from "zod"

import { prisma } from "@/database/prisma"

class TaskHistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.uuid(),
      team_id: z.uuid(),
    })

    const { task_id } = paramsSchema.parse(request.params)

    const taskLog = await prisma.taskHistory.findMany({
      where: { taskId: task_id },
      include: {
        task: {
          select: {
            title: true,
            status: true,
            priority: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    })

    return response.json(taskLog)
  }
}

export { TaskHistoryController }
