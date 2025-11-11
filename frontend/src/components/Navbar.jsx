import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { getCurrentUser } from "../utils/api";
import "../index.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
    fetchUser();
    console.log(user);
  }, []);

  return (
    <header className="bg-vintage-brown text-vintage-cream py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 object-contain rounded-sm"
          />
          <span className="text-lg font-playfair font-bold">PlayTrade</span>
        </div>

        {user ? (
          <span className="bg-[#D97706] text-white font-medium py-2 px-6 rounded-full transition">
            {user.email}
          </span>
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
