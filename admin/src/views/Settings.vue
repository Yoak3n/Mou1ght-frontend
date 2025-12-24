<template>
    <n-tabs v-model:active-key="activeTab" type="card">
        <n-tab-pane tab="导航设置" name="navigation">
            <n-card title="导航条">
                <n-form>
                    <n-form-item label="导航列表">
                        <link-controller v-model:links="blogSetting.nav_bar.links" />
                    </n-form-item>
                </n-form>
            </n-card>
            <n-card title="网站信息">
                <n-form>
                    <n-form-item label="网站标题">
                        <n-input placeholder="请输入网站标题..." v-model:value="blogSetting.nav_bar.website_information.title" />
                    </n-form-item>
                    <n-form-item label="网站图标">
                        <n-input placeholder="请输入网站图标地址..." v-model:value="blogSetting.nav_bar.website_information.icon" />
                    </n-form-item>
                    <n-form-item label="网站Logo">
                        <n-input placeholder="请输入网站Logo地址..." v-model:value="blogSetting.nav_bar.website_information.logo" />
                    </n-form-item>
                    <n-form-item label="网站关键词">
                        <n-input placeholder="请输入网站关键词..."  />
                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
        <n-tab-pane tab="底部拓展" name="bottom">
            <n-card title="底部信息">
                <n-form>
                    <n-form-item label="html代码">
                        <n-input placeholder="html代码" type="textarea" v-model:value="blogSetting.bottom_extra.html"/>
                    </n-form-item>
                    <n-form-item label="css代码">
                        <n-input placeholder="css代码" type="textarea" v-model:value="blogSetting.bottom_extra.css"/>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';
import { 
    NTabs, 
    NTabPane, 
    NCard, 
    NForm, 
    NFormItem,
    NInput 
} from 'naive-ui';

import type { BlogSetting } from '@/types';
import useSettingStore from '@/store/modules/setting';
import LinkController from '@/components/Form/LinkController.vue';

const initialBlogSetting: BlogSetting = {
    nav_bar: {
        links: [],
        website_information: {
            title: '',
            icon: '',
            logo: '',
            keywords: []
        }
    },
    bottom_extra: {
        html: '',
        css: ''
    }
};      
const settingStore = useSettingStore();
const blogSetting = reactive<BlogSetting>(initialBlogSetting);

const activeTab = ref('navigation');
onMounted(async() => {
    await settingStore.fetchSetting();
    Object.assign(blogSetting, settingStore.setting);
});

const updateSetting = async() => {
    await settingStore.updateSetting(blogSetting);
};

onBeforeUnmount(() => {
    updateSetting();
});
</script>

<style scoped></style>