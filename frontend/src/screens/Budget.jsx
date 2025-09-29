import React, { useEffect, useState } from "react";
import api from "../api/api";

const BudgetScreen = ({ navigateTo }) => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: "food", name: "Food", emoji: "🍕" },
    { id: "housing", name: "Housing", emoji: "🏠" },
    { id: "transport", name: "Transport", emoji: "⛽" },
    { id: "utilities", name: "Utilities", emoji: "💡" },
    { id: "entertainment", name: "Entertainment", emoji: "🎮" },
    { id: "healthcare", name: "Healthcare", emoji: "🏥" },
    { id: "other", name: "Other", emoji: "🎯" },
  ];

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        api.budgets.getAll(),
        api.expenses.getAll(),
      ]);

      setBudgets(budgetsRes.budgets || []);
      setExpenses(expensesRes.expenses || []);
    } catch (err) {
      setError(err.error || "Failed to load budget data");
      console.error("Budget error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetForCategory = (categoryId) => {
    return budgets.find(
      (b) =>
        b.category.toLowerCase() === categoryId.toLowerCase() &&
        b.month === currentMonth &&
        b.year === currentYear
    );
  };

  const getSpentForCategory = (categoryId) => {
    const categoryExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        e.category.toLowerCase() === categoryId.toLowerCase() &&
        expenseDate.getMonth() + 1 === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    return categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  };

  const handleSetBudget = async (categoryId) => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      alert("Please enter a valid budget amount");
      return;
    }

    setSaving(true);
    try {
      await api.budgets.setBudget(
        categoryId,
        parseFloat(budgetAmount),
        currentMonth,
        currentYear
      );

      // Refresh budget data
      await fetchBudgetData();

      // Reset editing state
      setEditingCategory(null);
      setBudgetAmount("");
    } catch (err) {
      alert(err.error || "Failed to set budget");
      console.error("Set budget error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (categoryId) => {
    const budget = getBudgetForCategory(categoryId);
    setEditingCategory(categoryId);
    setBudgetAmount(budget ? budget.amount.toString() : "");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setBudgetAmount("");
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center px-5">
          <p className="text-red-500 mb-4 text-lg">⚠️ {error}</p>
          <button
            onClick={fetchBudgetData}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalBudget = budgets
    .filter((b) => b.month === currentMonth && b.year === currentYear)
    .reduce((sum, b) => sum + parseFloat(b.amount), 0);

  const totalSpent = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() + 1 === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center mb-5">
        <button
          onClick={() => navigateTo("dashboard")}
          className="mr-3 text-gray-600 text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Monthly Budgets</h2>
      </div>

      {/* Overall Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-600 mb-2">
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-800">
              ${totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-blue-900">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
          <div
            className={`h-full rounded transition-all ${
              totalSpent > totalBudget ? "bg-red-500" : "bg-green-500"
            }`}
            style={{
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Category Budgets */}
      <div>
        <p className="text-base text-gray-800 mb-4">Category Budgets</p>
        <div className="space-y-3">
          {categories.map((category) => {
            const budget = getBudgetForCategory(category.id);
            const spent = getSpentForCategory(category.id);
            const budgetValue = budget ? parseFloat(budget.amount) : 0;
            const percentage = budgetValue > 0 ? (spent / budgetValue) * 100 : 0;
            const isEditing = editingCategory === category.id;

            return (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {category.name}
                      </p>
                      {!isEditing && (
                        <p className="text-sm text-gray-600">
                          ${spent.toFixed(2)} / $
                          {budgetValue > 0 ? budgetValue.toFixed(2) : "0.00"}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => handleEditClick(category.id)}
                      className="text-blue-900 text-sm hover:underline"
                    >
                      {budget ? "Edit" : "Set"}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="Enter budget amount"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                      min="0"
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSetBudget(category.id)}
                        disabled={saving}
                        className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  budgetValue > 0 && (
                    <div>
                      <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                        <div
                          className={`h-full rounded transition-all ${
                            percentage > 100
                              ? "bg-red-500"
                              : percentage > 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p
                        className={`text-sm mt-2 ${
                          spent > budgetValue
                            ? "text-red-500"
                            : "text-gray-600"
                        }`}
                      >
                        {percentage.toFixed(0)}% used
                        {spent > budgetValue &&
                          ` (Over by $${(spent - budgetValue).toFixed(2)})`}
                      </p>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetScreen;