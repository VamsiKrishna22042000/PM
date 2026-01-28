import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt)

        if (hashed) {
            return { status: 200, password: hashed }
        }

        return { status: 400, message: "Failed to hash password!" }

    } catch (err) {
        return { status: 400, message: "Failed to hash password!" }
    }
}


export const verifyPassword = async (password, hashedPassword) => {
    try {
        const verify = await bcrypt.compare(password, hashedPassword);

        if (verify) {
            return { status: 200, verify }
        }

        return { status: 400, message: "Incorrect Password!" }

    } catch (err) {
        return { status: 400, message: "Failed to verify password!" }
    }
}

export const createToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.SECT, { expiresIn: "30m" })
        return { status: 200, message: "User Logged In Successfully!", token }
    } catch (err) {
        return { status: 500, message: "Failed to create token!", error: err.message }
    }
}
