import type { UserInfo } from "./user";

export interface PostListResponse {
    articles?: ArticleInfo[]
    // sharings?: SharingInfo[]
    // messages?: MessageInfo[]
    authors?: []
    tags?:[]
    categories? :[]
}


export interface ArticleInfo {
    id: string,
    title: string,
    content: string,
    tags: Sign[],
    categories: Sign[],
    author: UserInfo,
    state: PostState,
    time: PostTimeInfo
}

export interface Sign {
    id: string;
    label: string;
}

export interface PostState {
    view: number,
    like: number,
    length: number,
    status: string
}

export interface PostTimeInfo{
    created_at: string,
    updated_at: string
}