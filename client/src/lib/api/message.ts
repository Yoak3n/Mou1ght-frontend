'use server'

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { Response } from "@/types";
import { CreateMessageRequest, UpdateMessageRequest, UpdateMessagePositionRequest, MessageInfo, PostListResponse } from "@/types/post";

const BASE_URL = (() => {
    const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const base = (raw && raw.trim()) || "http://localhost:10420";
    const trimmed = base.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
})();

// 留言变更后主动失效缓存：让操作者的 router.refresh() 确定性拿到新数据，
// 不依赖后端 webhook 的时序（后端 webhook 仍负责其他访问者的缓存更新）。
function invalidateMessageCache() {
    revalidateTag('content', 'max');
    revalidatePath('/board', 'page');
}

export async function createMessage(data: CreateMessageRequest): Promise<{ ok: boolean; message?: string }> {
    try {
        const res = await fetch(`${BASE_URL}/message/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        let json: Response<null> | null = null;
        try {
            json = await res.json();
        } catch {
            json = null;
        }

        if (!res.ok) {
            console.error(`Failed to create message: ${res.status} ${res.statusText}`);
            return { ok: false, message: json?.message || '发送失败' };
        }

        if (json?.code !== 0) {
            return { ok: false, message: json?.message || '发送失败' };
        }
        invalidateMessageCache();
        return { ok: true };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { ok: false, message: '网络错误，请稍后重试' };
    }
}

export async function updateMessage(data: UpdateMessageRequest): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/message/edit`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to update message: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        if (json.code !== 0) return false;
        invalidateMessageCache();
        return true;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function deleteOwnMessage(data: { id: string; visitor_token: string }): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/message/delete`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to delete message: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        if (json.code !== 0) return false;
        invalidateMessageCache();
        return true;
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
            cache: 'no-store',
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

// 留言列表读接口走 unstable_cache（tag: content），访客留言/后台审核后按需失效。
const getMessageListCached = unstable_cache(async (): Promise<MessageInfo[] | null> => {
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
            cache: 'no-store',
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
}, ['message-list'], { tags: ['content'], revalidate: 60 });

export async function getMessageList(): Promise<MessageInfo[] | null> {
    return getMessageListCached();
}

export async function getOwnedMessageIDs(visitorToken: string): Promise<string[]> {
    try {
        const res = await fetch(`${BASE_URL}/message/owned`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${visitorToken}`,
            },
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const json: Response<{ ids: string[] }> = await res.json();
        if (json.code !== 0) return [];
        return json.data?.ids ?? [];
    } catch {
        return [];
    }
}

export async function fetchVisitorToken(): Promise<string> {
    try {
        const res = await fetch(`${BASE_URL}/message/visitor`, {
            method: 'GET',
            cache: 'no-store',
        });
        if (!res.ok) return '';
        const json: Response<{ id: string }> = await res.json();
        const token = json.data?.id;
        return typeof token === 'string' ? token : '';
    } catch {
        return '';
    }
}
