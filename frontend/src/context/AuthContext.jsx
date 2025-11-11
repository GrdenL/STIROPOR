import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) setUser(data);
    });
  }, []);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
