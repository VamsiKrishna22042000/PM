import expressRouter from "express"
import rateLimit from "express-rate-limit"
import { createUser, loginUser } from "../controllers/userController.js"
import { validationMiddleware, validateOrganization } from "../middleware/validationMiddleware.js"
import { userSchema, userLoginSchema } from "../validations/validation.js"



const userRouter = expressRouter()

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: "Too many attempts, try again later.",
});

userRouter.post("/signup", validationMiddleware(userSchema), validateOrganization(), createUser)
userRouter.post("/signin", authLimiter, validationMiddleware(userLoginSchema), loginUser)


export default userRouter