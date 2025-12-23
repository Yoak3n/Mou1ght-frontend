import type { UserInfo } from "./user";

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

export interface SharingInfo {
    id: string,
    content: string,
    tags: Sign[],
    author: UserInfo,
    state: PostState,
    time: PostTimeInfo
}

export interface CategoryGroup extends Sign{
    children: CategoryGroup[]
}

export interface CategoryRequest extends Omit<Sign,'id'>{
    parent?: string
}

export interface TagRequest extends Omit<Sign,'id'>{}

export interface Sign {
    id: string;
    label: string;
}

export interface PostState {
    view: number,
    like: number,
    length: number,
    status: number
}

export interface PostTimeInfo{
    created_at: string,
    updated_at: string
}