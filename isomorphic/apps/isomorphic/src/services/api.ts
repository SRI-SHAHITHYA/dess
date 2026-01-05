import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// CSRF token storage
let csrfToken: string | null = null;

// Fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    const response = await apiClient.get('/csrf-token');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token for POST, PUT, DELETE requests
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If CSRF token is invalid, refresh it and retry
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await fetchCsrfToken();
      return apiClient(originalRequest);
    }

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authAPI.refresh();
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login or handle unauthorized
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get('/auth/check');
    return response.data;
  },
};

// ==================== CATEGORIES API ====================
export const categoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  getByType: async () => {
    const response = await apiClient.get('/api/categories/by-type');
    return response.data;
  },

  create: async (data: { name: string; description: string; type: string }) => {
    const response = await apiClient.post('/api/categories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{ name: string; description: string; type: string }>) => {
    const response = await apiClient.put(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },
};

// ==================== MODULES API (For Standalone) ====================
export const modulesAPI = {
  getByCategory: async (categoryId: number) => {
    const response = await apiClient.get(`/api/modules/${categoryId}`);
    return response.data;
  },

  create: async (data: { categoryId: number; name: string; description: string; image_url?: string }) => {
    const response = await apiClient.post('/api/modules', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{ name: string; description: string; image_url?: string }>) => {
    const response = await apiClient.put(`/api/modules/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/modules/${id}`);
    return response.data;
  },
};

// ==================== SUBMODULES API (For Module-based) ====================
export const submodulesAPI = {
  getByCategory: async (categoryId: number, page = 1, limit = 20) => {
    const response = await apiClient.get(`/api/submodules/category/${categoryId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  create: async (data: { category_id: number; name: string; description?: string }) => {
    const response = await apiClient.post('/api/submodules', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string }) => {
    const response = await apiClient.put(`/api/submodules/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/submodules/${id}`);
    return response.data;
  },
};

// ==================== TOPICS API ====================
export const topicsAPI = {
  // For standalone (via module)
  getByModule: async (moduleId: number) => {
    const response = await apiClient.get(`/api/topics/module/${moduleId}`);
    return response.data;
  },

  // For module-based (via submodule)
  getBySubmodule: async (submoduleId: number) => {
    const response = await apiClient.get(`/api/topics/${submoduleId}`);
    return response.data;
  },

  create: async (data: {
    submoduleId?: number;
    moduleId?: number;
    name: string;
    content: string;
    image_url?: string;
  }) => {
    const response = await apiClient.post('/api/topics', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{ name: string; content: string; image_url?: string }>) => {
    const response = await apiClient.put(`/api/topics/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/topics/${id}`);
    return response.data;
  },
};

export default apiClient;
