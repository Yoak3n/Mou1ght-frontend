import type { BlogSetting, Response } from "@/types";
import request from "@/utils/request";


const API = {
    BLOG_SETTING: '/setting/blog',
}

export const getBlogSetting = () => request.get<any,Response<BlogSetting>>(API.BLOG_SETTING);
export const updateBlogSetting = (data:BlogSetting) => request.put<any,Response<any>>(API.BLOG_SETTING,data);