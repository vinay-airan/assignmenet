import { useState } from "react";
import { useSession } from "../hooks/useSession";

const STATUS_CYCLE = {
  todo:        { next: "in-progress", label: "Start",    color: "text-steel-400" },
  "in-progress": { next: "done",        label: "Complete", color: "text-amber-400" },
  done:        { next: "todo",         label: "Reopen",   color: "text-emerald-400" },
};

const PRIORITY_COLORS = {
  overdue:  "border-l-red-500",
  upcoming: "border-l-ember-400",
  normal:   "border-l-forge-600",
};

function duePriority(dateStr) {
  if (!dateStr) return "normal";
  const due  = new Date(dateStr);
  const now  = new Date();
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "overdue";
  if (diff < 3) return "upcoming";
  return "normal";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function TaskItem({ item, onStatusChange, onRemove }) {
  const { isAdmin } = useSession();
  const [shifting,  setShifting]  = useState(false);
  const [removing,  setRemoving]  = useState(false);

  const priority    = duePriority(item.dueDate);
  const borderClass = PRIORITY_COLORS[priority];
  const statusMeta  = STATUS_CYCLE[item.status] || STATUS_CYCLE.todo;

  const handleShift = async () => {
    setShifting(true);
    await onStatusChange(item._id, statusMeta.next);
    setShifting(false);
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove this task?")) return;
    setRemoving(true);
    await onRemove(item._id);
  };

  return (
    <article
      className={`bg-forge-800 border border-forge-700 border-l-2 ${borderClass}
        rounded-md p-4 flex flex-col gap-3 group
        hover:border-forge-500 transition-all duration-200
        ${removing ? "opacity-30 scale-95" : "opacity-100 scale-100"}`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-steel-300 font-mono text-sm font-medium leading-snug flex-1">
          {item.title}
        </h3>
        {isAdmin && (
          <button
            onClick={handleRemove}
            className="text-forge-500 hover:text-red-400 font-mono text-xs
              opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0"
            title="Delete task"
          >
            ✕
          </button>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-forge-500 font-mono text-xs leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        {/* Assignee */}
        {item.assignedTo && (
          <span className="flex items-center gap-1 bg-forge-700 px-2 py-0.5 rounded text-steel-400">
            <span className="text-forge-500">@</span>
            {item.assignedTo.name || "unassigned"}
          </span>
        )}

        {/* Project */}
        {item.projectId?.name && (
          <span className="text-forge-500 px-2 py-0.5 rounded border border-forge-700">
            {item.projectId.name}
          </span>
        )}

        {/* Due date */}
        <span className={`ml-auto ${priority === "overdue" ? "text-red-400" : priority === "upcoming" ? "text-ember-400" : "text-forge-500"}`}>
          {priority === "overdue" && "⚠ "}
          {formatDate(item.dueDate)}
        </span>
      </div>

      {/* Status action */}
      <button
        onClick={handleShift}
        disabled={shifting}
        className={`w-full text-left text-xs font-mono px-3 py-2 rounded
          border border-forge-700 hover:border-forge-500 bg-forge-900
          flex items-center justify-between transition-all duration-150
          disabled:opacity-40 ${statusMeta.color}`}
      >
        <span>{shifting ? "Updating…" : statusMeta.label}</span>
        <span className="text-forge-500">→</span>
      </button>
    </article>
  );
}
