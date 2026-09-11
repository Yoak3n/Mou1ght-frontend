import { http } from "@/utils/request"
import type { UpdatePostStatusRequest } from "@/api/article/type"
import type { PostListResponse } from "@/types"

const API = {
    LIST_URL: "/message/list/admin",
    DELETE_URL: "/message/delete",
    STATUS_URL: "/message/status",
}

export const getMessageList = () => http.post<PostListResponse>(API.LIST_URL, {
    sort: "desc",
    date_range: null,
})
export const deleteMessage = (id: string) => http.delete<null>(`${API.DELETE_URL}/${id}`)
export const updateMessageStatus = (data: UpdatePostStatusRequest) => http.post<null>(API.STATUS_URL, data)
