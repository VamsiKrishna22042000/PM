import { prisma } from "../config/db.js"


export const createTask = async (req, res) => {
    try {
        const { name, pointers, type, priority, description, stage, startTime, endTime, createdBy, assignedTo } = req.body

        const createTask = await prisma.task.create({
            data: {
                name,
                pointers,
                type,
                priority,
                description,
                stage,
                startTime,
                endTime,
                projectId: req.params.projectId,
                createdBy,
                assignedTo
            }
        })

        if (!createTask) {
            return res.status(400).json({ message: "Failed to create task!" })
        }

        return res.status(201).json({ message: "Task Created Successfully!" })


    } catch (err) {
        return res.status(500).json({ message: "Failed to create a task!" })
    }
}

export const getAllTasks = async (req, res) => {

    try {

        if (req.query.taskId) {

            const getTask = await prisma.task.findFirst({
                where: { projectId: req.params.projectId, id: req.query.taskId }
            })

            if (!getTask) {
                return res.status(400).json({ message: "Failed to get task!" })
            }


            return res.status(200).json({ message: 'Task obtained successfully!', data: getTask })


        } else {

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const skip = (page - 1) * limit;

            const whereClause = {
                projectId: req.params.projectId,
                ...(req.query.userId && { assignedTo: req.query.userId }),
            };

            const [getAllTasks, count] = await Promise.all([
                prisma.task.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                }),
                prisma.task.count({
                    where: whereClause,
                }),
            ]);

            if (!getAllTasks) {
                return res.status(400).json({ message: "Failed to get tasks!" })
            }

            return res.status(200).json({ message: "Tasks fetched Successfully!", data: { tasks: getAllTasks, page, limit, totalPages: Math.ceil(count / limit), totalTasks: count } })
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to get tasks!" })
    }

}

export const editTask = async (req, res) => {
    try {
        const {
            name,
            pointers,
            type,
            priority,
            description,
            stage,
            startTime,
            endTime,
            assignedTo
        } = req.body;

        const updateData = Object.fromEntries(
            Object.entries({
                name,
                pointers,
                type,
                priority,
                description,
                stage,
                startTime,
                endTime,
                assignedTo
            }).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.taskId },
            data: updateData
        });

        return res.status(200).json({
            message: "Task updated successfully!",
            data: updatedTask
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to update task!" });
    }
};

export const deleteTask = async (req, res) => {
    try {

        const deleteT = await prisma.task.delete({
            where: { id: req.params.taskId }
        })

        if (!deleteT) {
            return res.status(400).json({ message: "Failed to delete task!" })
        }

        return res.status(200).json({ message: "Task deleted successfully!" })

    } catch (error) {
        return res.status(500).json({ message: "Failed to delete task!" })
    }
}