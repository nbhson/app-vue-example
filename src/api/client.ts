import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * Base URL phải là https:// hoặc localhost — `VITE_API_BASE_URL` là build-time
 * env công khai: giá trị sai/độc hướng toàn bộ traffic (và token) tới origin
 * khác mà không có báo lỗi nào.
 */
function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid VITE_API_BASE_URL: "${raw}" is not a valid URL`);
  }
  const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  if (parsed.protocol !== 'https:' && !isLocal) {
    throw new Error(`Invalid VITE_API_BASE_URL: only https:// or localhost is allowed (got "${raw}")`);
  }
  return parsed.toString().replace(/\/$/, '');
}

const BASE_URL = resolveBaseUrl();

/**
 * Origin được phép đính kèm auth token. Mặc định KHÔNG có — jsonplaceholder
 * là API demo công khai của bên thứ 3: gửi Bearer token của user tới đó là
 * leak credentials. Chỉ attach khi VITE_AUTH_API_ORIGIN trỏ về API first-party.
 */
const AUTH_ORIGIN = (import.meta.env.VITE_AUTH_API_ORIGIN || '').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!AUTH_ORIGIN || !config.headers) return config;
    // Chỉ attach token cho request tới origin first-party đã khai báo.
    const target = new URL(config.url ?? '', config.baseURL ?? BASE_URL);
    if (target.origin === AUTH_ORIGIN) {
      const token = localStorage.getItem('token');
      if (token && /^[A-Za-z0-9\-._~+/]+=*$/.test(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    // Log chi tiết (kể cả response body) chỉ ở DEV — body có thể chứa dữ liệu
    // nhạy cảm; production chỉ log status + method + path.
    if (import.meta.env.DEV) {
      if (error.response) {
        console.error(`[API Error] ${error.response.status}:`, error.response.data);
      } else if (error.request) {
        console.error('[API Error] No response received');
      } else {
        console.error('[API Error]', error.message);
      }
    } else if (error.response) {
      console.error(`[API Error] ${error.response.status} ${error.config?.method ?? ''} ${error.config?.url ?? ''}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
