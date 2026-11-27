import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "authUser"; // non-sensitive profile only; the real token is an httpOnly cookie

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(readStoredUser);

  const setUser = useCallback((value) => {
    setUserState(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const logout = useCallback(() => setUser(null), [setUser]);

  // api client fires this when the server says the cookie is no longer valid
  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ? String(user.role).toLowerCase() : null,
      isAuthenticated: !!user,
      setUser,
      logout,
    }),
    [user, setUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
