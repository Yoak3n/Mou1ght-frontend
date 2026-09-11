import { http } from "@/utils/request"
import type { CreateArticleRequest, UpdateArticleRequest, PostListRequest, UpdatePostStatusRequest } from "./type"
import type { ArticleInfo, PostListResponse } from "@/types"

const API = {
    CREATE_URL: "/article/create",
    UPDATE_URL: "/article/update",
    DELETE_URL: "/article/delete",
    DETAIL_URL: "/article/detail",
    LIST_URL: "/article/list/admin",
    STATUS_URL: "/article/status",
}

export const createArticle = (data: CreateArticleRequest) => http.post<null>(API.CREATE_URL, data)
export const updateArticle = (data: UpdateArticleRequest) => http.put<null>(API.UPDATE_URL, data)
export const deleteArticle = (id: string) => http.delete<null>(`${API.DELETE_URL}/${id}`)
export const detailArticle = (id: string) => http.get<ArticleInfo>(`${API.DETAIL_URL}/${id}`)
export const listArticle = (data: PostListRequest) => http.post<PostListResponse>(API.LIST_URL, data)
export const updateArticleStatus = (data: UpdatePostStatusRequest) => http.post<null>(API.STATUS_URL, data)
