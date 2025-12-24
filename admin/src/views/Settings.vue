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
                        <div v-for="(_, index) in blogSetting.nav_bar.website_information.keywords" :style="{display:'flex'}">
                            <n-input placeholder="请输入网站关键词..." v-model:value="blogSetting.nav_bar.website_information.keywords[index]" />
                            <n-button-group>
                                <n-button @click="removeKeyword(index)" v-if="blogSetting.nav_bar.website_information.keywords.length !== 0">
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
                        </div>

                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
        <n-tab-pane tab="底部拓展" name="bottom">
            <n-card title="底部信息">
                <n-form>
                    <n-form-item label="html代码">
                        <n-input placeholder="html代码" type="textarea" :resizable="false" v-model:value="blogSetting.bottom_extra.html" />
                    </n-form-item>
                    <n-form-item label="css代码">
                        <n-input placeholder="css代码" type="textarea" :resizable="false" v-model:value="blogSetting.bottom_extra.css" />
                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
        <n-tab-pane tab="留言板" name="board">
            <n-card title="留言版设置">
                <n-form>
                    <n-form-item label="留言板问题">
                        <n-input placeholder="请输入添加留言需要回答的问题"  v-model:value="blogSetting.bottom_extra.html" />
                    </n-form-item>
                    <n-form-item label="留言板答案">
                        <n-input placeholder="请输入留言板答案" v-model:value="blogSetting.bottom_extra.css" />
                    </n-form-item>
                    <n-form-item label="是否人工审核">
                        <n-switch v-model:value="blogSetting.board.need_reviewed"/>
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
    NIcon,
    NSwitch
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
    },
    board: {
        question: "",
        answer: "",
        need_reviewed: false
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
    blogSetting.nav_bar.website_information.keywords.splice(index, 1)
}

onBeforeUnmount(() => {
    updateSetting();
});
</script>

<style scoped></style>