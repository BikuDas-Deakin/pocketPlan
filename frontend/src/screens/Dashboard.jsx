import React, { useEffect, useState } from "react";
import api from "../api/api";

const Dashboard = ({ navigateTo }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchUserData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        api.expenses.getAll(),
        api.budgets.getAll(),
      ]);

      setExpenses(expensesRes.expenses || []);
      setBudgets(budgetsRes.budgets || []);
    } catch (err) {
      setError(err.error || "Failed to load data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await api.user.getProfile();
      setUser(res.user || null);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Budget summary → only expenses count
  const calculateBudgetSummary = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentBudgets = budgets.filter(
      (b) => b.month === currentMonth && b.year === currentYear
    );
    const totalBudget = currentBudgets.reduce(
      (sum, b) => sum + parseFloat(b.amount),
      0
    );

    const currentMonthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() + 1 === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // only count expenses, not incomes
    const totalSpent = currentMonthExpenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
    };
  };

  const getRecentTransactions = () => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  // support both income + expense categories
  const getCategoryEmoji = (category) => {
    const emojis = {
      // Expenses
      food: "🍕",
      housing: "🏠",
      transport: "⛽",
      utilities: "💡",
      entertainment: "🎮",
      healthcare: "🏥",
      other: "🎯",
      // Income
      salary: "💼",
      freelance: "💻",
      investment: "📈",
      business: "🏢",
      gift: "🎁",
      other_income: "💰",
    };
    return emojis[category?.toLowerCase()] || "💰";
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            onClick={fetchDashboardData}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const budgetSummary = calculateBudgetSummary();
  const recentTransactions = getRecentTransactions();

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Good morning, {user ? user.name : "there"}!
        </h2>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
          🔔
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-base text-gray-800">Monthly Budget</p>
        <h3 className="text-xl font-semibold text-blue-900 my-2">
          ${budgetSummary.totalSpent.toFixed(2)} / $
          {budgetSummary.totalBudget.toFixed(2)}
        </h3>
        <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 rounded transition-all"
            style={{
              width: `${Math.min(budgetSummary.percentageUsed, 100)}%`,
            }}
          ></div>
        </div>
        <p
          className={`text-sm mt-2 ${
            budgetSummary.remaining >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          ${Math.abs(budgetSummary.remaining).toFixed(2)}{" "}
          {budgetSummary.remaining >= 0 ? "remaining" : "over budget"}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <p className="text-base text-gray-800 mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <div
            className="bg-blue-900 text-white p-5 rounded-lg text-center cursor-pointer hover:bg-blue-800 transition-colors"
            onClick={() => navigateTo("addTransaction")}
          >
            ➕ Add Transaction
          </div>
          <div
            className="bg-gray-100 text-gray-800 p-5 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => navigateTo("budgets")}
          >
            💰 Set Budget
          </div>
          <div
            className="bg-gray-100 text-gray-800 p-5 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors col-span-2"
            onClick={() => navigateTo("insights")}
          >
            📊 Analytics
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <p className="text-base text-gray-800 mb-4">Recent Transactions</p>
        {recentTransactions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-gray-500">No transactions yet</p>
            <button
              onClick={() => navigateTo("addTransaction")}
              className="mt-3 text-blue-900 hover:underline"
            >
              Add your first transaction
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex justify-between items-center py-2 ${
                  index !== recentTransactions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <span className="text-base">
                  {getCategoryEmoji(transaction.category)}{" "}
                  {transaction.description || transaction.category}
                </span>
                <span
                  className={`text-base font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {parseFloat(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
