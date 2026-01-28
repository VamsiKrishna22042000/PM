import { prisma } from "../config/db.js"

export const createRequest = async (req, res) => {
    try {
        const { name, description, assignedTo, createdBy } = req.body

        const checkRole = await prisma.user.findUnique({
            where: { id: assignedTo },
            select: { role: true }
        })


        if (!checkRole || !["Manager", "Admin"].includes(checkRole.role)) {
            return res.status(403).json({ message: "User is forbidden!" })
        }

        const where = {};

        ["type", "pointers", "startTime", "endTime"].forEach((key) => {
            if (req.body[key] !== undefined) {
                where[key] = req.body[key]
            }
        })


        console.log(where, "hi")

        const createR = await prisma.request.create({
            data: {
                name, description, ...where, assignedTo, createdBy, taskId: req.params.taskId
            }
        })

        if (!createR) {
            return res.status(400).json({ message: "Failed to create request!" })
        }

        return res.status(201).json({ message: "Request Created Successfully!" })


    } catch (err) {
        return res.status(500).json({ message: "Failed to create request!", error: err.message })
    }
}

export const editRequest = async (req, res) => {
    const { requestStatus, approvedRejectedAt, rejectedReason } = req.body;

    try {
        // Fetch existing request (no transaction needed)
        const existingRequest = await prisma.request.findUnique({
            where: { id: req.params.id }
        });

        if (!existingRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Block re-processing
        if (existingRequest.requestStatus === "Approved") {
            return res.status(400).json({ message: "Request already approved!" });
        }

        if (existingRequest.requestStatus === "Rejected") {
            return res.status(400).json({ message: "Request already rejected!" });
        }

        // Approval → transaction (request + task)
        if (requestStatus === "Approved") {
            const result = await prisma.$transaction(async (tx) => {
                const editR = await tx.request.update({
                    where: { id: req.params.id },
                    data: {
                        requestStatus,
                        approvedRejectedAt,
                        approvedBy: req.user.id
                    }
                });

                const updatedTaskData = Object.fromEntries(
                    Object.entries({
                        type: existingRequest.type,
                        pointers: existingRequest.pointers,
                        startTime: existingRequest.startTime,
                        endTime: existingRequest.endTime
                    }).filter(([_, value]) => value != null)
                );


                const editT = await tx.task.update({
                    where: { id: existingRequest.taskId },
                    data: updatedTaskData
                });

                return { editR, editT };
            });

            return res.status(200).json({
                message: "Request approved successfully!",
                request: result.editR,
                task: result.editT
            });
        }

        // Rejection → single update
        const editR = await prisma.request.update({
            where: { id: req.params.id },
            data: {
                requestStatus,
                approvedRejectedAt,
                rejectedReason,
                approvedBy: req.user.id
            }
        });

        return res.status(200).json({
            message: "Request rejected successfully!",
            request: editR
        });

    } catch (err) {
        console.error("Edit request failed:", err);
        return res.status(500).json({ message: "Failed to edit request!" });
    }
};


export const getAllRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const { requestId, taskId, assignedId } = req.query

        if (requestId) {
            const request = await prisma.request.findUnique({
                where: { id: requestId }
            })

            if (!request) {
                return res.status(404).json({ message: "Request not found" })
            }

            return res.status(200).json({
                message: "Successfully fetched request",
                data: request
            })
        }

        const where = {}

        if (taskId) {
            where.taskId = taskId
        }

        if (assignedId) {
            where.assignedTo = assignedId
        }

        const [requests, count] = await Promise.all([
            prisma.request.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' } // optional but recommended
            }),
            prisma.request.count({ where })
        ])

        return res.status(200).json({
            message: "Successfully fetched requests",
            data: {
                requests,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                totalRequests: count
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


export const deleteRequest = async (req, res) => {
    try {

        const deleteR = await prisma.request.delete({
            where: { id: req.params.id }
        })

        if (!deleteR) {
            return res.status(400).json({ message: "Faield to delete request!" })
        }

        return res.status(200).json({ message: "Request deleted successfully!" })

    } catch (err) {
        return res.status(500).json({ message: "Failed to delete request!" })
    }
}
