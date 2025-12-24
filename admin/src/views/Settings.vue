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
                        <n-input placeholder="请输入网站标题..."
                            v-model:value="blogSetting.nav_bar.website_information.title" />
                    </n-form-item>
                    <n-form-item label="网站图标">
                        <n-input placeholder="请输入网站图标地址..."
                            v-model:value="blogSetting.nav_bar.website_information.icon" />
                    </n-form-item>
                    <n-form-item label="网站Logo">
                        <n-input placeholder="请输入网站Logo地址..."
                            v-model:value="blogSetting.nav_bar.website_information.logo" />
                    </n-form-item>
                    <n-form-item label="网站关键词">
                        <n-space v-for="(value, index) in blogSetting.nav_bar.website_information.keywords">
                            <n-input placeholder="请输入网站关键词..." v-model:value="value" />
                            <n-button-group>
                                <n-button @click="removeKeyword(index)" v-if="index !== 0">
                                    <n-icon>
                                        <Remove />
                                    </n-icon>
                                </n-button>
                                <n-button @click="addKeyword"
                                    v-if="index === blogSetting.nav_bar.website_information.keywords.length - 1"
                                    :round="index !== 0">
                                    <n-icon>
                                        <Add />
                                    </n-icon>
                                </n-button>
                            </n-button-group>
                        </n-space>

                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
        <n-tab-pane tab="底部拓展" name="bottom">
            <n-card title="底部信息">
                <n-form>
                    <n-form-item label="html代码">
                        <n-input placeholder="html代码" type="textarea" v-model:value="blogSetting.bottom_extra.html" />
                    </n-form-item>
                    <n-form-item label="css代码">
                        <n-input placeholder="css代码" type="textarea" v-model:value="blogSetting.bottom_extra.css" />
                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
    NTabs,
    NTabPane,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NButtonGroup,
    NButton,
    NSpace,
    NIcon
} from 'naive-ui';
import { Add, Remove } from '@vicons/ionicons5';
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
onMounted(async () => {
    await settingStore.fetchSetting();
    Object.assign(blogSetting, settingStore.setting);
});

const updateSetting = async () => {
    blogSetting.nav_bar.website_information.keywords = blogSetting.nav_bar.website_information.keywords.filter(item => item != '')
    await settingStore.updateSetting(blogSetting);
};

const addKeyword = () => {
    blogSetting.nav_bar.website_information.keywords.push('')
}
const removeKeyword = (index: number) => {
    blogSetting.nav_bar.website_information.keywords.splice(index, 0)
}

onBeforeUnmount(() => {
    updateSetting();
});
</script>

<style scoped></style>