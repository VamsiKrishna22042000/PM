import express from "express"
import helmet from "helmet"
import cors from "cors"
import { config } from "dotenv"

//Routes
import userRouter from "./routes/userRouter.js"
import projectsRouter from "./routes/projectsRouter.js"
import taskRouter from "./routes/tasksRouter.js"
import commentsRouter from "./routes/commentsRouter.js"
import requestRouter from "./routes/requestRouter.js"
import itemRouter from "./routes/itemRouter.js"

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

config()

app.use("/user", userRouter);
app.use("/projects", projectsRouter);
app.use("/tasks", taskRouter);
app.use("/comments", commentsRouter);
app.use("/requests", requestRouter);
app.use("/item", itemRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
