import React, { useEffect, useState } from "react";
import api from "../api/api";

const Insights = ({ navigateTo }) => {
  const [transactions, setTransactions] = useState([]); // incomes + expenses
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
      setTransactions(expensesRes.expenses || []); // same API but has type: income/expense
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

  // Category breakdown (income + expense)
  const calculateCategoryBreakdown = () => {
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const total = monthTx.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const categories = {};

    monthTx.forEach((t) => {
      const cat = `${t.type}_${t.category.toLowerCase()}`; // separate income vs expense
      categories[cat] = (categories[cat] || 0) + parseFloat(t.amount);
    });

    return Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        type: name.startsWith("income") ? "income" : "expense",
        category: name.split("_")[1],
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getCategoryBudgets = () => {
    const currentMonthBudgets = budgets.filter(
      (b) => b.month === selectedMonth + 1 && b.year === selectedYear
    );

    const monthExpenses = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
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

  const getCategoryEmoji = (type, category) => {
    const expenseEmojis = {
      food: "🍕",
      housing: "🏠",
      transport: "⛽",
      utilities: "💡",
      entertainment: "🎮",
      healthcare: "🏥",
      other: "🎯",
    };
    const incomeEmojis = {
      salary: "💼",
      freelance: "💻",
      investment: "📈",
      business: "🏢",
      gift: "🎁",
      other_income: "💰",
    };
    return type === "income"
      ? incomeEmojis[category] || "💰"
      : expenseEmojis[category] || "💸";
  };

  const getCategoryColor = (type, category) => {
    const expenseColors = {
      housing: "#1e3a8a",
      food: "#10b981",
      transport: "#f59e0b",
      utilities: "#8b5cf6",
      entertainment: "#ec4899",
      healthcare: "#06b6d4",
      other: "#f3f4f6",
    };
    const incomeColors = {
      salary: "#16a34a",
      freelance: "#0284c7",
      investment: "#9333ea",
      business: "#f43f5e",
      gift: "#eab308",
      other_income: "#64748b",
    };
    return type === "income"
      ? incomeColors[category] || "#64748b"
      : expenseColors[category] || "#f3f4f6";
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

      {/* Breakdown Chart */}
      <div className="bg-white rounded-xl p-5 mb-5 text-center">
        <p className="text-base text-gray-800 mb-5">Income vs Expense Breakdown</p>
        {breakdown.length > 0 ? (
          <>
            <div
              className="w-30 h-30 rounded-full mx-auto mb-5"
              style={{
                width: "120px",
                height: "120px",
                background: `conic-gradient(${breakdown
                  .map((cat, idx) => {
                    const prevTotal = breakdown
                      .slice(0, idx)
                      .reduce((sum, c) => sum + parseFloat(c.percentage), 0);
                    const currentTotal = prevTotal + parseFloat(cat.percentage);
                    return `${getCategoryColor(
                      cat.type,
                      cat.category
                    )} ${prevTotal * 3.6}deg ${currentTotal * 3.6}deg`;
                  })
                  .join(", ")})`,
              }}
            ></div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {breakdown.slice(0, 6).map((cat) => (
                <span key={cat.name} className="flex items-center text-sm">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: getCategoryColor(cat.type, cat.category),
                    }}
                  ></span>
                  {getCategoryEmoji(cat.type, cat.category)}{" "}
                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}{" "}
                  {cat.percentage}%
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 py-8">No transaction data for this month</p>
        )}
      </div>

      {/* Category Budgets (expenses only) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-4">Category Budgets</p>

        {categoryBudgets.length > 0 ? (
          categoryBudgets.map((item, index) => (
            <div
              key={item.category}
              className={`flex justify-between items-center py-4 ${
                index !== categoryBudgets.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{getCategoryEmoji("expense", item.category)}</span>
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
              "linear-gradient(to right, #22c55e 0%, #1e3a8a 50%, #ef4444 100%)",
          }}
        ></div>
        <p className="text-sm text-gray-500 text-center mt-3">
          Detailed income/expense trend visualization coming soon
        </p>
      </div>
    </div>
  );
};

export default Insights;
