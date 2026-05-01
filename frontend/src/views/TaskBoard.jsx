import { useState } from "react";
import Topbar from "../ui/Topbar";
import TaskItem from "../ui/TaskItem";
import AddTaskPopup from "../ui/AddTaskPopup";
import StatsStrip from "../ui/StatsStrip";
import { useWorkItems } from "../hooks/useWorkItems";
import { useSession } from "../hooks/useSession";

const COLUMN_SCHEMA = [
  {
    key:     "pending",
    heading: "Pending",
    badge:   "todo",
    accent:  "border-t-steel-500",
    dot:     "bg-steel-500",
  },
  {
    key:     "ongoing",
    heading: "Ongoing",
    badge:   "in-progress",
    accent:  "border-t-ember-400",
    dot:     "bg-ember-400",
  },
  {
    key:     "completed",
    heading: "Completed",
    badge:   "done",
    accent:  "border-t-emerald-500",
    dot:     "bg-emerald-500",
  },
];

function ColumnHeader({ col, count }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 px-1">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
      <h2 className="font-mono text-xs uppercase tracking-widest text-steel-400">
        {col.heading}
      </h2>
      <span className="ml-auto bg-forge-700 text-forge-400 font-mono text-xs
        px-2 py-0.5 rounded-full min-w-[24px] text-center">
        {count}
      </span>
    </div>
  );
}

function EmptySlot({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2
      border border-dashed border-forge-700 rounded-md">
      <span className="text-forge-600 text-xl">◻</span>
      <p className="text-forge-500 font-mono text-xs">No {label} tasks</p>
    </div>
  );
}

export default function TaskBoard() {
  const { isAdmin } = useSession();
  const [popupOpen, setPopupOpen] = useState(false);
  const { buckets, loading, fetchErr, reload, changeStatus, dropItem } = useWorkItems();

  const handleTaskCreated = (newTask) => {
    reload();
  };

  return (
    <div className="noise-layer min-h-screen bg-forge-950">
      <GridLines />

      <Topbar onAddTask={isAdmin ? () => setPopupOpen(true) : null} />

      <main className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 py-7">

        {/* Stats */}
        <StatsStrip />

        {/* Page title */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display text-white text-xl">
            Work Board
          </h1>
          <div className="flex-1 h-px bg-forge-700" />
          <button onClick={reload}
            className="text-forge-500 hover:text-steel-400 font-mono text-xs
              transition-colors flex items-center gap-1">
            ↻ Refresh
          </button>
        </div>

        {/* Error */}
        {fetchErr && (
          <div className="mb-6 bg-red-950/40 border border-red-800/50 rounded px-4 py-3
            text-red-400 font-mono text-sm">
            {fetchErr}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-forge-900 border border-forge-700 rounded-lg p-4 animate-pulse">
                <div className="h-3 bg-forge-700 rounded w-24 mb-4" />
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-20 bg-forge-800 rounded-md mb-3" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* Kanban columns */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMN_SCHEMA.map((col) => {
              const items = buckets[col.key] || [];
              return (
                <section
                  key={col.key}
                  className={`bg-forge-900 border border-forge-700 border-t-2 ${col.accent}
                    rounded-lg p-4 flex flex-col min-h-[400px]`}
                >
                  <ColumnHeader col={col} count={items.length} />

                  <div className="flex flex-col gap-3 flex-1">
                    {items.length === 0
                      ? <EmptySlot label={col.heading.toLowerCase()} />
                      : items.map((item) => (
                        <TaskItem
                          key={item._id}
                          item={item}
                          onStatusChange={changeStatus}
                          onRemove={dropItem}
                        />
                      ))
                    }
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Add task popup */}
      {popupOpen && (
        <AddTaskPopup
          onClose={() => setPopupOpen(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}

function GridLines() {
  return (
    <div className="fixed inset-0 grid-bg pointer-events-none opacity-40" aria-hidden="true">
      <div className="absolute top-20 right-0 w-[600px] h-[400px] opacity-5 rounded-full"
        style={{ background: "radial-gradient(ellipse, #f59e0b 0%, transparent 70%)" }} />
    </div>
  );
}
