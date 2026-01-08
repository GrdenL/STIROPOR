import axios from "axios";

const api = axios.create({
  baseURL: "https://stiropor-api.azurewebsites.net",
  withCredentials: true,
});

export const getCurrentUser = async () => {
  try {
    const token = sessionStorage.getItem('jwt');
    const res = await api.get("/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log(res.data)

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

export const login = async (email, password) => {
    try{
        const res = await api.post("/login", null, {
            params: {email, password}
        })
        return res;
    }catch(err){
        console.error("Login failed::", err);
        return null;
    }
}

export const register = async (email, username, password, location) => {
    try{
        const res = await api.post("/register", null, {
            params: {email, username, password, location}
        })
        return res;
    }catch(err){
        console.error("Login failed::", err);
        return null;
    }
}

export const googleAuthUrl = "https://stiropor-api.azurewebsites.net/oauth2/authorization/google";

export default api;
