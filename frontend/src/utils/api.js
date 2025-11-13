import axios from "axios";

const api = axios.create({
  baseURL: "https://stiropor-api.azurewebsites.net",
  withCredentials: true,
});

export const getCurrentUser = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const res = await api.get("/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return res.data;
  } catch (err) {
    console.error("Get current user failed:", err);
    return null;
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
