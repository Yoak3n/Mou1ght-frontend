import { http } from "@/utils/request"
import type { BlogSetting } from "@/types"

const API = {
    BLOG_SETTING: '/setting/blog',
}

export const getBlogSetting = () => http.get<BlogSetting>(API.BLOG_SETTING)
export const updateBlogSetting = (data: BlogSetting) => http.put<null>(API.BLOG_SETTING, data)
