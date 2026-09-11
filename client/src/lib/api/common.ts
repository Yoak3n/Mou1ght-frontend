'use server'

import { unstable_cache } from 'next/cache';
import { BlogSetting, Response } from "@/types";
import { ArticleInfo, PostListResponse, CategoryGroup, Sign } from "@/types/post";

const BASE_URL = (() => {
    const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const base = (raw && raw.trim()) || "http://localhost:10420";
    const trimmed = base.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
})();

// 公共读接口统一走 unstable_cache（tag: content）：
// 支持后台 webhook 按需失效，也让使用 POST 列表接口的页面可以静态化（ISR）。
const getBlogSettingCached = unstable_cache(async (): Promise<BlogSetting | null> => {
    try {
        const res = await fetch(`${BASE_URL}/setting/blog/public`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`Failed to fetch blog setting: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<BlogSetting> = await res.json();

        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}, ['blog-setting'], { tags: ['content'], revalidate: 300 });

export async function getBlogSetting(): Promise<BlogSetting | null> {
    return getBlogSettingCached();
}

const getArticleListCached = unstable_cache(async (): Promise<ArticleInfo[] | null> => {
    try {
        const data = {
            filter: {
                type: 'single',
                sort: 'desc'
            },
            data: {
                keyword: []
            }
        }
        const res = await fetch(`${BASE_URL}/article/list`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error(`Failed to fetch article list: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<PostListResponse> = await res.json();
        if (json.code !== 0) {
            console.error("API Error:", json.message);
            return null;
        }

        return json.data.articles || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}, ['article-list'], { tags: ['content'], revalidate: 300 });

export async function getArticleList(): Promise<ArticleInfo[] | null> {
    return getArticleListCached();
}

const getAllCategoriesCached = unstable_cache(async (): Promise<CategoryGroup[] | null> => {
    try {
        const res = await fetch(`${BASE_URL}/category/all`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json: Response<CategoryGroup[]> = await res.json();
        return json.code === 0 ? json.data : null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}, ['category-all'], { tags: ['content'], revalidate: 600 });

export async function getAllCategories(): Promise<CategoryGroup[] | null> {
    return getAllCategoriesCached();
}

const getAllTagsCached = unstable_cache(async (): Promise<Sign[] | null> => {
    try {
        const res = await fetch(`${BASE_URL}/tag/all`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json: Response<Sign[]> = await res.json();
        return json.code === 0 ? json.data : null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}, ['tag-all'], { tags: ['content'], revalidate: 600 });

export async function getAllTags(): Promise<Sign[] | null> {
    return getAllTagsCached();
}

export async function viewPost(id: string, type: 'article' | 'sharing' | 'message', token?: string): Promise<boolean> {
    try {
        const headers: HeadersInit = {
            // 标记流量来自前台代理：后端据此要求浏览器流量携带游客 token
            'x-proxied-by': 'client',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const url = type === 'message'
            ? `${BASE_URL}/message/view/${id}`
            : `${BASE_URL}/${type}/view/${id}?type=${type}`;
        const res = await fetch(url, {
            method: 'POST',
            headers,
            cache: "no-store",
        });
        if (!res.ok) return false;
        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function likePost(id: string, type: 'article' | 'sharing' | 'message', token?: string): Promise<boolean> {
    try {
        const headers: HeadersInit = {
            'x-proxied-by': 'client',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const url = type === 'message'
            ? `${BASE_URL}/message/like/${id}`
            : `${BASE_URL}/${type}/like/${id}?type=${type}`;
        const res = await fetch(url, {
            method: 'POST',
            headers,
            cache: "no-store",
        });
        if (!res.ok) return false;
        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}
