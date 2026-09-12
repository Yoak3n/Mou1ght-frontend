import { http } from "@/utils/request"

const API = {
    UPLOAD_URL: "/attachment/upload",
    LIST_URL: "/attachment/list",
    DELETE_URL: (id: string) => `/attachment/delete/${id}`
}

export interface AttachmentInfo {
    id: string
    url: string
    file_path?: string
    original_name: string
    size: number
    mime: string
    referenced?: boolean
}

export interface AttachmentListResponse {
    attachments: AttachmentInfo[]
}

// 不要手动设 Content-Type：浏览器需要自动带上 multipart boundary，否则后端无法解析
export const uploadAttachment = (data: FormData) => http.post<AttachmentListResponse>(API.UPLOAD_URL, data, {
    timeout: 60_000,
})
export const getAttachmentList = () => http.get<AttachmentListResponse>(API.LIST_URL)
export const deleteAttachment = (id: string) => http.delete<null>(API.DELETE_URL(id))
