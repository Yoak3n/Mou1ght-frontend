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