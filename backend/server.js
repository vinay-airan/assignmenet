require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

const app = express();

// ─── Database ─────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://assignmenet-m8bi.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/projects", require("./routes/project.js"));
app.use("/api/tasks", require("./routes/task.js"));
app.use("/api/users", require("./routes/users.js"));

// ─── Health check ─────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ─── 404 handler ─────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// ─── Global error handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error.", error: err.message });
});

// ─── Start ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));