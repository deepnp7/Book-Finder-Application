import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  // Decide where to send the user based on stored role
  const handleGoHome = () => {
    const role = localStorage.getItem("role");

    if (role === "BookRecommender") navigate("/bookrecommender/home");
    else if (role === "BookReader") navigate("/bookreader/home");
    else navigate("/"); // Fallback to landing/login page
  };

  // Create an array of 25 items to render animated background particles
  const particles = Array.from({ length: 25 });

  return (
    <div className="error-container">
      {/* Animated floating particles in the background */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="error-particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Main error card content */}
      <div className="error-card">
        {/* Animated 404 heading */}
        <h1 className="error-404">404</h1>

        {/* Error illustration */}
        <img
          src="/alert.jpeg"
          alt="Error Icon"
          className="error-img"
        />

        <h1 className="error-title">Page Not Found</h1>

        <p className="error-text">
          The page you're looking for doesn't exist or something went wrong.
        </p>

        {/* Button to navigate user back to appropriate home page */}
        <button className="error-btn" onClick={handleGoHome}>
          ⬅ Go Back Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
