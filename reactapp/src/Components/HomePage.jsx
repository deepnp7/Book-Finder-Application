import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Cover Image Section */}
      <div className="home-image-section">
        <img
          src="/bookfindercoverimage.jpeg"
          alt="Book Finder Cover"
          className="home-cover-image"
        />

        {/* App Title on the banner */}
        <h1 className="home-title">BookFinder</h1>
      </div>

      {/* Information Section */}
      <div className="home-content">
        <p className="home-subtitle">
          An app to discover, explore, and find books tailored to your reading preferences.
        </p>

        {/* Decorative divider line */}
        <div className="home-divider"></div>
      </div>

      {/* Footer Section */}
      <footer className="home-contact">

        {/* Contact information */}
        <h2>Contact Us</h2>
        <p>
          <strong>Email:</strong> support@bookfinder.com
        </p>
        <p>
          <strong>Phone:</strong> +91 98765 43210
        </p>
      </footer>
    </div>
  );
}

export default HomePage;