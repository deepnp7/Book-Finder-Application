import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

/* Public components */
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import HomePage from "./Components/HomePage";
import ErrorPage from "./Components/ErrorPage";
import ForgotPassword from "./Components/ForgotPassword";
import VerifyOtp from "./Components/VerifyOtp";
import ResetPassword from "./Components/ResetPassword";

/* Private-route wrapper */
import PrivateRoute from "./Components/PrivateRoute";

/* BookRecommender components */
import BookRecommenderNavbar from "./BookRecommenderComponents/BookRecommenderNavbar";
import BookForm from "./BookRecommenderComponents/BookForm";
import ViewBook from "./BookRecommenderComponents/ViewBook";

/* BookReader components */
import BookReaderNavbar from "./BookReaderComponents/BookReaderNavbar";
import BookReaderViewBook from "./BookReaderComponents/BookReaderViewBook";

const RedirectIfAuthenticated = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (role === "BookRecommender") return <Navigate to="/bookrecommender/home" replace />;
  if (role === "BookReader") return <Navigate to="/bookreader/home" replace />;

  // fallback
  return <Navigate to="home" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* If someone attempts to visit root while already authenticated */}
        <Route path="/redirect" element={<RedirectIfAuthenticated />} />

        {/* BookRecommender protected area */}
        <Route element={<PrivateRoute allowedRoles={["BookRecommender"]} />}>
          {/* Navbar acts as a layout (contains nested links/routes) */}
          <Route path="/bookrecommender">
            <Route index element={<Navigate to="home" replace />} />
            <Route
              path="home"
              element={
                <div>
                  <BookRecommenderNavbar />
                  <HomePage />
                </div>
              }
            />
            <Route path="add" element={<BookForm />} />
            <Route path="view" element={<ViewBook />} />
            <Route path="edit/:id" element={<BookForm />} />
            <Route path="delete/:id" element={<BookForm />} />
          </Route>

        </Route>

        {/* BookReader protected area */}
        <Route element={<PrivateRoute allowedRoles={["BookReader"]} />}>
          <Route path="/bookreader">
            <Route index element={<Navigate to="home" replace />} />
            <Route
              path="home"
              element={
                <div>
                  <BookReaderNavbar />
                  <HomePage />
                </div>
              }
            />
            <Route path="view" element={<BookReaderViewBook />} />
          </Route>
        </Route>

        {/* Error / Unauthorized */}
        <Route path="/error" element={<ErrorPage />} />

        {/* Fallback - unknown routes */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
