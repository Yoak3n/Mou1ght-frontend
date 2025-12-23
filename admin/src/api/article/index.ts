import request from "@/utils/request"
import type { CreateArticleRequest, UpdateArticleRequest, PostListRequest } from "./type"
import type { Response,ArticleInfo, PostListResponse } from "@/types"
const API = {
    CREATE_URL : "/article/create",
    UPDATE_URL : "/article/update",
    DELETE_URL : "/article/delete",
    DETAIL_URL : "/article/detail",
    LIST_URL : "/article/list"
}

export const createArticle = (data:CreateArticleRequest)=> request.post<any,Response<null>>(API.CREATE_URL,data)
export const updateArticle = (data:UpdateArticleRequest)=> request.put<any,Response<null>>(API.UPDATE_URL,data)
export const deleteArticle = (id:string)=> request.delete<any,Response<null>>(`${API.DELETE_URL}/${id}`)
export const detailArticle = (id:string)=> request.get<any,Response<ArticleInfo>>(`${API.DETAIL_URL}/${id}`)
export const listArticle = async (data: PostListRequest) => request.post<any,Response<PostListResponse>>(API.LIST_URL,data)
