export interface UserInfo extends Partial<OutsideInformation>  {
    id: string,
    username: string
    avatar: string
    role: string
}

export interface OutsideInformation{
    email: string
    phone: string
    last_login: string
}

export interface UserLoginRequest{
    username:string,
    password:string
}

export interface UserRegisterRequest extends UserLoginRequest{
    email:string
}

export interface AuthTokenResponse{
    token: string,
    name : string
}

export interface UserInfoResponse{
    user: UserInfo
}