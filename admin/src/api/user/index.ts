import { http } from "@/utils/request"
import type { UserLoginRequest, UserRegisterRequest } from "./type"
import type { UserInfoResponse, AuthTokenResponse } from "@/types"

const API = {
    REGISTER_URL: "/user/register",
    REGISTER_STATUS_URL: "/user/register/status",
    LOGIN_URL: "/user/login",
    USERINFO_URL: "/user/info",
    LOGOUT_URL: "/user/logout"
}

export const userRegister = (data: UserRegisterRequest) => http.post<AuthTokenResponse>(API.REGISTER_URL, data)
export const getRegisterStatus = () => http.get<{ open: boolean }>(API.REGISTER_STATUS_URL)
export const userLogin = (data: UserLoginRequest) => http.post<AuthTokenResponse>(API.LOGIN_URL, data)
export const userInfo = () => http.get<UserInfoResponse>(API.USERINFO_URL)
export const userLogout = () => http.post<null>(API.LOGOUT_URL)
