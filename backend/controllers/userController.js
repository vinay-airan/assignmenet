const User = require("../models/User");

// GET /api/users  [admin only] — for assigning tasks / adding members
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role").sort({ name: 1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch users.", error: err.message });
  }
};

module.exports = { getUsers };