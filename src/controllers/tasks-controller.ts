import { Request, Response } from "express"
import z from "zod"

import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { TaskStatus, TaskPriority } from "@prisma/client"

class TasksController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const bodySchema = z.object({
      title: z.string().trim().min(3).max(30),
      description: z.string().trim().max(100),
      priority: z.enum(TaskPriority),
      user_id: z.uuid(),
    })

    const { title, description, priority, user_id } = bodySchema.parse(
      request.body
    )

    const { team_id } = paramsSchema.parse(request.params)

    const userIsMember = await prisma.teamMember.findFirst({
      where: { userId: user_id },
    })

    if (!userIsMember) {
      throw new AppError("User is not a member of this team.")
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        assignedTo: user_id,
        teamId: team_id,
      },
    })

    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedById: task.assignedTo,
        oldStatus: "pending",
        newStatus: "pending",
      },
    })

    return response.status(201).json(task)
  }

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    })

    const { team_id } = paramsSchema.parse(request.params)

    const tasksTeam = await prisma.task.findMany({
      where: { teamId: team_id },
      include: {
        user: { select: { id: true, name: true, role: true } },
        team: { select: { id: true, name: true } },
      },
    })

    if (tasksTeam.length === 0) {
      return response.status(404).json({ message: "Tasks not found." })
    }

    return response.json(tasksTeam)
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().trim().min(3).max(30),
      description: z.string().trim().max(100),
      status: z.enum(TaskStatus),
      priority: z.enum(TaskPriority),
      assigned_to: z.string(),
    })

    const paramsSchema = z.object({
      team_id: z.uuid(),
      task_id: z.uuid(),
    })

    const { title, description, status, priority, assigned_to } =
      bodySchema.parse(request.body)

    const { team_id, task_id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({
      where: {
        id: task_id,
      },
    })

    const oldStatus = task?.status

    const taskUpdated = await prisma.task.update({
      data: {
        title: title,
        description: description,
        status: status,
        priority: priority,
        assignedTo: assigned_to,
      },
      where: { id: task_id },
    })

    await prisma.taskHistory.create({
      data: {
        taskId: taskUpdated.id,
        changedById: taskUpdated.assignedTo,
        oldStatus: oldStatus,
        newStatus: taskUpdated.status,
      },
    })

    return response.json(taskUpdated)
  }

  async del(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
      task_id: z.uuid(),
    })

    const { team_id, task_id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({
      where: {
        id: task_id,
      },
    })

    await prisma.taskHistory.deleteMany({
      where: { taskId: task?.id },
    })

    await prisma.task.delete({
      where: { id: task?.id },
    })

    return response.json()
  }
}

export { TasksController }
