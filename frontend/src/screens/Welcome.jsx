import React, { useState } from "react";
import api from "../api/api";

const Welcome = ({ navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login
        const response = await api.auth.login(formData.email, formData.password);
        localStorage.setItem("authToken", response.token);
        navigateTo("dashboard");
      } else {
        // Signup
        if (!formData.name) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        const response = await api.auth.register(
          formData.email,
          formData.password,
          formData.name
        );
        localStorage.setItem("authToken", response.token);
        navigateTo("dashboard");
      }
    } catch (err) {
      setError(err.error || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    // For guest mode, just navigate without auth
    navigateTo("dashboard");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center pt-20">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">PocketPlan</h1>
        <p className="text-sm text-gray-500 mb-10">Smart Money Management</p>

        <form onSubmit={handleSubmit} className="space-y-5 px-5">
          {/* Show name field only for signup */}
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-blue-900 transition-colors"
                placeholder="Full Name"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-blue-900 transition-colors"
              placeholder="Email or Phone"
              required
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-blue-900 transition-colors"
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white border-none p-4 rounded-lg font-semibold cursor-pointer hover:bg-blue-800 transition-all hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "PLEASE WAIT..." : isLogin ? "LOGIN" : "SIGN UP"}
            </button>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                className="text-blue-900 cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setFormData({ email: "", password: "", name: "" });
                }}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGuestMode}
              className="w-full bg-gray-100 text-gray-800 border-none p-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all hover:-translate-y-0.5"
              disabled={loading}
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-24 left-5 right-5">
        <p className="text-sm bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
          Try all features without signup - data stays on device
        </p>
      </div>
    </div>
  );
};

export default Welcome;