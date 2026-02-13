import axios from 'axios';

// Base URL for the API - adjust this based on your backend URL
const BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response?.status === 401) {
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Login admin user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Register new admin user (for development)
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },
};

// Inquiry API calls
export const inquiryAPI = {
  // Submit new inquiry (public)
  submitInquiry: async (inquiryData) => {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  },

  // Get all inquiries with optional filters (admin only)
  getInquiries: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/inquiries/admin${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get single inquiry with follow-ups (admin only)
  getInquiry: async (id) => {
    const response = await api.get(`/inquiries/admin/${id}`);
    return response.data;
  },

  // Update inquiry status (admin only)
  updateInquiry: async (id, status) => {
    const response = await api.put(`/inquiries/admin/${id}`, { status });
    return response.data;
  },

  // Add follow-up to inquiry (admin only)
  addFollowUp: async (id, followUpData) => {
    const response = await api.post(`/inquiries/admin/${id}/followups`, followUpData);
    return response.data;
  },

  // Search inquiries by phone or reference code (admin only)
  searchInquiries: async (searchParams) => {
    const response = await api.get('/inquiries/admin', { params: searchParams });
    return response.data;
  },
};

// Utility function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return 'Something went wrong. Please try again.';
  }
};

// Auth utility functions
export const authUtils = {
  // Save auth data to localStorage
  saveAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get auth data from localStorage
  getAuthData: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api;