<template>
    <n-card title="标签管理" size="large" embedded>
        <template #header-extra>
            <n-button size="small" round @click="handleAdd">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
            </n-button>
        </template>

        <n-spin :show="loading">
            <n-empty v-if="!loading && tags.length === 0" description="暂无标签" />
            <n-flex v-else>
                <n-tag
                    v-for="tag in tags"
                    :key="tag.id"
                    closable
                    @close="handleDelete(tag)"
                    size="large"
                >
                    {{ tag.label }}
                </n-tag>
            </n-flex>
        </n-spin>

        <n-modal v-model:show="showModal" preset="dialog" title="新建标签">
            <n-form
                ref="formRef"
                :model="formModel"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
            >
                <n-form-item label="标签名称" path="label">
                    <n-input 
                        v-model:value="formModel.label" 
                        placeholder="请输入标签名称" 
                        @keydown.enter.prevent="handleSubmit"
                    />
                </n-form-item>
            </n-form>
            <template #action>
                <n-space>
                    <n-button @click="showModal = false">取消</n-button>
                    <n-button type="primary" :loading="submitting" @click="handleSubmit">
                        确定
                    </n-button>
                </n-space>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { 
    NCard, NButton, NIcon, NTag, NSpin, NFlex, NEmpty, 
    NModal, NForm, NFormItem, NInput, NSpace,
    useMessage, useDialog
} from 'naive-ui';
import { Add } from '@vicons/ionicons5';
import { getAllTags, createTag, deleteTag } from '@/api/tag';
import type { Sign } from '@/types';

// State
const loading = ref(false);
const tags = ref<Sign[]>([]);
const showModal = ref(false);
const submitting = ref(false);

const formModel = reactive({
    label: ''
});

const rules = {
    label: {
        required: true,
        message: '请输入标签名称',
        trigger: ['input', 'blur']
    }
};

const formRef = ref();

// Hooks
const message = useMessage();
const dialog = useDialog();

// Fetch Data
const fetchTags = async () => {
    loading.value = true;
    try {
        const res = await getAllTags();
        if (res.code === 0) {
            tags.value = res.data;
        } else {
            message.error(res.message || '获取标签失败');
        }
    } catch (error) {
        message.error('获取标签失败');
    } finally {
        loading.value = false;
    }
};

// Actions
const handleAdd = () => {
    formModel.label = '';
    showModal.value = true;
};

const handleDelete = (tag: Sign) => {
    dialog.warning({
        title: '警告',
        content: `确定要删除标签 "${tag.label}" 吗？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            try {
                const res = await deleteTag(tag.id);
                if (res.code === 0) {
                    message.success('删除成功');
                    fetchTags();
                } else {
                    message.error(res.message || '删除失败');
                }
            } catch (error) {
                message.error('删除失败');
            }
        }
    });
};

const handleSubmit = async () => {
    formRef.value?.validate(async (errors: any) => {
        if (!errors) {
            submitting.value = true;
            try {
                const res = await createTag({
                    label: formModel.label
                });

                if (res.code === 0) {
                    message.success('创建成功');
                    showModal.value = false;
                    fetchTags();
                } else {
                    message.error(res.message || '创建失败');
                }
            } catch (error) {
                message.error('创建失败');
            } finally {
                submitting.value = false;
            }
        }
    });
};

onMounted(() => {
    fetchTags();
});
</script>
