'use server'

import { Response } from "@/types";
import { AuthTokenResponse, UserInfoResponse, UserLoginRequest, UserRegisterRequest } from "@/types/user";

const BASE_URL = process.env.BASE_URL;

export async function userRegister(data: UserRegisterRequest): Promise<AuthTokenResponse | null> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!res.ok) {
            console.error(`Failed to register: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<AuthTokenResponse> = await res.json();
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function userLogin(data: UserLoginRequest): Promise<AuthTokenResponse | null> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Failed to login: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<AuthTokenResponse> = await res.json();
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function getUserInfo(token?: string): Promise<UserInfoResponse | null> {
    'use server'
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // If no token provided, maybe we rely on cookies automatically sent? 
        // But fetch in server actions doesn't automatically send cookies to external API unless configured.
        // For now, assuming token is passed or we might need to read from cookies() if we want to be smart.

        const res = await fetch(`${BASE_URL}/user/info`, {
            method: 'GET',
            headers: headers,
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            // console.error(`Failed to get user info: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<UserInfoResponse> = await res.json();
        if (json.code !== 0) {
            // console.error("API Error:", json.message);
            return null;
        }

        return json.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function userLogout(token?: string): Promise<boolean> {
    'use server'
    try {
         const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${BASE_URL}/user/logout`, {
            method: 'POST',
            headers: headers,
        });

        if (!res.ok) {
            console.error(`Failed to logout: ${res.status} ${res.statusText}`);
            return false;
        }
        
        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}
