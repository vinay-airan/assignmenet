import forgeClient from "./forgeClient";

// ── Tasks ──────────────────────────────────────────────
export const fetchWorkItems = (params = {}) =>
  forgeClient.get("/tasks", { params });

export const fetchWorkStats = () =>
  forgeClient.get("/tasks/stats");

export const submitNewWork = (payload) =>
  forgeClient.post("/tasks", payload);

export const patchWorkStatus = (taskId, body) =>
  forgeClient.patch(`/tasks/${taskId}`, body);

export const removeWorkItem = (taskId) =>
  forgeClient.delete(`/tasks/${taskId}`);

// ── Projects ───────────────────────────────────────────
export const fetchWorkspaces = () =>
  forgeClient.get("/projects");

export const createWorkspace = (payload) =>
  forgeClient.post("/projects", payload);

// ── Users ──────────────────────────────────────────────
export const fetchTeamMembers = () =>
  forgeClient.get("/users");
