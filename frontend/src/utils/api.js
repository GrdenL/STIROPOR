import axios from "axios";

const api = axios.create({
  baseURL: "https://stiropor-api.azurewebsites.net/",
  withCredentials: true,
});

export const login = async (email, password_hash) => {
  try {
    const res = await api.post("/login", null, {
      params: { email, password_hash },
    });
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    return null;
  }
};

export const register = async (user) => {
  try {
    const res = await api.post("/register", user);
    return res.data;
  } catch (err) {
    console.error("Register failed:", err);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    console.error("Get current user failed:", err);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await api.get("/getAllUsers");
    return res.data;
  } catch (err) {
    console.error("Fetch users failed:", err);
    return [];
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.get("/logout");
    return res.data;
  } catch (err) {
    console.error("Fetch users failed:", err);
    return null;
  }
}

export const googleAuthUrl = "https://stiropor-api.azurewebsites.net/oauth2/authorization/google";

export default api;
