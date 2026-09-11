import { http } from "@/utils/request"
import type { CategoryGroup, CategoryRequest } from "@/types"

const API = {
    ALL_URL: '/category/all',
    CREATE_URL: '/category/create',
    UPDATE_URL: '/category/update',
    DELETE_URL: '/category/delete'
}

export const getAllCategoryGroup = () => http.get<CategoryGroup[]>(API.ALL_URL)
export const createCategory = (data: CategoryRequest) => http.post<CategoryGroup>(API.CREATE_URL, data)
export const updateCategory = (id: string, data: CategoryRequest) => http.put<CategoryGroup>(`${API.UPDATE_URL}/${id}`, data)
export const deleteCategory = (id: string) => http.delete<CategoryGroup>(`${API.DELETE_URL}/${id}`)
