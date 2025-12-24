import type { BlogSetting } from "@/types";
import { defineStore } from "pinia";
import { getBlogSetting, updateBlogSetting } from "@/api/setting";

const useSettingStore = defineStore("setting",{
    state:()=>({
        setting: {} as BlogSetting, 
    }),
    actions: {
        async fetchSetting(){
            try {
                const res = await getBlogSetting();
                this.setting = res.data;
            } catch (error) {
                window.$message?.error("Failed to fetch blog setting");
            }
            return this.setting;
        },
        async updateSetting(data:BlogSetting){
            try {
                const res = await updateBlogSetting(data);
                if (res.code !== 0) {
                    window.$message?.error(res.message || "Failed to update blog setting");
                    return;
                }
                this.setting = data;
            } catch (error) {
                console.error("Failed to update blog setting:", error);
                window.$message?.error("Failed to update blog setting");
            }
        }
    }
});
export default useSettingStore;