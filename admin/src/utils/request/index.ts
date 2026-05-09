import axios from "axios"
import type { Response } from "@/types"
import router from "@/router"
import useUserStore from "@/store/modules/user"
import { setToken } from "@/utils/storage"

const baseURL = (import.meta.env.VITE_APP_BASE_API as string | undefined) || "/api/v1"

let request = axios.create({
    baseURL,
    timeout:5000,
});

request.interceptors.request.use((config)=>{
    const userStore = useUserStore()
    config.headers.set("Authorization","Bearer " + userStore.token)
    return config
})

request.interceptors.response.use((response)=>{
    return response.data 
},(error)=>{
    let statusCode = error.response.status;
    let data = error.response.data as Response<any>
    let message = data.message || "网络出现问题"
    switch(statusCode){
        case 401:
            message = "TOKEN过期"
            const userStore = useUserStore()
            userStore.token = ''
            userStore.auth = false
            userStore.info = null
            setToken('')
            router.push('/entry')
            break;
        case 403:
            message = "无授权"
            break;
        case 404:
            message = "请求地址错误"
            break;
        case 500:
            message = "服务器出现问题"
            break;
        default:
            message = "网络出现问题"
            break;
    }
    return Promise.reject(message)
})

export default request;
