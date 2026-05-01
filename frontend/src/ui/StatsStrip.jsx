import { useEffect, useState } from "react";
import { fetchWorkStats } from "../api/workRequests";

const METRIC_SLOTS = [
  { key: "total",      label: "Total",      color: "text-steel-300" },
  { key: "inProgress", label: "Ongoing",    color: "text-amber-400" },
  { key: "completed",  label: "Completed",  color: "text-emerald-400" },
  { key: "overdue",    label: "Overdue",    color: "text-red-400" },
];

export default function StatsStrip() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchWorkStats()
      .then(({ data }) => setMetrics(data.stats))
      .catch(() => {});
  }, []);

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {METRIC_SLOTS.map(({ key, label, color }) => (
        <div key={key}
          className="bg-forge-900 border border-forge-700 rounded-md px-4 py-3
            flex flex-col gap-1 hover:border-forge-600 transition-colors">
          <span className="text-forge-500 text-xs font-mono uppercase tracking-widest">
            {label}
          </span>
          <span className={`font-display text-2xl ${color}`}>
            {metrics[key] ?? 0}
          </span>
        </div>
      ))}
    </div>
  );
}
