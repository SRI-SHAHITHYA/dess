import axios from "axios";
// ================================
// Axios Interceptor for Token Refresh
// ================================
let isRefreshing = false;
let failedQueue = [];
let sessionExpiredCallback = null;

// Allow App component to set a callback for session expiration
export const setSessionExpiredCallback = (callback) => {
  sessionExpiredCallback = callback;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not retrying yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh during login or if refresh endpoint is failing
      if (originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue failed requests
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken(); // 🔄 get new token
        processQueue(null);
        return axios(originalRequest); // retry original request
      } catch (err) {
        processQueue(err, null);
        // If refresh failed, session has expired
        if (sessionExpiredCallback) {
          sessionExpiredCallback();
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// ✅Use environment variable instead of hardcoded URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Validate environment variable
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('⚠️ VITE_API_BASE_URL not set in environment variables. Using default:', BASE_URL);
}

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

// -------------------------------
//  CSRF TOKEN HANDLING
// -------------------------------
let csrfToken = null;

export const getCSRFToken = async () => {
  if (csrfToken) return csrfToken;

  const res = await axios.get(`${BASE_URL}/csrf-token`, { withCredentials: true });
  csrfToken = res.data.csrfToken;

  return csrfToken;
};

// Add request interceptor to automatically include CSRF token
axios.interceptors.request.use(
  async (config) => {
    // Skip CSRF token only for GET requests and CSRF token endpoint itself
    if (config.method !== 'get' && !config.url.includes('/csrf-token')) {
      const token = await getCSRFToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    // Silently fail if no refresh token (user not logged in)
    if (error.response?.status === 401) {
      console.log("No refresh token available - user not logged in");
    } else {
      console.error("Token refresh failed:", error);
    }
    throw error;
  }
};

// -------------------------------
// AUTH APIs
// -------------------------------
export const login = async (email, password) => {
  await getCSRFToken();
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

export const logout = async () => {
  await getCSRFToken();
  await axios.post(`${BASE_URL}/auth/logout`);
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
    return res.data.user;
  } catch {
    return null;
  }
};

// -------------------------------
// CATEGORY APIs
// -------------------------------
// Cache buster to force fresh data after mutations
let categoryCacheVersion = Date.now();

export const invalidateCategoryCache = () => {
  categoryCacheVersion = Date.now();
};

export const getCategories = async () => {
  // Add cache version to bypass stale browser cache
  const res = await axios.get(`${BASE_URL}/api/categories?v=${categoryCacheVersion}`);
  return res.data;
};

export const createCategory = async (category) => {
  await getCSRFToken();
  const res = await axios.post(`${BASE_URL}/api/categories`, category);
  invalidateCategoryCache(); // Invalidate cache after creating
  return res.data;
};

export const updateCategory = async (id, updates) => {
  await getCSRFToken();
  const res = await axios.put(`${BASE_URL}/api/categories/${id}`, updates);
  invalidateCategoryCache(); // Invalidate cache after updating
  return res.data;
};

export const deleteCategory = async (id) => {
  await getCSRFToken();
  const res = await axios.delete(`${BASE_URL}/api/categories/${id}`);
  invalidateCategoryCache(); // Invalidate cache after deleting
  return res.data;
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/check`, { withCredentials: true });
    return res.data;
  } catch {
    return { authenticated: false };
  }
};

// Export axios as default for service files
export default axios;
