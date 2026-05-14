import type { PostListResponse, Response} from "@/types"
import request from "@/utils/request"
import type { CreateSharingRequest, UpdatePostStatusRequest } from "./type"


const API = {
    CREATE_URL : "/sharing/create",
    LIST_URL : "/sharing/list/admin",
    DELETE_URL : "/sharing/delete",
    STATUS_URL: "/sharing/status",
}

export const createSharing = (data:CreateSharingRequest)=> request.post<any,Response<null>>(API.CREATE_URL,data)
export const getSharingList = ()=> {
    const req = {
        filter: {
            type: "single"
        },
    }
    return request.post<any,Response<PostListResponse>>(API.LIST_URL,req)
}
export const deleteSharing = (id: string) => request.delete<any,Response<null>>(`${API.DELETE_URL}/${id}`)
export const updateSharingStatus = (data: UpdatePostStatusRequest) => request.post<any, Response<null>>(API.STATUS_URL, data)
