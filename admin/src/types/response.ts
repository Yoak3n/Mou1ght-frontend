import type { ArticleInfo } from "./post"

export interface Response<T>{
    code:number,
    message:string,
    data:T
}

export interface PostListResponse {
    articles?: ArticleInfo[]
    sharings?: []
    authors?: []
    tags?:[]
    categories? :[]
}