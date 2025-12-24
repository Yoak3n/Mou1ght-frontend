import type { Response, PostListResponse } from "@/types";
import request from "@/utils/request";

const API = {
    LIST_URL : "/sharing/list",
}


export const getMessageList = ()=> {
    const req = {
        filter: {
            type: "single"
        },
    }
    return request.post<any,Response<PostListResponse>>(API.LIST_URL,req)
}