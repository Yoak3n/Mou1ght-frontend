import request from "@/utils/request";
import type { Response } from "@/types";

const API = {
    UPLOAD_URL: "/attachment/upload",
    LIST_URL: "/attachment/list"
}

export const uploadAttachment = (data: FormData) => request.post<any, Response<string[]>>(API.UPLOAD_URL, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const getAttachmentList = () => request.get<any, Response<string[]>>(API.LIST_URL)