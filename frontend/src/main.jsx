import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import 'leaflet/dist/leaflet.css'

const stashTokenFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      return;
    }
    try {
      sessionStorage.setItem("jwt", token);
    } catch (err) {
      // Ignore storage errors.
    }
    try {
      localStorage.setItem("jwt", token);
    } catch (err) {
      // Ignore storage errors.
    }
    params.delete("token");
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  } catch (err) {
    // Ignore URL parsing errors.
  }
};

stashTokenFromUrl();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
