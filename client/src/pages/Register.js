import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Define API_BASE_URL with environment-aware fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bus-booking-cw48.onrender.com"
    : "http://localhost:5000");
// console.log("API_BASE_URL:", API_BASE_URL);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    else if (name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 4)
      newErrors.password = "Password must be at least 4 characters";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      // console.log("Register Response:", response.data);
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (error) {
      console.error("Register Error:", error);
      setApiError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6 animate-fade-in">
          Register for QuickRoute
        </h2>
        {apiError && (
          <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-center animate-fade-in">
            {apiError}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="Enter your name"
              className={`mt-1 w-full px-4 py-3 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={loading}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
              className={`mt-1 w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={loading}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
                className={`mt-1 w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md`}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700 transition-colors duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } text-lg`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v8h-8z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-300"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
