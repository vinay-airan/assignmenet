const Project = require("../models/Project");
const User = require("../models/User");

// POST /api/projects  [admin only]
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    // Validate member IDs if provided
    let validMembers = [];
    if (Array.isArray(members) && members.length > 0) {
      const found = await User.find({ _id: { $in: members } }).select("_id");
      validMembers = found.map((u) => u._id);
    }

    // Always include the creator as a member
    const memberSet = new Set([...validMembers.map(String), req.user._id.toString()]);

    const project = await Project.create({
      name,
      description: description || "",
      members: [...memberSet],
      createdBy: req.user._id,
    });

    await project.populate("members", "name email role");
    await project.populate("createdBy", "name email");

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: "Could not create project.", error: err.message });
  }
};

// GET /api/projects  — admin sees all, member sees only their projects
const getProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch projects.", error: err.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Members can only view projects they belong to
    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
    if (req.user.role !== "admin" && !isMember) {
      return res.status(403).json({ message: "Access denied to this project." });
    }

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch project.", error: err.message });
  }
};

// PATCH /api/projects/:id/members  [admin only] — add members
const addMembers = async (req, res) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Provide an array of user IDs." });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const found = await User.find({ _id: { $in: members } }).select("_id");
    const newIds = found.map((u) => u._id.toString());
    const existing = project.members.map(String);

    const merged = [...new Set([...existing, ...newIds])];
    project.members = merged;
    await project.save();
    await project.populate("members", "name email role");

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: "Could not add members.", error: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMembers };