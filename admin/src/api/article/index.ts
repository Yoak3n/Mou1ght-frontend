import request from "@/utils/request"
import type {ArticleAddPostData, ArticleDetailView,ArticleUpdatePostData,articleView} from "./type"
import type {Response} from "../res"

enum API{
    ARTICLEPOST_URL = '/article/add',
    ARTICLELIST_URL = '/article/list',
    ARTICLEDETAIL_URL = '/article/info'
}
export const getArticleList = ()=>request.get<any,Response<{articles:articleView[]}>>(API.ARTICLELIST_URL)
export const getArticleDetail = (id:number)=>request.get<any,ArticleDetailView>(API.ARTICLEDETAIL_URL+"/"+id)
export const addArticle = (data:ArticleAddPostData)=>request.post<any,Response<any>>(API.ARTICLEPOST_URL,data)
export const updateArticle = (data:ArticleUpdatePostData)=>request.post<any,Response<any>>(API.ARTICLEPOST_URL,data)
