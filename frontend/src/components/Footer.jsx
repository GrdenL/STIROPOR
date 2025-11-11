import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const Footer = () => {
  return (
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
  );
};

export default Footer;
