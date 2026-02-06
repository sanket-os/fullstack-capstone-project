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
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing or malformed",
            });
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        // The token’s signature is valid (i.e., created using your SECRET_KEY).
        // The token hasn’t expired.

        req.body = { email: decode?.email, userId: decode?.userId, ...req.body };

        // >>>>>>>>>>>>>>>> GPT RES

        /**
        * IMPORTANT:
        * JWT-derived fields MUST override client-supplied fields
        * to maintain trust boundary.
        */

        // req.body = {
        //     ...req.body,              // client input (untrusted)
        //     userId: decoded.userId,   // server-trusted
        //     email: decoded.email,
        //     role: decoded.role,
        // };

        next();
    } catch (error) {
        res.status(401);
        next(error);
    }
};

module.exports = {
    validateJWTToken,
};

