

export interface UserLoginRequest{
    username:string,
    password:string
}

export interface UserRegisterRequest extends UserLoginRequest{
    email:string
}

export interface UpdateUserProfileRequest{
    username:string,
    email:string,
    phone:string,
    avatar:string,
    bio?:string
}

export interface ChangePasswordRequest{
    old_password:string,
    new_password:string
}