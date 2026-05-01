import { useState, useCallback } from "react";

const TOKEN_KEY = "forge_token";
const USER_KEY  = "forge_user";

export function useSession() {
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const openSession = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setActiveUser(user);
  }, []);

  const closeSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setActiveUser(null);
  }, []);

  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));
  const isAdmin  = activeUser?.role === "admin";

  return { activeUser, hasToken, isAdmin, openSession, closeSession };
}
