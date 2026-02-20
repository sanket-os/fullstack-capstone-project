const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

/**
 * ----------------------------------------------------
 * JWT Authentication Middleware
 * ----------------------------------------------------
 * Verifies JWT token and attaches authenticated
 * user information to req.body
 */
const validateJWTToken = (req, res, next) => {
    try { 
        const token = req.cookies?.bms_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // The token’s signature is valid (i.e., created using your SECRET_KEY).
        // The token hasn’t expired.

        req.user = { 
            userId: decoded?.userId, 
            email: decoded?.email, 
            role: decoded?.role, 
            // ...req.body 
        };

        next();
    } catch (error) {
        return next(
            new AppError(401, "TOKEN_INVALID", "Invalid or expired token")
        );
    }
};

module.exports = {
    validateJWTToken,
};

