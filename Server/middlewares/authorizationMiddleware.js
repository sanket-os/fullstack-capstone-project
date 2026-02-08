const jwt = require("jsonwebtoken");

/**
 * ----------------------------------------------------
 * JWT Authentication Middleware
 * ----------------------------------------------------
 * Verifies JWT token and attaches authenticated
 * user information to req.body
 */
const validateJWTToken = (req, res, next) => {
    try { 
        const token = req.cookies.bms_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        // The token’s signature is valid (i.e., created using your SECRET_KEY).
        // The token hasn’t expired.

        req.body = { email: decode?.email, userId: decode?.userId, role: decode?.role, ...req.body };

        next();
    } catch (error) {
        res.status(401);
        next(error);
    }
};

module.exports = {
    validateJWTToken,
};

