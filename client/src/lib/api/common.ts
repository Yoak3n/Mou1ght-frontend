'use server'

import { BlogSetting, Response } from "@/types";
import { ArticleInfo, PostListResponse, CategoryGroup, Sign } from "@/types/post";

const BASE_URL = process.env.BASE_URL;

export async function getBlogSetting(): Promise<BlogSetting | null> {
    try {
        const res = await fetch(`${BASE_URL}/setting/blog`, {
            next: { revalidate: 0 } // No cache for now to ensure fresh data during dev
        });

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
}

export async function getArticleList(): Promise<ArticleInfo[] | null> {
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
        });
        if (res.status !== 200) {
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
}

export async function getAllCategories(): Promise<CategoryGroup[] | null> {
    try {
        const res = await fetch(`${BASE_URL}/category/all`, {
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        const json: Response<CategoryGroup[]> = await res.json();
        return json.code === 0 ? json.data : null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

export async function getAllTags(): Promise<Sign[] | null> {
    try {
        const res = await fetch(`${BASE_URL}/tag/all`, {
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        const json: Response<Sign[]> = await res.json();
        return json.code === 0 ? json.data : null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}