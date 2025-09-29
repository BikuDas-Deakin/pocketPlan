import React, { useEffect, useState } from "react";
import api from "../api/api";

const Government = ({ navigateTo }) => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false);
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.benefits.getAll();
      setBenefits(res.benefits || []);
    } catch (err) {
      setError(err.error || "Failed to load benefits");
      console.error("Benefits error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!income || parseFloat(income) < 0) {
      alert("Please enter a valid income");
      return;
    }
    if (!age || parseInt(age) < 0 || parseInt(age) > 120) {
      alert("Please enter a valid age");
      return;
    }

    setChecking(true);
    try {
      const res = await api.benefits.checkEligibility(
        parseFloat(income),
        parseInt(age)
      );
      setEligibilityResults(res);
      setShowEligibilityCheck(false);
      
      // Show results alert
      if (res.eligible) {
        alert(`Great news! You may be eligible for ${res.eligibleBenefits?.length || 'several'} benefits based on your profile.`);
      } else {
        alert(res.message || "Based on your profile, you may not currently qualify for additional benefits. Check back as your circumstances change.");
      }
    } catch (err) {
      alert(err.error || "Failed to check eligibility");
      console.error("Eligibility check error:", err);
    } finally {
      setChecking(false);
    }
  };

  const handleApplyNow = (benefitName) => {
    alert(`Redirecting to application for ${benefitName}...\n\nThis would open the official government portal in a real app.`);
  };

  const handleLearnMore = (benefitName) => {
    alert(`More information about ${benefitName}:\n\n• Eligibility criteria\n• Required documents\n• Application process\n• Payment schedule\n\nThis would show detailed information in a real app.`);
  };

  const handleCheckProgramEligibility = (programName) => {
    alert(`Checking eligibility for ${programName}...\n\nThis would guide you through specific eligibility questions in a real app.`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading benefits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="bg-transparent border-none text-xl cursor-pointer p-2 text-blue-900"
          onClick={() => navigateTo("more")}
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Support & Benefits</h2>
        <div></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1">Showing default programs. Please try again later.</p>
        </div>
      )}

      <h3 className="text-xl font-semibold text-blue-900 mb-2">🏛️ Available For You</h3>
      <p className="text-base text-gray-500 mb-5">Based on your profile and location:</p>

      {/* Eligibility Results Banner */}
      {eligibilityResults && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-green-700 font-semibold mb-1">✓ Eligibility Check Complete</p>
          <p className="text-sm text-gray-700">
            {eligibilityResults.message || "Review the programs below to see what you may qualify for"}
          </p>
        </div>
      )}

      {/* Featured Benefit */}
      <div
        className="bg-white border-2 border-green-500 rounded-xl p-5 mb-8"
        style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}
      >
        <p className="text-base text-blue-900">⚡ Energy Rebate</p>
        <h3 className="text-xl font-semibold text-green-500 my-2">Up to $400/year</h3>
        <div className="flex gap-2 mt-4">
          <button 
            className="bg-green-500 text-white border-none py-2 px-5 rounded-lg font-semibold cursor-pointer hover:bg-green-600 transition-all"
            onClick={() => handleApplyNow("Energy Rebate")}
          >
            Apply Now
          </button>
          <button 
            className="bg-gray-100 text-gray-800 border-none py-2 px-5 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all"
            onClick={() => handleLearnMore("Energy Rebate")}
          >
            Learn More
          </button>
        </div>
      </div>

      <p className="text-base text-gray-800 my-8">Other Programs You May Qualify For:</p>

      {/* Other Programs */}
      <div 
        className="bg-white border border-gray-200 rounded-xl p-5 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleCheckProgramEligibility("Healthcare Subsidy")}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base text-gray-800">🩺 Healthcare Subsidy</p>
            <p className="text-sm text-gray-500">Medicare benefits check</p>
          </div>
          <span className="text-blue-900 text-sm cursor-pointer">Check Eligibility ›</span>
        </div>
      </div>

      <div 
        className="bg-white border border-gray-200 rounded-xl p-5 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleCheckProgramEligibility("Housing Assistance")}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base text-gray-800">🏠 Housing Assistance</p>
            <p className="text-sm text-gray-500">Rent and mortgage support</p>
          </div>
          <span className="text-blue-900 text-sm cursor-pointer">Check Eligibility ›</span>
        </div>
      </div>

      <div 
        className="bg-white border border-gray-200 rounded-xl p-5 mb-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleCheckProgramEligibility("Transport Concessions")}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base text-gray-800">🚌 Transport Concessions</p>
            <p className="text-sm text-gray-500">Public transport discounts</p>
          </div>
          <span className="text-blue-900 text-sm cursor-pointer">Check Eligibility ›</span>
        </div>
      </div>

      {/* Eligibility Checker */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: "linear-gradient(135deg, #f0f7ff, #e6f3ff)" }}
      >
        <p className="text-base text-blue-900 mb-2">📋 Benefits Eligibility Checker</p>
        <p className="text-sm text-gray-800 mb-4">
          Answer a few questions to discover all benefits you qualify for
        </p>
        
        {!showEligibilityCheck ? (
          <button 
            className="bg-blue-900 text-white border-none py-2 px-6 rounded-lg font-semibold cursor-pointer hover:bg-blue-800 transition-all"
            onClick={() => setShowEligibilityCheck(true)}
          >
            Start Check
          </button>
        ) : (
          <div className="space-y-3 mt-4">
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Annual income ($)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              min="0"
            />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              min="0"
              max="120"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCheckEligibility}
                disabled={checking}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking ? "Checking..." : "Check Eligibility"}
              </button>
              <button
                onClick={() => {
                  setShowEligibilityCheck(false);
                  setIncome("");
                  setAge("");
                }}
                disabled={checking}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* All Programs List */}
      <div className="bg-white rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-4">All Available Programs:</p>
        <div className="border-b border-gray-100 py-2 text-gray-800">• Energy & Utilities Support</div>
        <div className="border-b border-gray-100 py-2 text-gray-800">• Food & Nutrition Assistance</div>
        <div className="border-b border-gray-100 py-2 text-gray-800">• Education & Training Grants</div>
        <div className="border-b border-gray-100 py-2 text-gray-800">• Childcare Support</div>
        <div className="py-2 text-gray-800">• Senior & Disability Benefits</div>
        <p 
          className="text-blue-900 mt-4 cursor-pointer hover:underline"
          onClick={() => alert("Viewing all 23 government programs...\n\nThis would show a full list with search and filters in a real app.")}
        >
          View All (23 programs) ›
        </p>
      </div>

      {/* Refresh Button */}
      {error && (
        <button
          onClick={fetchBenefits}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all"
        >
          🔄 Retry Loading Benefits
        </button>
      )}
    </div>
  );
};

export default Government;