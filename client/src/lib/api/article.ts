import { ArticleInfo } from "@/types/post";
import { Response } from "@/types";

const BASE_URL = process.env.BASE_URL;

export async function getArticleDetail(article_id: string): Promise<ArticleInfo | null> {
    'use server'
    try {
        const res = await fetch(`${BASE_URL}/article/detail/${article_id}`, {
            next: { revalidate: 0 } // No cache for now to ensure fresh data during dev
        });
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