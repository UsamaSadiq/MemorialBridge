/**
 * API Client Configuration
 * Axios instance with interceptors for authentication and error handling
 */
import axios from 'axios';
// Detect test environment (Vitest sets import.meta.env.MODE === 'test')
const IS_TEST = typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test';
let apiClient;
if (IS_TEST) {
    // Lightweight mock client used during tests to avoid real network calls
    const createMockFn = () => {
        const queue = [];
        const fn = (..._args) => {
            // If queue has items, use the first one
            if (queue.length > 0) {
                const item = queue.shift();
                if (item.type === 'implementation') {
                    return item.value(..._args);
                }
                return item.value;
            }
            // If _impl is set, use it
            if (fn._impl) {
                const result = fn._impl(..._args);
                fn._impl = null; // Clear after single use
                return result;
            }
            // Default response
            return Promise.resolve({ data: {} });
        };
        fn.mockResolvedValueOnce = (value) => {
            queue.push({ type: 'resolved', value: Promise.resolve(value) });
            return fn;
        };
        fn.mockImplementationOnce = (impl) => {
            queue.push({ type: 'implementation', value: impl });
            return fn;
        };
        fn.mockImplementation = (impl) => {
            fn._impl = impl;
            return fn;
        };
        fn.mockRejectedValueOnce = (error) => {
            queue.push({ type: 'rejected', value: Promise.reject(error) });
            return fn;
        };
        return fn;
    };
    const mockClient = {
        get: createMockFn(),
        post: createMockFn(),
        put: createMockFn(),
        patch: createMockFn(),
        delete: createMockFn(),
        interceptors: {
            request: { use: () => { } },
            response: { use: () => { } },
        },
    };
    apiClient = mockClient;
}
else {
    // API client configuration
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
    // Create axios instance
    apiClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // Request interceptor - add auth token; omit Content-Type for FormData (multipart)
    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // FormData must use browser-set Content-Type (multipart/form-data; boundary=...)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    // Response interceptor - handle errors
    apiClient.interceptors.response.use((response) => response, async (error) => {
        const originalRequest = error.config;
        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Clear auth state and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        // Log error for debugging
        const errorData = error.response?.data;
        console.error('API Error:', {
            status: error.response?.status,
            message: errorData?.detail || error.message,
            url: error.config?.url,
        });
        return Promise.reject(error);
    });
}
export { apiClient };
export default apiClient;
