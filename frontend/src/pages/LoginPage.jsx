import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { login, googleAuthUrl } from "../api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await login(email, password);
      if (!res.data) {
        alert("Pogrešan email ili lozinka.");
        return;
      }
      // uspjeh
      console.log("Ulogiran:", res.data);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login nije uspio.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex flex-col font-roboto">
      {/* Header */}
      <header className="bg-[#3B2F2F] text-[#F9F5F0] py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-2 border-[#D97706] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-[#D97706] rounded-full"></div>
            </div>
            <a href="index.html" className="text-lg font-bold font-playfair">
              PlayTrade
            </a>
          </div>
          <Link
            to="/register"
            className="text-[#F9F5F0] hover:text-[#D97706] font-medium transition font-roboto"
          >
            Don’t have an account? Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-4 border-[#D97706] rounded-xl grid grid-cols-3 grid-rows-3 gap-1 p-2">
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-start self-start"></div>
              <div></div>
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-end self-start"></div>
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-start self-center"></div>
              <div></div>
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-end self-center"></div>
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-start self-end"></div>
              <div></div>
              <div className="w-3 h-3 bg-[#D97706] rounded-full justify-self-end self-end"></div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg border border-[#3B2F2F]/10 p-8">
            <h1 className="text-2xl font-bold text-center text-[#3B2F2F] mb-2 font-playfair">
              Welcome Back
            </h1>
            <p className="text-sm text-[#3B2F2F]/70 text-center mb-8 font-roboto">
              Log in to continue trading board games
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                  placeholder="you@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#D97706] border-[#3B2F2F]/20 rounded focus:ring-[#D97706]"
                  />
                  <span className="ml-2 text-sm text-[#3B2F2F] font-roboto">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-[#D97706] hover:text-amber-700 transition font-roboto"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#D97706] hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition shadow-md hover:shadow-lg font-roboto"
              >
                Log In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3B2F2F]/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#3B2F2F]/60 font-roboto">
                  or
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <a
                href={googleAuthUrl}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#3B2F2F]/20 hover:bg-[#F9F5F0] text-[#3B2F2F] font-medium py-3 px-6 rounded-full transition font-roboto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </a>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-[#3B2F2F]/70 mt-6 font-roboto">
            Don’t have an account?{" "}
            <a
              href="register.html"
              className="text-[#D97706] hover:text-amber-700 font-medium transition"
            >
              Sign up here
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3B2F2F] text-[#F9F5F0]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-roboto">
            © 2025 PlayTrade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
