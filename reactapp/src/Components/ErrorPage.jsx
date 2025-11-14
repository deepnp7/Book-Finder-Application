import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Redirect based on role if logged in, else go to login
    const role = localStorage.getItem("role");
    if (role === "BookRecommender") navigate("/bookrecommender/home");
    else if (role === "BookReader") navigate("/bookreader/home");
    else navigate("/");
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <img
          src="/alert.png"
          alt="Error Illustration"
          className="error-image"
        />
        <h1 className="error-title">Oops! Something went wrong</h1>
        <p className="error-message">
          Please try again later or return to the home page.
        </p>
        <button className="error-button" onClick={handleGoHome}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
