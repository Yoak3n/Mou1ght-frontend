<template>
    <div class="settings-page">
        <div class="settings-header">
            <n-button type="primary" :loading="saving" @click="saveSetting">
                保存设置
            </n-button>
        </div>
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
                        <div class="icon-field">
                            <n-input placeholder="支持 /upload/xxx 或完整 URL，留空使用默认 favicon"
                                v-model:value="blogSetting.nav_bar.website_information.icon" />
                            <img v-if="iconPreview && !iconPreviewFailed" :src="iconPreview" class="icon-preview"
                                alt="图标预览" @error="iconPreviewFailed = true" />
                        </div>
                    </n-form-item>
                    <n-form-item label="网站Logo">
                        <div class="icon-field">
                            <n-input placeholder="支持 /upload/xxx 或完整 URL，留空显示站点名称"
                                v-model:value="blogSetting.nav_bar.website_information.logo" />
                            <img v-if="logoPreview && !logoPreviewFailed" :src="logoPreview" class="logo-preview"
                                alt="Logo 预览" @error="logoPreviewFailed = true" />
                        </div>
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
                        <n-input placeholder="请输入添加留言需要回答的问题"  v-model:value="blogSetting.board.question" />
                    </n-form-item>
                    <n-form-item label="留言板答案">
                        <n-input placeholder="请输入留言板答案" v-model:value="blogSetting.board.answer" />
                    </n-form-item>
                    <n-form-item label="是否人工审核">
                        <n-switch v-model:value="blogSetting.board.need_reviewed"/>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
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

// 图标 / Logo 预览：相对路径补前导 /，加载失败则隐藏
function toPreviewUrl(value: string): string {
    const v = (value || '').trim();
    if (!v) return '';
    if (/^(https?:)?\/\//.test(v) || v.startsWith('/') || v.startsWith('data:')) return v;
    return `/${v}`;
}
const iconPreview = computed(() => toPreviewUrl(blogSetting.nav_bar.website_information.icon));
const logoPreview = computed(() => toPreviewUrl(blogSetting.nav_bar.website_information.logo));
const iconPreviewFailed = ref(false);
const logoPreviewFailed = ref(false);
watch(iconPreview, () => { iconPreviewFailed.value = false; });
watch(logoPreview, () => { logoPreviewFailed.value = false; });

const activeTab = ref('navigation');
const saving = ref(false);
onMounted(async () => {
    await settingStore.fetchSetting();
    Object.assign(blogSetting, settingStore.setting);
});

const updateSetting = async () => {
    blogSetting.nav_bar.website_information.keywords = blogSetting.nav_bar.website_information.keywords.filter(item => item != '')
    await settingStore.updateSetting(blogSetting);
};

const saveSetting = async () => {
    saving.value = true;
    try {
        await updateSetting();
        window.$message.success('设置已保存');
    } catch {
        window.$message.error('保存失败');
    } finally {
        saving.value = false;
    }
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

<style scoped>
.settings-page {
    width: 100%;
}
.settings-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}
.icon-field {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}
.icon-preview {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 4px;
    flex-shrink: 0;
}
.logo-preview {
    height: 32px;
    max-width: 140px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 4px;
    flex-shrink: 0;
}
</style>
