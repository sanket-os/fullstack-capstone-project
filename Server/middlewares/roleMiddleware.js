/**
 * ----------------------------------------------------
 * Role-Based Authorization Middleware (RBAC)
 * ----------------------------------------------------
 * Usage:
 * authorizeRoles("admin")
 * authorizeRoles("admin", "partner")
 */
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Role not found.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action",
        });
      }

      next();
    } catch (error) {
      res.status(403);
      next(error);
    }
  };
};

module.exports = {
  allowRoles,
};
