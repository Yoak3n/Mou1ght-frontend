import type { PostListResponse, Response} from "@/types"
import request from "@/utils/request"
import type { CreateSharingRequest } from "./type"


const API = {
    CREATE_URL : "/sharing/create",
    LIST_URL : "/sharing/list",
    DELETE_URL : "/sharing/delete"
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