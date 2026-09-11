import { http } from "@/utils/request"
import type { Sign, TagRequest } from "@/types"

const API = {
    ALL_URL: '/tag/all',
    CREATE_URL: '/tag/create',
    DELETE_URL: '/tag/delete'
}

export const getAllTags = () => http.get<Sign[]>(API.ALL_URL)
export const createTag = (data: TagRequest) => http.post<Sign>(API.CREATE_URL, data)
export const deleteTag = (id: string) => http.delete<Sign>(`${API.DELETE_URL}/${id}`)
