import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SigninView  from "./views/SigninView";
import TaskBoard   from "./views/TaskBoard";
import GuardedRoute from "./ui/GuardedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SigninView />} />
        <Route
          path="/board"
          element={
            <GuardedRoute>
              <TaskBoard />
            </GuardedRoute>
          }
        />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
