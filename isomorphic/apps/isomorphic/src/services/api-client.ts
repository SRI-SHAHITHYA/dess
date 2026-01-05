// API Client configuration for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

// CSRF token storage
let csrfToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (error: unknown) => void }> = [];

// Fetch CSRF token
async function fetchCsrfToken(): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/csrf-token`, {
      credentials: 'include',
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
}

// Refresh access token
async function refreshAccessToken(): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const method = (fetchOptions.method || 'GET').toUpperCase();

    // Build URL with query parameters
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Get CSRF token for POST, PUT, DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(method) && !endpoint.includes('/csrf-token') && !endpoint.includes('/auth/refresh')) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && ['POST', 'PUT', 'DELETE'].includes(method) && !endpoint.includes('/csrf-token') && !endpoint.includes('/auth/refresh')
          ? { 'X-CSRF-Token': csrfToken }
          : {}),
        ...fetchOptions.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);

      // Handle CSRF token refresh on 403
      if (response.status === 403 && !(options as any)._retry) {
        (options as any)._retry = true;
        await fetchCsrfToken();
        // Retry with new CSRF token
        if (csrfToken) {
          config.headers = {
            ...config.headers,
            'X-CSRF-Token': csrfToken,
          };
        }
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }

      // Handle token refresh on 401
      if (response.status === 401 && !(options as any)._retry) {
        if (isRefreshing) {
          // Queue the request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => this.request<T>(endpoint, { ...options, _retry: true } as RequestOptions));
        }

        isRefreshing = true;
        (options as any)._retry = true;

        try {
          await refreshAccessToken();
          // Process queued requests
          failedQueue.forEach((prom) => prom.resolve(undefined));
          failedQueue = [];
          // Retry original request
          return this.request<T>(endpoint, options);
        } catch (refreshError) {
          // Process queued requests with error
          failedQueue.forEach((prom) => prom.reject(refreshError));
          failedQueue = [];
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
