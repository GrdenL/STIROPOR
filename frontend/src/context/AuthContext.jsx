import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

    const updateUserInfo = (newData) => {
        setUser(newData); // Ovo će pokrenuti re-render cijele aplikacije s novim podacima
    };

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      if (token) {
        sessionStorage.setItem("jwt", token);
        try {
          localStorage.setItem("jwt", token);
        } catch (err) {
          // Ignore storage errors.
        }
        params.delete("token");
        const nextSearch = params.toString();
        navigate(
          {
            pathname: location.pathname,
            search: nextSearch ? `?${nextSearch}` : "",
          },
          { replace: true }
        );
      }

      const data = await getCurrentUser();
      if (!cancelled) {
        setUser(data ?? null);
        setAuthReady(true);
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate]);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, authReady, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
