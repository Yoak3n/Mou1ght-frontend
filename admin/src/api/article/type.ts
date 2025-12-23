import type { Sign } from "@/types";

export interface CreateArticleRequest {
    title: string;
    content: string;
    author: string;
    tags: Sign[];
    categories: Sign[];
}

export interface PostListRequest {
    filter: PostFilter,
    data?: PostFilterData
}

export interface PostFilter {
    type: string,
    date_range? :PostFilterDate
    sort?: string
}

export interface PostFilterDate {
    start_date: string
    end_date: string
}

export interface PostFilterData {
    keyword: string[]
}

export interface UpdateArticleRequest extends CreateArticleRequest {
    id: string
}