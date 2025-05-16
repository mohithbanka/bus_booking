import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";

// Lazy-loaded components
const Homepage = lazy(() => import("./pages/Homepage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const UserProfilepage = lazy(() => import("./pages/UserProfilepage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const MyTrips = lazy(() => import("./Components/MyTrips/MyTrips"));
const BookingForm = lazy(() => import("./Components/BookingForm/BookingForm"));
const HelpPage = lazy(() => import("./Components/HelpPage/HelpPage"));
const FAQ = lazy(() => import("./Components/Faqs/Faq"));

// const REACT_APP_BACKEND_URL = "http://localhost:5000";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_API_URL ;
console.log("REACT_APP_BACKEND_URL:", REACT_APP_BACKEND_URL);

// Error Boundary
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleError = useCallback((error, errorInfo) => {
    setHasError(true);
    setErrorInfo(errorInfo);
    console.error("ErrorBoundary caught:", error, errorInfo);
    toast.error("An error occurred. Please try again or contact support.");
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary dark:text-primary-dark mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            An unexpected error occurred. Please try refreshing or contact support.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = "/help"}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
          {errorInfo && (
            <details className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
              <summary>Error Details</summary>
              <pre>{errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div onError={handleError}>
      {children}
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      toast.warn("Please log in to access this page.");
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  return user ? children : null;
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
    </button>
  );
};

// App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      setUser(response.data);
      toast.success("Welcome back!");
    } catch (err) {
      localStorage.removeItem("token");
      setError("Failed to authenticate. Please log in again.");
      setUser(null);
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Focus management for accessibility
  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.focus();
    }
  }, [location]);

  // Route configuration
  const routes = [
    { path: "/", element: <Homepage />, public: true },
    { path: "/search", element: <SearchPage />, public: true },
    {
      path: "/my-profile",
      element: (
        <ProtectedRoute user={user}>
          <UserProfilepage />
        </ProtectedRoute>
      ),
      public: false,
    },
    { path: "/login", element: <Login setUser={setUser} />, public: true },
    { path: "/register", element: <Register />, public: true },
    { path: "/book", element: <BookingForm user={user} />, public: true },
    { path: "/my-trips", element: <MyTrips user={user} />, public: true },
    { path: "/help", element: <HelpPage />, public: true },
    { path: "/faqs", element: <FAQ />, public: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-primary dark:text-primary-dark"
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
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading BusBooking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar user={user} onLogout={handleLogout}>
            <ThemeToggle />
          </Navbar>
          <main className="flex-1" tabIndex="-1">
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
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <svg
                    className="animate-spin h-8 w-8 mx-auto text-primary dark:text-primary-dark"
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
                </div>
              }
            >
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;