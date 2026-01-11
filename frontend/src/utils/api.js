import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", //OBAVEZNO VRATITI PRIJE PUSHA NA MAIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! LUAK CITAJ
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/me", { withCredentials: true });

    return res.data;
  } catch (err) {
    console.error("Get current user failed:", err);
    return null;
  }
};

export const getAllGames = async () => {
  try {
    const res = await api.get("/games/all")
    return res.data;
  } catch (err) {
    console.error("Gettting games failed", err);
    return null;
  }
}

export const getGameById = async (id) => {
  try {
    const res = await api.get(`/games/${id}`);
    return res.data;
  } catch (err) {
    console.error("Get game by id failed:", err);
    throw err;
  }
}

export const logoutUser = async () => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (err) {
    console.error("Fetch users failed:", err);
    return null;
  }
}

export const getListingsByGameId = async (gameId) => {
  console.log(gameId)
  try {
    const res = await api.get(`/listings/game/${gameId}`);
    return res.data;
  } catch (err) {
    console.error("Get listings by game id failed:", err);
    throw err;
  }
}

export const getMyListings = async () => {
  try {
    const res = await api.get("/listings/me", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get listings failed:", err);
    return null;
  }
}

export const createListing = async (payload) => {
  try {
    const res = await api.post("/listings", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Create listing failed:", err);
    return null;
  }
}

export const getListingById = async (id) => {
  try {
    const res = await api.get(`/listings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Get listing by id failed:", err);
    throw err;
  }
};

export const createOffer = async (offerData) => {
  console.log(offerData)
  try {
    const res = await api.post("/offers", offerData);
    return res.data;
  } catch (err) {
    console.error("Create offer failed:", err);
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const res = await api.post("/login", null, {
      params: { email, password }
    })
    return res;
  } catch (err) {
    console.error("Login failed::", err);
    return null;
  }
}

export const register = async (email, username, password, location) => {
  try {
    const res = await api.post("/register", null, {
      params: { email, username, password, location }
    })
    return res;
  } catch (err) {
    console.error("Login failed::", err);
    return null;
  }
}

export const googleAuthUrl = "https://stiropor-api.azurewebsites.net/oauth2/authorization/google";

export default api;
