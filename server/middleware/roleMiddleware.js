const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        // check role access
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    };
};

module.exports = {
    authorizeRoles,
};