import React from "react";
import "./HomePage.css";

function HomePage() {
  const particles = Array.from({ length: 25 });

  return (
    <div className="home-container">
      {/* Floating particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="home-particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Glass Card */}
      <div className="home-card">
        <h1 className="home-heading">BookFinder</h1>
        <p className="home-tagline">
          Discover, explore, and find books crafted perfectly for your reading journey.
        </p>

        <div className="home-divider"></div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p><strong>Email:</strong>bookfinderstatuscode6@gmail.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
      </footer>
    </div>
  );
}

export default HomePage;
