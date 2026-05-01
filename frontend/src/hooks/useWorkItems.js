import { useState, useEffect, useCallback } from "react";
import { fetchWorkItems, patchWorkStatus, removeWorkItem } from "../api/workRequests";

const BUCKET_MAP = {
  todo:        "pending",
  "in-progress": "ongoing",
  done:        "completed",
};

export function useWorkItems(projectFilter = null) {
  const [allItems,  setAllItems]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchErr,  setFetchErr]  = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const params = projectFilter ? { projectId: projectFilter } : {};
      const { data } = await fetchWorkItems(params);
      setAllItems(data.tasks || []);
    } catch (e) {
      setFetchErr(e.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [projectFilter]);

  useEffect(() => { loadItems(); }, [loadItems]);

  // Group items into buckets
  const buckets = allItems.reduce(
    (acc, item) => {
      const key = BUCKET_MAP[item.status] || "pending";
      acc[key].push(item);
      return acc;
    },
    { pending: [], ongoing: [], completed: [] }
  );

  const changeStatus = async (taskId, newStatus) => {
    try {
      await patchWorkStatus(taskId, { status: newStatus });
      setAllItems((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      console.error("Status update failed:", e);
    }
  };

  const dropItem = async (taskId) => {
    try {
      await removeWorkItem(taskId);
      setAllItems((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return { buckets, loading, fetchErr, reload: loadItems, changeStatus, dropItem };
}
