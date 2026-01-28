import expressRouter from "express";

import { authMiddleware } from "../middleware/authMiddleware.js"
import { validationMiddleware, restrictTaskEdit } from "../middleware/validationMiddleware.js"
import roleRequired from "../middleware/roleMiddleware.js"

import { createTask, editTask, getAllTasks, deleteTask } from "../controllers/tasksController.js"
import { taskCreationSchema, taskEditSchema } from "../validations/validation.js";


const taskRouter = expressRouter();


taskRouter.use(authMiddleware);

taskRouter.post("/create/:projectId", validationMiddleware(taskCreationSchema), createTask);
taskRouter.get("/get/:projectId", getAllTasks)
taskRouter.patch("/edit/:taskId", restrictTaskEdit, validationMiddleware(taskEditSchema), editTask)
taskRouter.delete("/delete/:taskId", roleRequired("Manager", "Admin"), deleteTask)

export default taskRouter