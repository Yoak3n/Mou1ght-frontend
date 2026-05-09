'use server'

import { Response } from "@/types";
import { CreateMessageRequest, UpdateMessageRequest, UpdateMessagePositionRequest, MessageInfo, PostListResponse } from "@/types/post";

const BASE_URL = (() => {
    const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const base = (raw && raw.trim()) || "http://localhost:10420";
    const trimmed = base.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
})();

export async function createMessage(data: CreateMessageRequest): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/message/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
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

export async function updateMessage(data: UpdateMessageRequest): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/message/update`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
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
        const res = await fetch(`${BASE_URL}/message/position`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
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
            sort: "desc",
            date_range: null
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
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        const list = json.data.messages || [];
        return Array.isArray(list) ? (list.filter((m): m is MessageInfo => !!m && typeof m === 'object')) : [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function getOwnedMessageIDs(visitorToken: string): Promise<string[]> {
    try {
        const res = await fetch(`${BASE_URL}/message/owned?token=${encodeURIComponent(visitorToken)}`, {
            method: 'GET',
        });
        if (!res.ok) return [];
        const json: Response<{ ids: string[] }> = await res.json();
        if (json.code !== 0) return [];
        return json.data?.ids ?? [];
    } catch {
        return [];
    }
}
