'use server'

import { Response } from "@/types";
import { CreateMessageRequest, UpdateMessageRequest, UpdateMessagePositionRequest, MessageInfo, PostListResponse } from "@/types/post";

const BASE_URL = process.env.BASE_URL;

export async function createMessage(data: CreateMessageRequest, token?: string): Promise<boolean> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };


        const res = await fetch(`${BASE_URL}/message/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        });
        if (!res.ok) {
            console.error(`Failed to create message: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function updateMessage(data: UpdateMessageRequest, token?: string): Promise<boolean> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${BASE_URL}/message/update`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        });

        if (!res.ok) {
            console.error(`Failed to update message: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function updateMessagePosition(data: UpdateMessagePositionRequest): Promise<boolean> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const res = await fetch(`${BASE_URL}/message/position`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        });

        if (!res.ok) {
            console.error(`Failed to update message position: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function getMessageList(): Promise<MessageInfo[] | null> {
    try {
        const req = {
            filter: {
                type: "single"
            },
            data: {
                keyword: []
            }
        }
        const res = await fetch(`${BASE_URL}/message/list`, {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            console.error(`Failed to fetch message list: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<PostListResponse> = await res.json();
        console.log(JSON.stringify(json))
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data.messages || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}
