/**
 * roleMiddleware — factory function that accepts one or more allowed roles.
 * Usage: router.post("/projects", authMiddleware, roleMiddleware("admin"), createProject)
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}.`,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;