import "./App.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUser } from "../api";
import logo from "../assets/logo.png";



const MainPage = () => {
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) {
      getUser(email)
        .then((res) => {
          if (res.data) {
            setUser(res.data); // save user info in state
            console.log("Google login user:", res.data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);
  return (
    <div className="bg-vintage-cream text-vintage-brown min-h-screen flex flex-col font-roboto">
      {/* Header */}
      <header className="bg-vintage-brown text-vintage-cream py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain rounded-sm" />
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

      {/* Hero Section */}
      <section className="bg-vintage-brown text-vintage-cream py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-30 w-30 object-contain " />
          </div>

          <h1 className="text-2xl font-playfair font-bold mb-3">
            Trade Board Games (DEV)
          </h1>
          <p className="max-w-2xl mx-auto text-sm font-roboto leading-relaxed mb-8">
            Connect with collectors, trade games and build your ideal
            collection.
            <br />
            From Monopoly to Risk, find the games that you want to play.
          </p>
          <a
            href="#"
            className="inline-flex items-center bg-vintage-accent hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition"
          >
            Start Trading
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-vintage-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-playfair font-bold text-vintage-brown mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vintage-brown/10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-vintage-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-vintage-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-playfair font-semibold text-lg text-center mb-2">
                List Your Games
              </h3>
              <p className="text-sm font-roboto text-vintage-brown/80 text-center">
                Add your vintage board games to your collection. Include photos,
                condition, and details to attract potential traders.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vintage-brown/10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-vintage-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-vintage-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4h16v16H4zM19 10l-7 7-7-7"
                  />
                </svg>
              </div>
              <h3 className="font-playfair font-semibold text-lg text-center mb-2">
                Browse & Propose
              </h3>
              <p className="text-sm font-roboto text-vintage-brown/80 text-center">
                Explore other collectors' games, filter by category, year, and
                condition. Send trade proposals when you find something special.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vintage-brown/10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-vintage-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-vintage-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-playfair font-semibold text-lg text-center mb-2">
                Complete Trades
              </h3>
              <p className="text-sm font-roboto text-vintage-brown/80 text-center">
                Review offers, negotiate terms, and finalize your trades. Track
                your trading history and build your reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="bg-vintage-brown text-vintage-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-playfair font-bold mb-3">
            Ready to Start Trading?
          </h2>
          <p className="max-w-xl mx-auto text-sm font-roboto mb-8">
            Join our community of vintage board game enthusiasts today!
          </p>
          <Link
            to="/login"
            className="inline-flex items-center bg-vintage-accent hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition"
          >
           Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};


export default MainPage;
