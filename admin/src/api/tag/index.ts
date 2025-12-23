import type { Response,Sign, TagRequest } from "@/types"
import request from "@/utils/request"

const API = {
    ALL_URL : '/tag/all',
    CREATE_URL: '/tag/create',
    DELETE_URL: '/tag/delete'
}

export const getAllTags = () => request.get<any,Response<Sign[]>>(API.ALL_URL)
export const createTag = (data: TagRequest) => request.post<any,Response<Sign>>(API.CREATE_URL,data)
export const deleteTag = (id: string) => request.delete<any,Response<Sign>>(API.DELETE_URL+'/'+id)
