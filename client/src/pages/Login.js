import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      setLoading(true);
      localStorage.setItem("token", token);
      axios
        .get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          navigate("/my-profile", { replace: true });
          window.gtag("event", "login", { event_category: "Auth", method: "Google" });
        })
        .catch(() => {
          setApiError("Failed to authenticate with Google");
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
          // Clear query params
          navigate(location.pathname, { replace: true });
        });
    } else if (error) {
      setApiError("Google authentication failed");
    }
  }, [location, navigate, setUser]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate("/my-profile");
      window.gtag("event", "login", { event_category: "Auth", method: "Email" });
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">Log In</h2>
        {apiError && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center">
            {apiError}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="Enter your email"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={loading}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="Enter your password"
                className={`mt-1 w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            aria-label="Log in with Google"
            disabled={loading}
          >
            <i className="fa-brands fa-google"></i>
            Log in with Google
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;