import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      sessionStorage.setItem("jwt", token);
    }

    getCurrentUser().then((data) => {
      setUser(data ?? null);
    });
  }, [location.search]);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
