// src/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://stiropor-api.azurewebsites.net",
  withCredentials: true,
});

export const login = (email, password_hash) =>
  api.post("/login", null, { params: { email, password_hash } });

export const register = (user) => api.post("/register", user);

export const getUser = (email) => api.get("/getUser", { params: { email } });

export const updateUser = (user) => api.put("/updateUser", user);

export const deleteUser = (email) =>
  api.delete("/deleteUser", { params: { email } });

export const getAllUsers = () => api.get("/getAllUsers");

export const googleAuthUrl = "https://stiropor-api.azurewebsites.net/oauth2/authorization/google";
