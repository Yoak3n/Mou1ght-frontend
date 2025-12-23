import request from "@/utils/request"
import type { UserLoginRequest, UserRegisterRequest } from "./type"
import type { UserInfoResponse, Response, AuthTokenResponse} from "@/types"

const API = {
    REGISTER_URL : "/user/register",
    LOGIN_URL : "/user/login",
    USERINFO_URL : "/user/info",
    LOGOUT_URL : "/user/logout"
}

export const userRegister = (data:UserRegisterRequest)=> request.post<any,Response<AuthTokenResponse>>(API.REGISTER_URL,data) 
export const userLogin = (data:UserLoginRequest)=>request.post<any,Response<AuthTokenResponse>>(API.LOGIN_URL,data)
export const userInfo = ()=>request.get<any,Response<UserInfoResponse>>(API.USERINFO_URL)
export const userLogout = ()=>request.post<any,Response<null>>(API.LOGOUT_URL)
