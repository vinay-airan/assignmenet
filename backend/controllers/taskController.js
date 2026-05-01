const Task = require("../models/Task");
const Project = require("../models/Project");

// POST /api/tasks  [admin only]
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, status } = req.body;

    if (!title || !projectId || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "title, projectId, assignedTo, and dueDate are required." });
    }

    // Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Auto-add assignee to project members if not already in
    const alreadyMember = project.members.map(String).includes(assignedTo.toString());
    if (!alreadyMember) {
      project.members.push(assignedTo);
      await project.save();
    }

    const task = await Task.create({
      title,
      description: description || "",
      projectId,
      assignedTo,
      dueDate,
      status: status || "todo",
    });

    await task.populate("assignedTo", "name email");
    await task.populate("projectId", "name");

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: "Could not create task.", error: err.message });
  }
};

// GET /api/tasks  — admin: all tasks | member: only assigned
const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch tasks.", error: err.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    if (!task) return res.status(404).json({ message: "Task not found." });

    // Members can only view their own tasks
    if (
      req.user.role === "member" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied to this task." });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch task.", error: err.message });
  }
};

// PATCH /api/tasks/:id  — admin: update any field | member: update only status of own tasks
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (req.user.role === "member") {
      // Members may only update status of tasks assigned to them
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only update your own tasks." });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Members can only update the status field." });
      }

      const allowed = ["todo", "in-progress", "done"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
      }

      task.status = status;
    } else {
      // Admin can update all fields
      const { title, description, assignedTo, dueDate, status, projectId } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
      if (projectId) task.projectId = projectId;
    }

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("projectId", "name");

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: "Could not update task.", error: err.message });
  }
};

// DELETE /api/tasks/:id  [admin only]
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete task.", error: err.message });
  }
};

// GET /api/tasks/stats  — dashboard stats
const getTaskStats = async (req, res) => {
  try {
    const filter = req.user.role === "member" ? { assignedTo: req.user._id } : {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, completed, overdue] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: "done" }),
      Task.countDocuments({ ...filter, dueDate: { $lt: today }, status: { $ne: "done" } }),
    ]);

    res.json({ stats: { total, completed, overdue, inProgress: total - completed - overdue } });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch stats.", error: err.message });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats };