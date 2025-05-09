import React, { useEffect, useState, useCallback } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import UserProfilepage from "./pages/UserProfilepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import MyTrips from "./Components/MyTrips/MyTrips";
import BookingForm from "./Components/BookingForm/BookingForm";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Please try refreshing the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <div onError={handleError}>{children}</div>;
};

const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  return user ? children : null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem("token");
        setError("Failed to authenticate. Please log in again.");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1">
          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md mx-4 my-4">
              {error}
              <button
                onClick={() => {
                  setError(null);
                  navigate("/login");
                }}
                className="ml-4 text-secondary underline hover:text-secondary/80"
              >
                Log In
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute user={user}>
                  <UserProfilepage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book" element={<BookingForm user={user} />} />
            <Route path="/my-trips" element={<MyTrips user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
