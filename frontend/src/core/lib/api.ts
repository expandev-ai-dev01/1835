import axios, { AxiosInstance } from 'axios';

/**
 * @configuration apiConfig
 * @summary Central API configuration
 */
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  version: import.meta.env.VITE_API_VERSION || 'v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  get externalUrl(): string {
    return `${this.baseUrl}/api/${this.version}/external`;
  },

  get internalUrl(): string {
    return `${this.baseUrl}/api/${this.version}/internal`;
  },
};

/**
 * @client publicClient
 * @summary Axios client for PUBLIC API endpoints
 */
export const publicClient: AxiosInstance = axios.create({
  baseURL: apiConfig.externalUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @client authenticatedClient
 * @summary Axios client for AUTHENTICATED API endpoints
 */
export const authenticatedClient: AxiosInstance = axios.create({
  baseURL: apiConfig.internalUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
authenticatedClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
authenticatedClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
