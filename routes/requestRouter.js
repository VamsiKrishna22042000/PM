import expressRouter from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createRequest, editRequest, deleteRequest, getAllRequests } from "../controllers/requestController.js"
import requiredRole from "../middleware/roleMiddleware.js"
import { validationMiddleware } from "../middleware/validationMiddleware.js"
import { requestCreateSchema, requestEditSchema } from "../validations/validation.js"


const requestRouter = expressRouter()

requestRouter.use(authMiddleware)

requestRouter.post("/createRequest/:taskId", validationMiddleware(requestCreateSchema), createRequest)
requestRouter.put("/edit/:id", requiredRole("Manager", "Admin"), validationMiddleware(requestEditSchema), editRequest)
requestRouter.delete("/delete/:id", requiredRole("Manager", "Admin"), deleteRequest)
requestRouter.get("/get", requiredRole("Admin", "Manager"), getAllRequests)

export default requestRouter;