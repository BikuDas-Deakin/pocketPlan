import React, { useEffect, useState } from "react";
import api from "../api/api";

const More = ({ navigateTo, onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.user.getProfile();
      setUser(res.user || null);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">More</h2>
      </div>

      {/* Profile Section */}
      <div className="flex items-center bg-white rounded-xl p-5 mb-5 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
          {loading ? "..." : user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="flex-1">
          <p className="text-base text-gray-800">
            {loading ? "Loading..." : user?.name || "Alex Johnson"}
          </p>
          <p className="text-sm text-green-500">Premium Member</p>
        </div>
        <span className="text-gray-500 text-lg">›</span>
      </div>

      {/* Account Settings */}
      <div className="mb-8">
        <p className="text-base text-gray-500 mb-4">Account</p>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">🔐 Privacy & Security</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">💾 Export Data</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">🔔 Notifications</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div 
            className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigateTo("government")}
          >
            <span className="text-base">🏛️ Government Benefits</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">👥 Community Forum</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
        </div>
      </div>

      {/* Support Settings */}
      <div className="mb-8">
        <p className="text-base text-gray-500 mb-4">Support</p>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">❓ Help & FAQ</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">📧 Contact Support</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">⭐ Rate App</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
        </div>
      </div>

      {/* Legal Settings */}
      <div className="mb-8">
        <p className="text-base text-gray-500 mb-4">Legal</p>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">📋 Terms of Service</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">🔒 Privacy Policy</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base">ℹ️ About PocketPlan</span>
            <span className="text-gray-500 text-lg">›</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mb-8">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white border-none py-3 px-5 rounded-xl font-semibold cursor-pointer hover:bg-red-600 transition-all"
        >
          🚪 Log Out
        </button>
      </div>

      {/* Version */}
      <div className="text-center my-10">
        <p className="text-sm text-gray-500">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default More;