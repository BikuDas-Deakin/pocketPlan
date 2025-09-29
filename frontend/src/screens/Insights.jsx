import React, { useEffect, useState } from "react";
import api from "../api/api";

const Insights = ({ navigateTo }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        api.expenses.getAll(),
        api.budgets.getAll(),
      ]);
      setExpenses(expensesRes.expenses || []);
      setBudgets(budgetsRes.budgets || []);
    } catch (err) {
      console.error("Insights error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () => {
    return new Date(selectedYear, selectedMonth).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateCategoryBreakdown = () => {
    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      );
    });

    const total = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const categories = {};

    monthExpenses.forEach((e) => {
      const cat = e.category.toLowerCase();
      categories[cat] = (categories[cat] || 0) + parseFloat(e.amount);
    });

    return Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getCategoryBudgets = () => {
    const currentMonthBudgets = budgets.filter(
      (b) => b.month === selectedMonth + 1 && b.year === selectedYear
    );

    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      );
    });

    return currentMonthBudgets.map((budget) => {
      const spent = monthExpenses
        .filter((e) => e.category.toLowerCase() === budget.category.toLowerCase())
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

      return {
        category: budget.category,
        spent,
        budget: parseFloat(budget.amount),
        isOverBudget: spent > parseFloat(budget.amount),
      };
    });
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      food: "🍕",
      housing: "🏠",
      transport: "⛽",
      utilities: "💡",
      entertainment: "🎮",
      healthcare: "🏥",
      other: "🎯",
    };
    return emojis[category.toLowerCase()] || "💰";
  };

  const getCategoryColor = (category) => {
    const colors = {
      housing: "#1e3a8a",
      food: "#10b981",
      transport: "#f59e0b",
      utilities: "#8b5cf6",
      entertainment: "#ec4899",
      healthcare: "#06b6d4",
      other: "#f3f4f6",
    };
    return colors[category.toLowerCase()] || "#f3f4f6";
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const breakdown = calculateCategoryBreakdown();
  const categoryBudgets = getCategoryBudgets();

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Budget Analytics</h2>
        <button className="bg-gray-100 text-gray-800 border-none py-2 px-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all">
          Change ▼
        </button>
      </div>

      <p className="text-xl font-semibold text-gray-800 mb-4">
        This Month: {getMonthName()}
      </p>

      {/* Spending Breakdown Chart */}
      <div className="bg-white rounded-xl p-5 mb-5 text-center">
        <p className="text-base text-gray-800 mb-5">Spending Breakdown</p>
        {breakdown.length > 0 ? (
          <>
            <div
              className="w-30 h-30 rounded-full mx-auto mb-5"
              style={{
                width: "120px",
                height: "120px",
                background:
                  breakdown.length > 0
                    ? `conic-gradient(${breakdown
                        .map((cat, idx) => {
                          const prevTotal = breakdown
                            .slice(0, idx)
                            .reduce((sum, c) => sum + parseFloat(c.percentage), 0);
                          const currentTotal = prevTotal + parseFloat(cat.percentage);
                          return `${getCategoryColor(cat.name)} ${prevTotal * 3.6}deg ${
                            currentTotal * 3.6
                          }deg`;
                        })
                        .join(", ")})`
                    : "conic-gradient(#f3f4f6 0deg 360deg)",
              }}
            ></div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {breakdown.slice(0, 4).map((cat) => (
                <span key={cat.name} className="flex items-center text-sm">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getCategoryColor(cat.name) }}
                  ></span>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} {cat.percentage}%
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 py-8">No spending data for this month</p>
        )}
      </div>

      {/* Category Budgets */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-4">Category Budgets</p>

        {categoryBudgets.length > 0 ? (
          categoryBudgets.map((item, index) => (
            <div
              key={item.category}
              className={`flex justify-between items-center py-4 ${
                index !== categoryBudgets.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{getCategoryEmoji(item.category)}</span>
                <span className="text-base">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
              <span className="text-base">
                ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  item.isOverBudget ? "bg-yellow-500" : "bg-green-500"
                }`}
              >
                {item.isOverBudget ? "⚠️" : "✓"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No budgets set for this month
          </p>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-5">Monthly Trend</p>
        <div
          className="h-20 rounded-lg relative"
          style={{
            background:
              "linear-gradient(to right, #e5e7eb 0%, #1e3a8a 50%, #e5e7eb 100%)",
          }}
        ></div>
        <p className="text-sm text-gray-500 text-center mt-3">
          Detailed trend visualization coming soon
        </p>
      </div>
    </div>
  );
};

export default Insights;