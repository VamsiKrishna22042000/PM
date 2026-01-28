import expressRouter from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createComment, getComment, editComment, deleteComment } from "../controllers/commentsController.js"


const commentsRouter = expressRouter()


commentsRouter.use(authMiddleware)

commentsRouter.post("/create/:taskId", createComment)
commentsRouter.get("/get/:taskId", getComment)
commentsRouter.put("/edit/:id", editComment)
commentsRouter.delete("/delete/:id", deleteComment)

export default commentsRouter