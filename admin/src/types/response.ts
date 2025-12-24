import type { ArticleInfo, MessageInfo, SharingInfo } from "./post"

export interface Response<T>{
    code:number,
    message:string,
    data:T
}

export interface PostListResponse {
    articles?: ArticleInfo[]
    sharings?: SharingInfo[]
    messages?: MessageInfo[]
    authors?: []
    tags?:[]
    categories? :[]
}