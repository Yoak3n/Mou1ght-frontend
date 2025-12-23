import request from "@/utils/request";
import type { Response } from "@/types";

const API = {
    UPLOAD_URL: "/attachment/upload"
}

export const uploadAttachment = (data: FormData) => request.post<any, Response<string>>(API.UPLOAD_URL, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
