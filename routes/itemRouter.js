import expressRouter from "express"
import rateLimit from "express-rate-limit"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js"
import { itemRequest, itemMultipleRequest } from "../validations/validation.js"
import { getSingleItem, getMultipleItems } from "../controllers/itemController.js"


const itemRouter = expressRouter();

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 2,
    message: "Too many attempts, try after 5 mins.",
});

itemRouter.use(authMiddleware);

itemRouter.post("/createSingle", validationMiddleware(itemRequest), authLimiter, getSingleItem);
itemRouter.post("/createMultiple", validationMiddleware(itemMultipleRequest), authLimiter, getMultipleItems);

export default itemRouter