import { prisma } from "../config/db.js"
import { hashPassword, verifyPassword, createToken } from "../auth/auth.js"

const checkingUser = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    })
}

export const createUser = async (req, res) => {
    try {
        const { name, email, role, password, orgId } = req.body

        const checkUser = await checkingUser(email)

        if (checkUser) {
            return res.status(400).json({ message: "User Already Exists!" });
        }

        const hashing = await hashPassword(password)

        if (hashing.status !== 200) {
            return res.status(hashing.status).json({ message: hashing.message })
        }

        const createUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                orgId,
                password: hashing.password
            }
        })

        if (!createUser) {
            return res.status(400).json({ status: 400, message: "Failed to create user!" })
        }

        return res.status(200).json({ status: 200, message: "User Created Successfully" })

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Failed to create user!" })
    }
}

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        const checkUser = await checkingUser(email);

        if (!checkUser) {
            res.status(400).json({ message: "User does not exists!" })
        }

        const comparePassword = await verifyPassword(password, checkUser.password);

        if (comparePassword.status !== 200) {
            return res.status(comparePassword.res).json({ message: comparePassword.message })
        }

        const creatingToken = createToken({ id: checkUser.id, email: checkUser.email, name: checkUser.name, orgId: checkUser.orgId, role: checkUser.role });

        if (creatingToken.status !== 200) {
            return res.status(creatingToken.status).json({ message: creatingToken.message })
        }

        return res.status(creatingToken.status).json({ message: creatingToken.message, token: creatingToken.token })

    } catch (error) {
        return res.status(400).json({ message: "Failed to login user!" })
    }
}