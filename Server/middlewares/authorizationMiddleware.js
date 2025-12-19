const jwt = require("jsonwebtoken");

const validateJWTToken = (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        // The token’s signature is valid (i.e., created using your SECRET_KEY).
        // The token hasn’t expired.

        req.body = { email: decode?.email, userId: decode?.userId, ...req.body };
        
        next();
    } catch (error) {
        res.status(401);
        next(error);
    }
};

module.exports = {
    validateJWTToken,
};

