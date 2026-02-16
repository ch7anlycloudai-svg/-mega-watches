import { createContext, useContext, useState, useEffect } from "react";
import { adminApi } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      adminApi
        .getMe()
        .then((data) => {
          setAdmin(data.admin);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await adminApi.login(email, password);
      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || "بيانات الدخول غير صحيحة" };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
