// Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import logo from "../assets/logo.png";
import { getCurrentUser, logoutUser } from "../utils/api";
import "../index.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (mounted) setUser(data);
      } catch (err) {
        console.error("getCurrentUser error:", err);
      }
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  // close when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser?.();
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
      setOpen(false);
    }
  };

  const toggle = () => setOpen((v) => !v);

  return (
    <header className="bg-vintage-brown text-vintage-cream py-4 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 object-contain rounded-sm"
          />
          <span className="text-lg font-playfair font-bold">PlayTrade</span>
        </Link>

        {user ? (
          <div ref={wrapperRef} className="relative">
            <button
              onClick={toggle}
              aria-haspopup="true"
              aria-expanded={open}
              className="flex items-center space-x-2 bg-[#D97706] text-white font-medium py-2 px-4 rounded-full cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
            >
              <div className="flex items-center space-x-2 no-underline text-white">
                <User size={18} />
              </div>
              <span className="truncate max-w-xs">{user.email}</span>
            </button>

            {/* Dropdown */}
            {open && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg py-1 overflow-hidden z-50"
              >
                <div
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition no-underline text-gray-800"
                  role="menuitem"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition bg-white"
                  role="menuitem"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#D97706] hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full transition"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
