import { http } from "@/utils/request"
import type { CreateSharingRequest, UpdatePostStatusRequest } from "./type"
import type { PostListResponse } from "@/types"

const API = {
    CREATE_URL: "/sharing/create",
    LIST_URL: "/sharing/list/admin",
    DELETE_URL: "/sharing/delete",
    STATUS_URL: "/sharing/status",
}

export const createSharing = (data: CreateSharingRequest) => http.post<null>(API.CREATE_URL, data)
export const getSharingList = () => http.post<PostListResponse>(API.LIST_URL, {
    filter: {
        type: "single"
    },
})
export const deleteSharing = (id: string) => http.delete<null>(`${API.DELETE_URL}/${id}`)
export const updateSharingStatus = (data: UpdatePostStatusRequest) => http.post<null>(API.STATUS_URL, data)
