import jwt from "jsonwebtoken"



export const authMiddleware = (req, res, next) => {

    try {

        const authHeaders = req.headers.authorization || req.headers.Authorization

        if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Invalid Token!" })
        }

        const token = authHeaders.split(" ")[1];

        const validateToken = jwt.verify(token, process.env.SECT);

        if (!validateToken) {
            return res.status(401).json({ message: "Unauthorized user!" })
        }

        req.user = { id: validateToken.id, name: validateToken.name, email: validateToken.email, orgId: validateToken.orgId, role: validateToken.role }

        next();

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized user!" })
    }

}