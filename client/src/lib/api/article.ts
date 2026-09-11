'use server'

import { unstable_cache } from 'next/cache';
import { ArticleInfo, PostListResponse } from "@/types/post";
import { Response } from "@/types";

const BASE_URL = (() => {
    const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const base = (raw && raw.trim()) || "http://localhost:10420";
    const trimmed = base.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
})();

// 文章读接口统一走 unstable_cache（tag: content）：
// 支持后台 webhook 按需失效，也让页面可以静态化（ISR）。
const getArticlesByCategoryLabelCached = unstable_cache(
    async (category_name: string): Promise<ArticleInfo[] | null> => {
        try {
            const req = {
                filter: { type: "category", sort: "desc" },
                data: { keyword: [category_name] }
            }
            const res = await fetch(`${BASE_URL}/article/list`, {
                method: 'POST',
                body: JSON.stringify(req),
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!res.ok) {
                console.error(`Failed to fetch articles by category: ${res.status} ${res.statusText}`);
                return null;
            }

            const json: Response<PostListResponse> = await res.json();
            if (json.code !== 0) {
                console.error("API Error:", json.message);
                return null;
            }
            // The API returns a list of categories matching the keyword.
            // We assume the first one is the correct one since we filter by exact label if unique.
            // Actually keyword search might return multiple if label is substring?
            // Backend uses `label in ?` so it is exact match for the set of labels provided.
            const categoryGroup = json.data.categories?.find(c => c.category.label === category_name);
            return categoryGroup ? categoryGroup.articles : [];
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        }
    },
    ['articles-by-category'],
    { tags: ['content'], revalidate: 600 }
);

export async function getArticlesByCategoryLabel(category_name: string): Promise<ArticleInfo[] | null> {
    return getArticlesByCategoryLabelCached(category_name);
}

const getArticlesByTagLabelCached = unstable_cache(
    async (label: string): Promise<ArticleInfo[] | null> => {
        try {
            const req = {
                filter: { type: "tag", sort: "desc" },
                data: { keyword: [label] }
            }
            const res = await fetch(`${BASE_URL}/article/list`, {
                method: 'POST',
                body: JSON.stringify(req),
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!res.ok) {
                console.error(`Failed to fetch articles by tag: ${res.status} ${res.statusText}`);
                return null;
            }

            const ret: Response<PostListResponse> = await res.json();
            if (ret.code !== 0) {
                console.error("API Error:", ret.message);
                return null;
            }

            const tagGroup = ret.data.tags?.find(t => t.tag.label === label);
            return tagGroup ? tagGroup.articles : [];
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        }
    },
    ['articles-by-tag'],
    { tags: ['content'], revalidate: 600 }
);

export async function getArticlesByTagLabel(label: string): Promise<ArticleInfo[] | null> {
    return getArticlesByTagLabelCached(label);
}

const getArticleDetailCached = unstable_cache(
    async (article_id: string): Promise<ArticleInfo | null> => {
        try {
            const res = await fetch(`${BASE_URL}/article/detail/${article_id}`, {
                cache: 'no-store',
            });

            if (!res.ok) {
                console.error(`Failed to fetch article detail: ${res.status} ${res.statusText}`);
                return null;
            }

            const json: Response<ArticleInfo> = await res.json();
            if (json.code !== 0) {
                console.error("API Error:", json.message);
                return null;
            }
            return json.data;
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        }
    },
    ['article-detail'],
    { tags: ['content'], revalidate: 600 }
);

export async function getArticleDetail(article_id: string): Promise<ArticleInfo | null> {
    return getArticleDetailCached(article_id);
}

export async function viewArticle(article_id: string): Promise<boolean> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/article/view/${article_id}`, {
            method: 'POST',
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to view article: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

export async function likeArticle(article_id: string, token?: string): Promise<boolean> {
    'use server'
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${BASE_URL}/article/like/${article_id}`, {
            method: 'POST',
            headers: headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to like article: ${res.status} ${res.statusText}`);
            return false;
        }

        const json: Response<null> = await res.json();
        return json.code === 0;
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}
