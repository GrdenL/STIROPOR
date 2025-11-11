import React, { useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { register, googleAuthUrl } from "../utils/api";
import logo from "../assets/logo.png";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    acceptTerms: "",
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

    let hasError = false;
    const newErrors = { password: "", confirmPassword: "", acceptTerms: "" };

    if (formData.password.length < 8) {
      newErrors.password = "Lozinka mora imati minimalno 8 znakova";
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Lozinke se ne podudaraju";
      hasError = true;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Morate prihvatiti uvjete korištenja";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      try {
        // mapiraj formu na backend User JSON
        const payload = {
          email: formData.email,
          username: `${formData.firstName} ${formData.lastName}`.trim(),
          passwordHash: formData.password, // backend trenutno očekuje polje passwordHash
          description: "",
          role: "USER",
          townId: 1,
          latitude: 0,
          longitude: 0,
        };

        const res = await register(payload);
        if (!res.data) {
          alert("Korisnik već postoji ili registracija nije uspjela.");
          return;
        }
        alert("Registracija uspješna! Možete se prijaviti.");
      } catch (err) {
        console.error(err);
        alert("Greška pri registraciji.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex flex-col font-roboto">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-30 w-30 object-contain " />
          </div>
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg border border-[#3B2F2F]/10 p-8">
            <h1 className="text-2xl font-bold text-center text-[#3B2F2F] mb-2 font-playfair">
              Join the PlayTrade community
            </h1>
            <p className="text-sm text-[#3B2F2F]/70 text-center mb-8 font-roboto">
              Embark on your board game trading adventure
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                >
                  Email Address *
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

              {/* Address */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                >
                  Address *
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                  placeholder="Number, Street, City, Country"
                />
                <p className="mt-1 text-xs text-[#3B2F2F]/60 font-roboto">
                  Address is required to facilitate local swaps.
                </p>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 font-roboto">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#3B2F2F] mb-2 font-roboto"
                  >
                    Confirm password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3B2F2F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition font-roboto"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 font-roboto">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 mt-1 text-[#D97706] border-[#3B2F2F]/20 rounded focus:ring-[#D97706]"
                  />
                  <span className="ml-2 text-sm text-[#3B2F2F] font-roboto">
                    I accept the{" "}
                    <a
                      href="#"
                      className="text-[#D97706] hover:text-amber-700 underline"
                    >
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[#D97706] hover:text-amber-700 underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-red-600 font-roboto">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#D97706] hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition shadow-md hover:shadow-lg font-roboto"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3B2F2F]/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#3B2F2F]/60 font-roboto">
                  or register with
                </span>
              </div>
            </div>

            {/* OAuth */}
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
                Register with Google
              </a>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-[#3B2F2F]/70 mt-6 font-roboto">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#3B2F2F] hover:text-[#D97706] font-medium transition font-roboto"
              >
                Log in Here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
