import React, { useState } from "react";
import api from "../api/api";

const AddTransaction = ({ navigateTo }) => {
  const [transactionType, setTransactionType] = useState("expense"); // expense or income
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const expenseCategories = [
    { id: "food", icon: "🍕", label: "Food" },
    { id: "housing", icon: "🏠", label: "Housing" },
    { id: "transport", icon: "⛽", label: "Transport" },
    { id: "utilities", icon: "💡", label: "Utilities" },
    { id: "entertainment", icon: "🎮", label: "Entertainment" },
    { id: "healthcare", icon: "🏥", label: "Healthcare" },
    { id: "other", icon: "🎯", label: "Other" },
  ];

  const incomeCategories = [
    { id: "salary", icon: "💼", label: "Salary" },
    { id: "freelance", icon: "💻", label: "Freelance" },
    { id: "investment", icon: "📈", label: "Investment" },
    { id: "business", icon: "🏢", label: "Business" },
    { id: "gift", icon: "🎁", label: "Gift" },
    { id: "other", icon: "💰", label: "Other" },
  ];

  const categories = transactionType === "expense" ? expenseCategories : incomeCategories;

  const handleSaveTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        category: selectedCategory,
        description: description || null,
        date: date,
        payment_method: paymentMethod,
        type: transactionType, // Add type field
      };

      await api.expenses.create(transactionData);
      navigateTo("dashboard");
    } catch (err) {
      setError(err.error || "Failed to save transaction");
      console.error("Save transaction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setTransactionType(type);
    // Reset category when switching types
    setSelectedCategory(type === "expense" ? "food" : "salary");
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="bg-transparent border-none text-xl cursor-pointer p-2 text-blue-900"
          onClick={() => navigateTo("dashboard")}
          disabled={loading}
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
        <div></div>
      </div>

      {/* Transaction Type Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => handleTypeChange("expense")}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            transactionType === "expense"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          💸 Expense
        </button>
        <button
          onClick={() => handleTypeChange("income")}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            transactionType === "income"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          💰 Income
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-5">
        <p className="text-base text-gray-800 mb-2">Amount:</p>
        <div className={`rounded-xl p-8 text-center ${
          transactionType === "expense" ? "bg-red-50" : "bg-green-50"
        }`}>
          <div className="text-3xl font-bold">
            <span className={transactionType === "expense" ? "text-red-600" : "text-green-600"}>
              {transactionType === "expense" ? "-" : "+"}$
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
              className="bg-transparent border-none outline-none text-gray-800 w-32 text-center"
            />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-5">
        <p className="text-base text-gray-800 mb-4">Category:</p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-6 bg-white border-2 rounded-lg text-center cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? transactionType === "expense"
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-900 hover:bg-blue-50"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !loading && setSelectedCategory(category.id)}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm">{category.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <p className="text-base text-gray-800 mb-2">Description (optional):</p>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-blue-900 transition-colors"
          placeholder="Add notes..."
        />
      </div>

      {/* Date and Payment Method */}
      <div className="flex gap-5 mb-5">
        <div className="flex-1">
          <p className="text-base text-gray-800 mb-2">Date:</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-800 border-none p-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all"
          />
        </div>
        <div className="flex-1">
          <p className="text-base text-gray-800 mb-2">Payment:</p>
          <div className="mt-2">
            <label className="flex items-center mb-1 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                disabled={loading}
                className="mr-2"
              />
              Cash
            </label>
            <label className="flex items-center mb-1 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                disabled={loading}
                className="mr-2"
              />
              Card
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "digital"}
                onChange={() => setPaymentMethod("digital")}
                disabled={loading}
                className="mr-2"
              />
              Digital
            </label>
          </div>
        </div>
      </div>

      {/* Receipt Upload */}
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mb-5 cursor-pointer hover:border-blue-900 hover:bg-blue-50 transition-all">
        <p className="text-base text-gray-500">📷 Tap to add receipt photo (Coming soon)</p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveTransaction}
        disabled={loading || !amount}
        className={`w-full text-white border-none p-4 rounded-lg font-semibold cursor-pointer transition-all hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${
          transactionType === "expense"
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "SAVING..." : `SAVE ${transactionType.toUpperCase()}`}
      </button>
    </div>
  );
};

export default AddTransaction;