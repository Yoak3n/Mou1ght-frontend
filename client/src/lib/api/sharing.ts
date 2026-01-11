'use server'

import { Response } from "@/types";
import { CreateSharingRequest, PostListResponse, SharingInfo } from "@/types/post";

const BASE_URL = process.env.BASE_URL;

export async function createSharing(data: CreateSharingRequest, token?: string): Promise<boolean> {
    'use server'
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${BASE_URL}/sharing/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        });

        if (!res.ok) {
            console.error(`Failed to create sharing: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function getSharingList(): Promise<SharingInfo[] | null> {
    'use server'
    try {
        const req = {
            filter: {
                type: "single"
            },
            data: {
                keyword: []
            }
        }
        const res = await fetch(`${BASE_URL}/sharing/list`, {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            console.error(`Failed to fetch sharing list: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<PostListResponse> = await res.json();
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data.sharings || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function deleteSharing(id: string, token?: string): Promise<boolean> {
    'use server'
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${BASE_URL}/sharing/delete/${id}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!res.ok) {
            console.error(`Failed to delete sharing: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}
