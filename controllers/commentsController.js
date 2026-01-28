import { prisma } from "../config/db.js";


export const createComment = async (req, res) => {
    try {

        const { description, userId } = req.body


        const createC = await prisma.comments.create({
            data: {
                description,
                taskId: req.params.taskId,
                userId: userId
            }
        })

        if (!createC) {
            return res.status(400).json({ message: "Failed to create comment!" })
        }

        return res.status(201).json({ message: "Comment created successfully!" })


    } catch (err) {
        return res.status(500).json({ message: "Failed to create comment!" })
    }
}

export const editComment = async (req, res) => {
    try {

        const { description } = req.body


        const createC = await prisma.comments.update({
            where: { id: req.params.id },
            data: {
                description,
            }
        })

        if (!createC) {
            return res.status(400).json({ message: "Failed to update comment!" })
        }

        return res.status(201).json({ message: "Comment updated successfully!" })


    } catch (err) {
        return res.status(500).json({ message: "Failed to update comment!" })
    }
}

export const getComment = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const [getC, count] = await Promise.all([
            prisma.comments.findMany({
                where: { taskId: req.params.taskId },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.comments.count({
                where: { taskId: req.params.taskId }
            })
        ]);


        return res.status(200).json({ message: 'Comments obtained successfully', data: { comments: getC, page, limit, totalComments: count, totalPages: Math.ceil(count / limit) } })

    } catch (err) {
        return res.status(500).json({ message: "Failed to get Comments" })
    }
}

export const deleteComment = async (req, res) => {
    try {

        const createC = await prisma.comments.delete({ where: { id: req.params.id } })

        if (!createC) {
            return res.status(400).json({ message: "Failed to delete comment!" })
        }

        return res.status(201).json({ message: "Comment deleted successfully!" })


    } catch (err) {
        return res.status(500).json({ message: "Failed to delete comment!" })
    }
}