import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Insights = ({ navigateTo }) => {
  const [transactions, setTransactions] = useState([]);
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
      setTransactions(expensesRes.expenses || []);
      setBudgets(budgetsRes.budgets || []);
    } catch (err) {
      console.error("Insights error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () =>
    new Date(selectedYear, selectedMonth).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

  // --- Expense Breakdown by Category ---
  const calculateCategoryBreakdown = () => {
    const monthExpenses = transactions.filter((e) => {
      const d = new Date(e.date);
      return (
        e.type === "expense" &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
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

  // --- Category Budgets vs Spending ---
  const getCategoryBudgets = () => {
    const currentMonthBudgets = budgets.filter(
      (b) => b.month === selectedMonth + 1 && b.year === selectedYear
    );

    const monthExpenses = transactions.filter((e) => {
      const d = new Date(e.date);
      return (
        e.type === "expense" &&
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

  // --- Monthly Trend (Income vs Expense) ---
  const getMonthlyTrend = () => {
    const trend = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === selectedYear && d.getMonth() === selectedMonth) {
        const day = d.getDate();
        if (!trend[day]) trend[day] = { day, income: 0, expense: 0 };
        if (t.type === "income") trend[day].income += parseFloat(t.amount);
        else trend[day].expense += parseFloat(t.amount);
      }
    });
    return Object.values(trend).sort((a, b) => a.day - b.day);
  };

  const getCategoryEmoji = (cat) => {
    const emojis = {
      food: "🍕",
      housing: "🏠",
      transport: "⛽",
      utilities: "💡",
      entertainment: "🎮",
      healthcare: "🏥",
      salary: "💼",
      business: "🏢",
      gift: "🎁",
      other: "🎯",
    };
    return emojis[cat.toLowerCase()] || "💰";
  };

  const getCategoryColor = (cat) => {
    const colors = {
      housing: "#1e3a8a",
      food: "#10b981",
      transport: "#f59e0b",
      utilities: "#8b5cf6",
      entertainment: "#ec4899",
      healthcare: "#06b6d4",
      salary: "#22c55e",
      business: "#0ea5e9",
      other: "#9ca3af",
    };
    return colors[cat.toLowerCase()] || "#f3f4f6";
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
  const trend = getMonthlyTrend();

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Insights</h2>
        <div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="mr-2 p-2 border rounded-lg"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border rounded-lg"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-lg font-semibold mb-4">📅 {getMonthName()}</p>

      {/* Spending Breakdown */}
      <div className="bg-white rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-4">Spending Breakdown</p>
        {breakdown.length > 0 ? (
          <div>
            {breakdown.map((cat) => (
              <div key={cat.name} className="flex justify-between mb-2">
                <span>
                  {getCategoryEmoji(cat.name)}{" "}
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </span>
                <span className="text-gray-700">
                  ${cat.amount.toFixed(2)} ({cat.percentage}%)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No expenses this month</p>
        )}
      </div>

      {/* Category Budgets */}
      <div className="bg-white rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800 mb-4">Budgets</p>
        {categoryBudgets.length > 0 ? (
          categoryBudgets.map((item) => (
            <div
              key={item.category}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {getCategoryEmoji(item.category)} {item.category}
              </span>
              <span
                className={
                  item.isOverBudget ? "text-red-500" : "text-green-600"
                }
              >
                ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No budgets set this month</p>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl p-5">
        <p className="text-base text-gray-800 mb-4">Income vs Expense Trend</p>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data this month</p>
        )}
      </div>
    </div>
  );
};

export default Insights;
