import expressRouter from "express"
import { createProject, getPbyProjectId, editProject, deleteProjects, getProjectsByorgid } from "../controllers/projectsController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { validationMiddleware } from "../middleware/validationMiddleware.js"
import { projectsSchema, editProjectsSchema } from "../validations/validation.js"
import requiredRole from "../middleware/roleMiddleware.js"


const projectsRouter = expressRouter()

projectsRouter.use(authMiddleware)

projectsRouter.post("/createProject", requiredRole("Manager", "Admin"), validationMiddleware(projectsSchema), createProject)
projectsRouter.get("/getPbyProjectId/:id", getPbyProjectId)
projectsRouter.get("/getPbyorg/:orgId", getProjectsByorgid)
projectsRouter.put("/editProjects/:id", requiredRole("Manager", "Admin"), validationMiddleware(editProjectsSchema), editProject)
projectsRouter.delete("/deleteProjects/:id", requiredRole("Manager", "Admin"), deleteProjects)



export default projectsRouter