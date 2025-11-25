import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const sync = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
    setCurrentUser(user);
  };
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ currentUser, setCurrentUser, login, logout }),
    [currentUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
