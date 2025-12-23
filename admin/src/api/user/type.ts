

export interface UserLoginRequest{
    username:string,
    password:string
}

export interface UserRegisterRequest extends UserLoginRequest{
    email:string
}