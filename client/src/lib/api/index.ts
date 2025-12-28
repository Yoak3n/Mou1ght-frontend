import { BlogSetting, Response } from "@/types";
import { ArticleInfo, PostListResponse } from "@/types/post";

const BASE_URL = "http://127.0.0.1:10420/api/v1";

export async function getBlogSetting(): Promise<BlogSetting | null> {
    'use server'
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
    'use server'
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
        console.log(res);
        if (res.status !== 200) {
            console.error(`Failed to fetch article list: ${res.status} ${res.statusText}`);
            return null;
        }

        const json: Response<PostListResponse> = await res.json();
        console.log(json);
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
