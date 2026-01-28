const requiredRole = (...allowedRoles) => {
    return (req, res, next) => {

        const decision = allowedRoles.includes(req.user.role);

        if (!decision) {
            return res.status(403).json({ message: "User is forbidden!" })
        }

        next()
    }
}

export default requiredRole