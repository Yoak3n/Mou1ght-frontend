import type { Response, PostListResponse } from "@/types";
import request from "@/utils/request";

const API = {
    LIST_URL : "/message/list/admin",
}


export const getMessageList = ()=> {
    const req = {
        sort: "desc",
        date_range: null
    }
    return request.post<any,Response<PostListResponse>>(API.LIST_URL,req)
}
