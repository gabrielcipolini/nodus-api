import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("SessionsController", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should create a new user successfully", async () => {
    const userResponse = await request(app).post("/signup").send({
      name: "Test Session",
      email: "testuser@example.com",
      password: "pass123",
    })

    expect(userResponse.status).toBe(201)
    expect(userResponse.body).toHaveProperty("id")
    expect(userResponse.body.name).toBe("Test Session")

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/login").send({
      email: "testuser@example.com",
      password: "pass123",
    })

    expect(sessionResponse.status).toBe(201)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})
