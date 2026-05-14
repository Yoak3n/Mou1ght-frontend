import request from "@/utils/request";
import type { Response } from "@/types";

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

export const uploadAttachment = (data: FormData) => request.post<any, Response<AttachmentListResponse>>(API.UPLOAD_URL, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const getAttachmentList = () => request.get<any, Response<AttachmentListResponse>>(API.LIST_URL)
