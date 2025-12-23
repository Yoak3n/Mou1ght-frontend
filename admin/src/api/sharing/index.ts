import type { Response} from "@/types"
import type { CreateSharingRequest } from "./type"
import request from "@/utils/request"


const API = {
    CREATE_URL : "/sharing/create",
}

export const createSharing = (data:CreateSharingRequest)=> request.post<any,Response<null>>(API.CREATE_URL,data)