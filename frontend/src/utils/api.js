import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",                                               //OBAVEZNO VRATITI PRIJE PUSHA NA MAIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! LUAK CITAJ
  withCredentials: true,
});

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/me", {withCredentials: true});
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error("Get current user failed:", err);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.post("/logout");
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
