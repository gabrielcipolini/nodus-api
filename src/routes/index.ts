import { Router } from "express"

import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { teamsRoutes } from "./teams-routes"
import { teamMembersRoutes } from "./team-members-routes"
import { tasksRoutes } from "./tasks-routes"
import { taskHistoryRoutes } from "./task-history-routes"

const routes = Router()

routes.use("/signup", usersRoutes)
routes.use("/login", sessionsRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/teams", teamMembersRoutes)
routes.use("/teams", tasksRoutes)
routes.use("/teams", taskHistoryRoutes)

export { routes }
