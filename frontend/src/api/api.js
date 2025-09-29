// src/api/api.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

// ===== AUTHENTICATION APIs =====
export const authAPI = {
  // Register new user
  register: async (email, password, name) => {
    return apiClient.post('/auth/register', { email, password, name });
  },

  // Login user
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },
};
// ===== USER APIs =====
export const userAPI = {
  getProfile: async () => {
    return apiClient.get('/user/profile'); // your backend endpoint
  },
};


// ===== EXPENSES APIs =====
export const expensesAPI = {
  // Get all expenses for user
  getAll: async () => {
    return apiClient.get('/expenses');
  },

  // Get expenses by date range
  getByRange: async (startDate, endDate) => {
    return apiClient.get('/expenses/range', {
      params: { startDate, endDate }
    });
  },

  // Create new expense
  create: async (expenseData) => {
    return apiClient.post('/expenses', expenseData);
  },

  // Update expense
  update: async (id, expenseData) => {
    return apiClient.put(`/expenses/${id}`, expenseData);
  },

  // Delete expense
  delete: async (id) => {
    return apiClient.delete(`/expenses/${id}`);
  },

  // Get expense statistics/summary
  getStatsSummary: async (month, year) => {
    return apiClient.get('/expenses/stats/summary', {
      params: { month, year }
    });
  },
};

// ===== BUDGETS APIs =====
export const budgetsAPI = {
  // Get all budgets
  getAll: async () => {
    return apiClient.get('/budgets');
  },

  // Set/Update budget
  setBudget: async (category, amount, month, year) => {
    return apiClient.post('/budgets', { category, amount, month, year });
  },
};

// ===== COMMUNITY APIs =====
export const communityAPI = {
  // Get posts
  getPosts: async (limit = 20, offset = 0) => {
    return apiClient.get('/community/posts', {
      params: { limit, offset }
    });
  },

  // Create post
  createPost: async (content, location = null) => {
    return apiClient.post('/community/posts', { content, location });
  },

  // Like post
  likePost: async (postId) => {
    return apiClient.post(`/community/posts/${postId}/like`);
  },
};

// ===== GOVERNMENT BENEFITS APIs =====
export const benefitsAPI = {
  // Get all benefits
  getAll: async () => {
    return apiClient.get('/benefits');
  },

  // Check eligibility
  checkEligibility: async (income, age) => {
    return apiClient.post('/benefits/check-eligibility', { income, age });
  },
};

// ===== AI INSIGHTS APIs =====
export const insightsAPI = {
  // Get AI-generated insights
  getAIInsights: async () => {
    return apiClient.get('/insights/ai');
  },
};

// ===== HEALTH CHECK =====
export const healthAPI = {
  check: async () => {
    return apiClient.get('/health');
  },
};

// Default export with all APIs
export default {
  auth: authAPI,
  expenses: expensesAPI,
  budgets: budgetsAPI,
  community: communityAPI,
  benefits: benefitsAPI,
  insights: insightsAPI,
  health: healthAPI,
  user:userAPI,
};