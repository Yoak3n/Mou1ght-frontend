'use server'

import { ArticleInfo, PostListResponse } from "@/types/post";
import { Response } from "@/types";

const BASE_URL = process.env.BASE_URL;

export async function getArticlesByCategoryLabel(category_name: string): Promise<ArticleInfo[] | null> {
    'use server'
    try {
        const req = {
            filter: { type: "category", sort: "desc" },
            data: { keyword: [category_name] }
        }
        const res = await fetch(`${BASE_URL}/article/list`, {
            method: 'POST',
            body: JSON.stringify(req),
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 0 }
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
}

export async function getArticlesByTagLabel(label: string): Promise<ArticleInfo[] | null> {
    'use server'
    try {
        const req = {
            filter: { type: "tag", sort: "desc" },
            data: { keyword: [label] }
        }
        const res = await fetch(`${BASE_URL}/article/list`, {
            method: 'POST',
            body: JSON.stringify(req),
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 0 }
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
}

export async function getArticleDetail(article_id: string): Promise<ArticleInfo | null> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/article/detail/${article_id}`, {
            next: { revalidate: 0 } // No cache for now to ensure fresh data during dev
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
}

export async function viewArticle(article_id: string): Promise<boolean> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/article/view/${article_id}`, {
            method: 'POST',
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
