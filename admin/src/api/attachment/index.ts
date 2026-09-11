import { http } from "@/utils/request"

const API = {
    UPLOAD_URL: "/attachment/upload",
    LIST_URL: "/attachment/list"
}

export interface AttachmentInfo {
    id: string
    url: string
    original_name: string
    size: number
    mime: string
}

export interface AttachmentListResponse {
    attachments: AttachmentInfo[]
}

export const uploadAttachment = (data: FormData) => http.post<AttachmentListResponse>(API.UPLOAD_URL, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const getAttachmentList = () => http.get<AttachmentListResponse>(API.LIST_URL)
