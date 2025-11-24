import { userView } from "../user/type"

export interface articleView{
    id:number
    title:string
    tag:string[]
    description:string
    category:CategoryPostDTO
    cover:string
    author_id: number
}

export interface CategoryPostDTO {
    name:string
    description:string
}

export interface ArticleDetailView extends articleView{
    content:string
    author?:userView
}

export interface ArticleAddPostData {
    title:string
    content:string
    tag: string[]
    author_id: number
    description:string
    category:CategoryPostDTO
    cover:string
}

export interface ArticleUpdatePostData extends ArticleAddPostData{
    id:number
}


