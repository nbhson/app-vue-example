import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const apiClient = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
})

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response) {
            console.error(`[API Error] ${error.response.status}:`, error.response.data)
        } else if (error.request) {
            console.error('[API Error] No response received')
        } else {
            console.error('[API Error]', error.message)
        }
        return Promise.reject(error)
    }
)

export default apiClient
