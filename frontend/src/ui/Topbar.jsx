import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function Topbar({ onAddTask, projectName }) {
  const navigate = useNavigate();
  const { activeUser, isAdmin, closeSession } = useSession();

  const handleLogout = () => {
    closeSession();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-forge-900/90 backdrop-blur border-b border-forge-700">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mr-4">
          <div className="w-6 h-6 bg-ember-400 rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-forge-950 font-display font-bold text-xs">F</span>
          </div>
          <span className="font-display text-white text-base tracking-tight">FORGE</span>
        </div>

        {/* Divider */}
        <span className="text-forge-600 font-mono text-lg">/</span>

        {/* Project name */}
        <span className="text-steel-400 font-mono text-sm truncate max-w-[180px]">
          {projectName || "all projects"}
        </span>

        <div className="ml-auto flex items-center gap-3">

          {/* Role badge */}
          <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono
            ${isAdmin
              ? "bg-ember-400/15 text-ember-400 border border-ember-400/30"
              : "bg-forge-700 text-steel-400 border border-forge-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-ember-400" : "bg-steel-500"}`} />
            {activeUser?.role || "member"}
          </span>

          {/* User name */}
          <span className="hidden md:block text-steel-500 font-mono text-xs truncate max-w-[120px]">
            {activeUser?.name}
          </span>

          {/* Add task — admin only */}
          {isAdmin && onAddTask && (
            <button
              onClick={onAddTask}
              className="flex items-center gap-1.5 bg-ember-400 hover:bg-ember-500
                text-forge-950 font-mono font-semibold text-xs px-3 py-1.5 rounded
                transition-colors duration-150"
            >
              <span className="text-base leading-none">+</span>
              New Task
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-forge-500 hover:text-steel-300 font-mono text-xs
              px-2 py-1.5 rounded border border-forge-700 hover:border-forge-500
              transition-all duration-150"
          >
            Exit
          </button>
        </div>
      </div>
    </header>
  );
}
