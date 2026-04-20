import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Optional: Add token (if using auth)
 *
 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*
*/

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error?.response?.status;
    const data = error?.response?.data;

    let message: string;

    if (status === 401) {
      message = 'Unauthorized. Please sign in.';
    } else if (status === 403) {
      message = "You don't have permission to perform this action.";
    } else {
      // API may return { error: "..." } or { message: "..." } or { errors: [...] }
      message =
        data?.error ||
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.join(', ') : undefined) ||
        error?.message ||
        'Something went wrong.';
    }

    console.error(`Axios error [${status ?? 'network'}]:`, message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
export { axiosInstance }; // named export required by orval mutator

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
} as const;
