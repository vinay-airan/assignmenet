const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  addMembers,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All project routes require a valid JWT
router.use(authMiddleware);

router.post("/", roleMiddleware("admin"), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id/members", roleMiddleware("admin"), addMembers);

module.exports = router;