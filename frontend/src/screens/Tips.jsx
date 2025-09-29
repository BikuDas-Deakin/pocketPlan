import React, { useEffect, useState } from "react";
import api from "../api/api";

const Tips = ({ navigateTo }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissedTips, setDismissedTips] = useState([]);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.insights.getAIInsights();
      setInsights(res.insights || null);
    } catch (err) {
      setError(err.error || "Failed to load tips");
      console.error("Tips error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipTip = (tipId) => {
    setDismissedTips([...dismissedTips, tipId]);
  };

  const defaultTips = [
    {
      id: 1,
      icon: "💡",
      title: "Switch Energy Plan",
      savings: "$45/month",
      category: "featured"
    },
    {
      id: 2,
      icon: "🚗",
      title: "Fuel: Try GasBuddy app",
      savings: "~$8/week",
      category: "transport"
    },
    {
      id: 3,
      icon: "🛒",
      title: "Groceries: Plan weekly meals",
      savings: "~$25/week",
      category: "food"
    },
    {
      id: 4,
      icon: "📱",
      title: "Phone Plan: Compare providers",
      savings: "~$15/month",
      category: "utilities"
    }
  ];

  const calculateTotalSavings = () => {
    // Calculate based on default tips
    return 127; // $45 + ($8*4) + ($25*4) + $15 ≈ $127
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tips...</p>
        </div>
      </div>
    );
  }

  const featuredTip = defaultTips[0];
  const otherTips = defaultTips.slice(1).filter(tip => !dismissedTips.includes(tip.id));
  const totalSavings = calculateTotalSavings();

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Smart Savings Tips</h2>
      </div>

      <p className="text-base text-blue-900 mb-5">🤖 Personalized for You</p>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1">Showing default recommendations</p>
        </div>
      )}

      {/* AI Insights Banner */}
      {insights && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-blue-900 font-semibold mb-1">🤖 AI Analysis</p>
          <p className="text-sm text-gray-700">{insights.summary || insights.message}</p>
        </div>
      )}

      {/* Featured Tip */}
      {!dismissedTips.includes(featuredTip.id) && (
        <div
          className="bg-white border-2 border-blue-900 rounded-xl p-5 mb-5"
          style={{ background: "linear-gradient(135deg, #f0f7ff, #e6f3ff)" }}
        >
          <p className="text-base text-blue-900">{featuredTip.icon} Top Suggestion</p>
          <h3 className="text-xl font-semibold text-gray-800 my-2">{featuredTip.title}</h3>
          <p className="text-base text-green-500 mb-4">Save up to {featuredTip.savings}</p>
          <div className="flex gap-2">
            <button 
              className="bg-blue-900 text-white border-none py-2 px-5 rounded-lg font-semibold cursor-pointer hover:bg-blue-800 transition-all"
              onClick={() => alert("Feature coming soon! This will provide detailed steps to switch energy plans.")}
            >
              Learn More
            </button>
            <button 
              className="bg-gray-100 text-gray-800 border-none py-2 px-5 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all"
              onClick={() => handleSkipTip(featuredTip.id)}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      <p className="text-base text-gray-800 my-8">Other Opportunities:</p>

      {/* Other Tips */}
      {otherTips.length > 0 ? (
        otherTips.map((tip) => (
          <div 
            key={tip.id}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => alert(`Tip details: ${tip.title}\nEstimated savings: ${tip.savings}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base text-gray-800">{tip.icon} {tip.title}</p>
                <p className="text-sm text-green-500">Save {tip.savings}</p>
              </div>
              <span className="text-gray-500 text-lg">›</span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 text-center">
          <p className="text-gray-500">All tips reviewed! Check back later for new suggestions.</p>
        </div>
      )}

      {/* Refresh Tips Button */}
      {otherTips.length === 0 && (
        <button
          onClick={() => {
            setDismissedTips([]);
            fetchAIInsights();
          }}
          className="w-full bg-blue-900 text-white border-none py-3 px-5 rounded-lg font-semibold cursor-pointer hover:bg-blue-800 transition-all mb-5"
        >
          🔄 Refresh Tips
        </button>
      )}

      {/* Savings Tracker */}
      <div
        className="rounded-xl p-5 text-center"
        style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}
      >
        <p className="text-base text-gray-800">Potential Monthly Savings</p>
        <h2 className="text-2xl font-bold text-green-500 my-2">${totalSavings}</h2>
        <p className="text-sm text-gray-500">if you apply all tips</p>
      </div>
    </div>
  );
};

export default Tips;