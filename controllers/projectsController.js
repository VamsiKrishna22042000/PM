import { prisma } from "../config/db.js"

export const createProject = async (req, res) => {
    try {

        const { name, description, status, createdBy } = req.body

        const createProject = await prisma.project.create({
            data: {
                name,
                description,
                status,
                orgId: req.user.orgId,
                createdBy
            }
        })

        if (!createProject) {
            res.status(400).json({ message: "Failed to create project!", error: err.message })
        }

        return res.status(201).json({ message: "Project created successfully!", data: createProject })


    } catch (err) {
        return res.status(400).json({ message: "Failed to create project!", error: err.message })
    }
}

export const getPbyProjectId = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit


        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where: { id: req.params.id },
                skip,
                take: limit,
            }),
            prisma.project.count({ where: { id: req.params.id } }),
        ])

        if (!projects) {
            return res.status(400).json({ message: "Failed to get projects!" });
        }

        return res.status(200).json({ message: "Successfully fetched projects", data: { projects, page, limit, totalItems: total, totalPages: Math.ceil(total / limit) } })


    } catch (err) {
        return res.status(400).json({ message: "Failed to get Projects", err: err.message })
    }
}

export const getProjectsByorgid = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [orgProjects, count] = await Promise.all([
            prisma.project.findMany({
                where: { orgId: req.user.orgId },
                skip,
                take: limit,
            }),
            prisma.project.count({
                where: { orgId: req.user.orgId },
            }),
        ]);

        return res.status(200).json({
            message: "Fetched Projects Successfully!",
            data: {
                projects: orgProjects,
                page,
                totalProjects: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to get the projects!",
        });
    }
};

export const editProject = async (req, res) => {
    try {

        const { name, description, status } = req.body

        const editProject = await prisma.project.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                status
            }
        })

        if (!editProject) {
            return res.status(400).json({ message: "Failed to edit project!" })
        }


        return res.status(200).json({ message: "Successfully created project!" })


    } catch (err) {
        return res.status(400).json({ message: 'Failed to edit project!', err: err.message })
    }
}

export const deleteProjects = async (req, res) => {
    try {
        const id = req.params.id

        const deleteProject = await prisma.project.delete({
            where: { id }
        })

        if (!deleteProject) {
            return res.status(400).json({ message: "Failed to delete project" })
        }

        return res.status(200).json({ message: "Project deleted successfully!" })

    } catch (err) {
        return res.status(400).json({ message: "Failed to delete project!" })
    }
}