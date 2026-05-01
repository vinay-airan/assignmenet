import { useState, useEffect } from "react";
import { submitNewWork } from "../api/workRequests";
import { fetchWorkspaces } from "../api/workRequests";
import { fetchTeamMembers } from "../api/workRequests";

const BLANK = {
  title: "", description: "",
  projectId: "", assignedTo: "",
  dueDate: "", status: "todo",
};

export default function AddTaskPopup({ onClose, onCreated }) {
  const [fields,    setFields]    = useState(BLANK);
  const [projects,  setProjects]  = useState([]);
  const [teammates, setTeammates] = useState([]);
  const [saving,    setSaving]    = useState(false);
  const [errMsg,    setErrMsg]    = useState("");

  useEffect(() => {
fetchWorkspaces().then((res) => {
  console.log("PROJECT API FULL:", res);
  console.log("PROJECT API DATA:", res.data);

  // handle all possible formats
  if (Array.isArray(res.data)) {
    setProjects(res.data);
  } else if (Array.isArray(res.data.projects)) {
    setProjects(res.data.projects);
  } else {
    setProjects([]);
  }
});
    fetchTeamMembers().then(({ data }) => setTeammates(data.users || []));
  }, []);

  const patch = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, projectId, assignedTo, dueDate } = fields;
    if (!title || !projectId || !assignedTo || !dueDate) {
      setErrMsg("Title, project, assignee, and due date are required.");
      return;
    }
    setSaving(true);
    setErrMsg("");
          console.log("FINAL FIELDS:", fields);

    try {
      const { data } = await submitNewWork(fields);
      onCreated(data.task);
      onClose();
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Could not create task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-950/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-forge-900 border border-forge-600 rounded-lg
        overflow-hidden animate-slide-up shadow-2xl shadow-black/50">

        {/* Amber top strip */}
        <div className="h-px bg-gradient-to-r from-ember-400 via-ember-500 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-forge-700">
          <div>
            <h2 className="font-display text-white text-lg">New Task</h2>
            <p className="text-forge-500 text-xs font-mono mt-0.5">Fill in task details</p>
          </div>
          <button onClick={onClose}
            className="text-forge-500 hover:text-steel-300 font-mono text-lg leading-none transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {errMsg && (
            <div className="bg-red-950/40 border border-red-800/50 rounded px-3 py-2 text-red-400 text-xs font-mono">
              {errMsg}
            </div>
          )}

          {/* Title */}
          <Field label="Task Title" required>
            <input
              type="text"
              value={fields.title}
              onChange={patch("title")}
              placeholder="e.g. Redesign hero section"
              className="forge-field"
              disabled={saving}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={fields.description}
              onChange={patch("description")}
              placeholder="Additional context..."
              rows={2}
              className="forge-field resize-none"
              disabled={saving}
            />
          </Field>

          {/* Project + Assignee row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project" >
<select
  value={fields.projectId}
  onChange={(e) => {
    const value = e.target.value;
    console.log("SELECT PROJECT:", value);

    setFields((prev) => ({
      ...prev,
      projectId: value,
    }));
  }}
  className="forge-field"
>
  <option value="">Select…</option>
  {projects.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>
            </Field>

            <Field label="Assign To" required>
              <select value={fields.assignedTo} onChange={patch("assignedTo")}
                className="forge-field" disabled={saving}>
                <option value="">Select…</option>
                {teammates.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Due date + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due Date" required>
              <input
                type="date"
                value={fields.dueDate}
                onChange={patch("dueDate")}
                className="forge-field"
                disabled={saving}
              />
            </Field>

            <Field label="Status">
              <select value={fields.status} onChange={patch("status")}
                className="forge-field" disabled={saving}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 bg-forge-800 hover:bg-forge-700 border border-forge-600
                text-steel-400 font-mono text-xs py-3 rounded transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-ember-400 hover:bg-ember-500 disabled:opacity-50
                text-forge-950 font-mono font-semibold text-xs py-3 rounded
                transition-colors disabled:cursor-not-allowed">
              {saving ? "Creating…" : "Create Task →"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .forge-field {
          width: 100%;
          background: #1a1a1e;
          border: 1px solid #32323a;
          color: #cbd5e1;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          padding: 0.6rem 0.875rem;
          border-radius: 0.375rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .forge-field:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b40;
        }
        .forge-field option { background: #1a1a1e; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-steel-500 tracking-widest uppercase font-mono">
        {label}{required && <span className="text-ember-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
