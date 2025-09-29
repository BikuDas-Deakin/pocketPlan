// src/hooks/useAPI.js

import { useState, useEffect } from 'react';
import api from '../api/api';

// ===== AUTH HOOKS =====
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.auth.login(email, password);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.auth.register(email, password, name);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return { user, isAuthenticated, loading, error, login, register, logout };
};

// ===== EXPENSES HOOKS =====
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.expenses.getAll();
      setExpenses(response.expenses);
    } catch (err) {
      setError(err.error || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const createExpense = async (expenseData) => {
    try {
      const response = await api.expenses.create(expenseData);
      await fetchExpenses(); // Refresh list
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await api.expenses.update(id, expenseData);
      await fetchExpenses(); // Refresh list
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.expenses.delete(id);
      await fetchExpenses(); // Refresh list
    } catch (err) {
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};

export const useExpenseStats = (month, year) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.expenses.getStatsSummary(month, year);
        setStats(response.statistics);
      } catch (err) {
        setError(err.error || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [month, year]);

  return { stats, loading, error };
};

// ===== BUDGETS HOOKS =====
export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.budgets.getAll();
      setBudgets(response.budgets);
    } catch (err) {
      setError(err.error || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const setBudget = async (category, amount, month, year) => {
    try {
      const response = await api.budgets.setBudget(category, amount, month, year);
      await fetchBudgets(); // Refresh list
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    setBudget,
  };
};

// ===== INSIGHTS HOOKS =====
export const useInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.insights.getAIInsights();
      setInsights(response.insights);
    } catch (err) {
      setError(err.error || 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return { insights, loading, error, refetch: fetchInsights };
};

// ===== GOVERNMENT BENEFITS HOOKS =====
export const useBenefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.benefits.getAll();
        setBenefits(response.benefits);
      } catch (err) {
        setError(err.error || 'Failed to fetch benefits');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  return { benefits, loading, error };
};

export const useEligibilityCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkEligibility = async (income, age) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.benefits.checkEligibility(income, age);
      return response.eligible_benefits;
    } catch (err) {
      setError(err.error || 'Eligibility check failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkEligibility, loading, error };
};

// ===== COMMUNITY HOOKS =====
export const useCommunityPosts = (limit = 20, offset = 0) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.community.getPosts(limit, offset);
      setPosts(response.posts);
    } catch (err) {
      setError(err.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit, offset]);

  const createPost = async (content, location) => {
    try {
      const response = await api.community.createPost(content, location);
      await fetchPosts(); // Refresh list
      return response;
    } catch (err) {
      throw err;
    }
  };

  const likePost = async (postId) => {
    try {
      await api.community.likePost(postId);
      await fetchPosts(); // Refresh list
    } catch (err) {
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost,
    likePost,
  };
};