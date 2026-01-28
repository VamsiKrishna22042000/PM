import { prisma } from "../config/db.js"

export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((err) => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }

        next();
    };
};

export const validateOrganization = () => {
    return async (req, res, next) => {
        const { email } = req.body

        const getOrg = email.split("@")[1].split(".")[0];

        const checkEmail = await prisma.org.findFirst({
            where: { key: getOrg }
        });

        if (!checkEmail) {
            return res.status(400).json({ message: `No organization is present with name ${getOrg}` })
        }

        next()
    }
}

export const restrictTaskEdit = (req, res, next) => {
    const { type, pointers, startTime, endTime } = req.body;

    const restrictedFields = { type, pointers, startTime, endTime };

    const isEditingRestrictedField = Object.values(restrictedFields).some(
        (value) => value !== undefined
    );

    if (isEditingRestrictedField && !["Manager", "Admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "You do not have permission to edit these fields."
        });
    }

    next();
};
