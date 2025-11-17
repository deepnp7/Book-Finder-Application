import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const role = localStorage.getItem("role");

    if (role === "BookRecommender") navigate("/bookrecommender/home");
    else if (role === "BookReader") navigate("/bookreader/home");
    else navigate("/");
  };

  const particles = Array.from({ length: 25 });

  return (
    <div className="error-container">

      {/* Floating particles */}
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

      <div className="error-card">

        {/* ANIMATED 404 */}
        <h1 className="error-404">404</h1>

        <img
          src="/alert.jpeg"
          alt="Error Icon"
          className="error-img"
        />

        <h1 className="error-title">Page Not Found</h1>

        <p className="error-text">
          The page you're looking for doesn't exist or something went wrong.
        </p>

        <button className="error-btn" onClick={handleGoHome}>
          ⬅ Go Back Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
