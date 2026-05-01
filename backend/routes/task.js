const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
console.log("TASK ROUTES LOADED");
// All task routes require authentication
router.use(authMiddleware);


router.get("/stats", getTaskStats);                         // admin & member (filtered)
router.post("/", roleMiddleware("admin"), createTask);      // admin only
router.get("/", getTasks);                                  // filtered by role
router.get("/:id", getTaskById);                            // filtered by role
router.patch("/:id", updateTask);                           // role logic inside controller
router.delete("/:id", roleMiddleware("admin"), deleteTask); // admin only

module.exports = router;