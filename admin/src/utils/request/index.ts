import axios, { type AxiosRequestConfig } from "axios"
import type { Response } from "@/types"
import router from "@/router"
import useUserStore from "@/store/modules/user"
import { setToken } from "@/utils/storage"

const baseURL = (import.meta.env.VITE_APP_BASE_API as string | undefined) || "/api/v1"

const request = axios.create({
    baseURL,
    timeout: 5000,
});

request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    config.headers.set("Authorization", "Bearer " + userStore.token)
    return config
})

request.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // 网络错误（没有响应对象）时直接给统一提示，避免访问 error.response 崩溃
        if (!axios.isAxiosError(error) || !error.response) {
            return Promise.reject("网络出现问题")
        }
        const { status, data } = error.response
        let message = (data as Response<any>)?.message || "网络出现问题"
        switch (status) {
            case 401:
                message = "TOKEN过期"
                const userStore = useUserStore()
                userStore.token = ''
                userStore.info = null
                setToken('')
                router.push('/entry')
                break
            case 403:
                message = "无授权"
                break
            case 404:
                message = "请求地址错误"
                break
            case 500:
                message = "服务器出现问题"
                break
            default:
                message = "网络出现问题"
                break
        }
        return Promise.reject(message)
    }
)

// 类型化的请求助手：统一返回 Promise<Response<T>>，
// 调用方只需声明 T，不必写 axios 的 <any, Response<T>> 双泛型。
export interface HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Response<T>>
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Response<T>>
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
}

export const http: HttpClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) => request.get<any, Response<T>>(url, config),
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => request.post<any, Response<T>>(url, data, config),
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => request.put<any, Response<T>>(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => request.delete<any, Response<T>>(url, config),
}

export default request
