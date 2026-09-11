'use server'

import { unstable_cache } from 'next/cache';
import { Response } from "@/types";
import { CreateSharingRequest, PostListResponse, SharingInfo } from "@/types/post";

const BASE_URL = (() => {
    const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const base = (raw && raw.trim()) || "http://localhost:10420";
    const trimmed = base.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
})();

// 说说读接口走 unstable_cache（tag: content），后台发布/删除时按需失效。
const getSharingListCached = unstable_cache(async (): Promise<SharingInfo[] | null> => {
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
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error(`Failed to fetch sharing list: ${res.status} ${res.statusText}`);
            return null;
        }

        const data: Response<PostListResponse> = await res.json();
        if (data.code !== 0) {
            console.error("API Error:", data.message);
            return null;
        }

        return data.data.sharings || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}, ['sharing-list'], { tags: ['content'], revalidate: 300 });

export async function getSharingList(): Promise<SharingInfo[] | null> {
    return getSharingListCached();
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
            cache: 'no-store',
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
