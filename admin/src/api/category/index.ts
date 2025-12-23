import type { Response,CategoryGroup,CategoryRequest } from "@/types"
import request from "@/utils/request"

const API = {
    ALL_URL: '/category/all',
    CREATE_URL: '/category/create',
    UPDATE_URL: '/category/update',
    DELETE_URL: '/category/delete'
}

export const getAllCategoryGroup = () => request.get<any,Response<CategoryGroup[]>>(API.ALL_URL)
export const createCategory = (data: CategoryRequest) => request.post<any,Response<CategoryGroup>>(API.CREATE_URL,data)
export const updateCategory = (id: string,data: CategoryRequest) => request.put<any,Response<CategoryGroup>>(API.UPDATE_URL+'/'+id,data)
export const deleteCategory = (id: string) => request.delete<any,Response<CategoryGroup>>(API.DELETE_URL+'/'+id)
