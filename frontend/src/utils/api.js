import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const googleAuthUrl = import.meta.env.VITE_API_URL + "oauth2/authorization/google";

const resolveJwt = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      try {
        sessionStorage.setItem("jwt", token);
      } catch (err) {
        // Ignore storage errors (token still usable for this request).
      }
      try {
        localStorage.setItem("jwt", token);
      } catch (err) {
        // Ignore storage errors (token still usable for this request).
      }
      return token;
    }
  } catch (err) {
    // Ignore URL parsing errors.
  }

  try {
    const sessionToken = sessionStorage.getItem("jwt");
    if (sessionToken) {
      return sessionToken;
    }
  } catch (err) {
    // Ignore storage errors (e.g. blocked storage contexts).
  }

  try {
    return localStorage.getItem("jwt");
  } catch (err) {
    // Ignore storage errors (e.g. blocked storage contexts).
  }

  return null;
};

api.interceptors.request.use((config) => {
  const token = resolveJwt();
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
    const hasSessionToken = (() => {
      try {
        return Boolean(sessionStorage.getItem("jwt"));
      } catch (tokenErr) {
        return false;
      }
    })();
    const hasLocalToken = (() => {
      try {
        return Boolean(localStorage.getItem("jwt"));
      } catch (tokenErr) {
        return false;
      }
    })();

    if (err?.response?.status === 401 && (hasSessionToken || hasLocalToken)) {
      try {
        sessionStorage.removeItem("jwt");
      } catch (tokenErr) {
        // Ignore storage errors.
      }
      try {
        localStorage.removeItem("jwt");
      } catch (tokenErr) {
        // Ignore storage errors.
      }
      try {
        const res = await api.get("/me", { withCredentials: true });
        return res.data;
      } catch (retryErr) {
        console.error("Get current user failed after retry:", retryErr);
        return null;
      }
    }
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

export const deleteListingById = async (id) => {
  try {
    const res = await api.delete(`/listings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete listing by id failed:", err);
    throw err;
  }
};


// Trade/Offer API functions
export const createOffer = async (offerData) => {
  console.log(offerData)
  try {
    const res = await api.post("/offers", offerData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Create offer failed:", err);
    throw err;
  }
};

export const getMyTrades = async () => {
  try {
    const res = await api.get("/offers/me", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get my trades failed:", err);
    return null;
  }
};

export const getReceivedOffers = async () => {
  try {
    const res = await api.get("/offers/received", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get received offers failed:", err);
    return null;
  }
};

export const getSentOffers = async () => {
  try {
    const res = await api.get("/offers/sent", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get sent offers failed:", err);
    return null;
  }
};

export const updateOfferStatus = async (offerId, status) => {
  try {
    // Convert string status to integer: PENDING=0, ACCEPTED=1, DECLINED=2, CANCELLED=3
    const statusMap = {
      'PENDING': 0,
      'ACCEPTED': 1,
      'DECLINED': 2,
      'CANCELLED': 3
    };
    const statusValue = typeof status === 'string' ? statusMap[status] : status;

    const res = await api.patch(`/offers/${offerId}/status`, null, {
      params: { status: statusValue },
      withCredentials: true
    });
    return res.data;
  } catch (err) {
    console.error("Update offer status failed:", err);
    throw err;
  }
};

export const acceptOffer = async (offerId) => {
  try {
    const res = await api.post(`/offers/${offerId}/accept`, null, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Accept offer failed:", err);
    throw err;
  }
};

export const declineOffer = async (offerId) => {
  try {
    const res = await api.post(`/offers/${offerId}/decline`, null, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Decline offer failed:", err);
    throw err;
  }
};

export const cancelOffer = async (offerId) => {
  try {
    const res = await api.delete(`/offers/${offerId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Cancel offer failed:", err);
    throw err;
  }
};

export const getOfferById = async (offerId) => {
  try {
    const res = await api.get(`/offers/${offerId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get offer by id failed:", err);
    throw err;
  }
};


export const updateProfile = async (userData) => {
  try {
    const res = await api.put("/me", userData, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Update profile failed:", err);
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


export const getMyWishlist = async () => {
  try {
    const res = await api.get("/wishlist/my-wishlist", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Get my wishlist failed:", err);
    // Return empty array instead of null
    return [];
  }
};

export const addWishlist = async (gameId) => {
  try {
    const res = await api.post(`/wishlist/add/${gameId}`, {}, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Add to wishlist failed:", err);
    throw err;
  }
};

export const removeWishlist = async (gameId) => {
  try {
    const res = await api.delete(`/wishlist/remove/${gameId}`, {
      withCredentials: true
    });
    return res.data;
  } catch (err) {
    console.error("Remove from wishlist failed:", err);
    throw err;
  }
};



export default api;
