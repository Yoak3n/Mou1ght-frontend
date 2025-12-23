<template>
    <n-card title="分类管理" size="large" embedded>
        <template #header-extra>
            <n-button size="small"  round @click="handleAddRoot">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
            </n-button>
        </template>
        
        <n-spin :show="loading">
            <n-tree
                block-line
                :data="categoryData"
                key-field="id"
                label-field="label"
                children-field="children"
                expand-on-click
                :render-suffix="renderSuffix"
            />
        </n-spin>

        <n-modal v-model:show="showModal" preset="dialog" :title="modalTitle">
            <n-form
                ref="formRef"
                :model="formModel"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
            >
                <n-form-item label="分类名称" path="label">
                    <n-input v-model:value="formModel.label" placeholder="请输入分类名称" />
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
import { h, ref, onMounted, reactive } from 'vue';
import { 
    NCard, NButton, NIcon, NTree, NSpin, NModal, NForm, NFormItem, NInput, NSpace,
    useMessage, useDialog
} from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { Add, Pencil, Trash } from '@vicons/ionicons5';
import { getAllCategoryGroup, createCategory, updateCategory, deleteCategory } from '@/api/category';
import type { CategoryGroup } from '@/types';

// State
const loading = ref(false);
const categoryData = ref<CategoryGroup[]>([]);
const showModal = ref(false);
const submitting = ref(false);
const modalTitle = ref('');
const modalMode = ref<'create' | 'edit' | 'createSub'>('create');
const currentParentId = ref<string | undefined>(undefined);
const currentEditId = ref<string | undefined>(undefined);

const formModel = reactive({
    label: ''
});

const rules = {
    label: {
        required: true,
        message: '请输入分类名称',
        trigger: ['input', 'blur']
    }
};

const formRef = ref();

// Hooks
const message = useMessage();
const dialog = useDialog();

// Fetch Data
const fetchCategories = async () => {
    loading.value = true;
    try {
        const res = await getAllCategoryGroup();
        if (res.code === 0) {
            categoryData.value = res.data;
        } else {
            message.error(res.message || '获取分类失败');
        }
    } catch (error) {
        message.error('获取分类失败');
    } finally {
        loading.value = false;
    }
};

// Actions
const handleAddRoot = () => {
    modalMode.value = 'create';
    modalTitle.value = '新建根分类';
    formModel.label = '';
    currentParentId.value = undefined;
    showModal.value = true;
};

const handleAddSub = (node: CategoryGroup) => {
    modalMode.value = 'createSub';
    modalTitle.value = `新建 "${node.label}" 的子分类`;
    formModel.label = '';
    currentParentId.value = node.id;
    showModal.value = true;
};

const handleEdit = (node: CategoryGroup) => {
    modalMode.value = 'edit';
    modalTitle.value = '编辑分类';
    formModel.label = node.label;
    currentEditId.value = node.id;
    currentParentId.value = undefined; // Not needed for edit
    showModal.value = true;
};

const handleDelete = (node: CategoryGroup) => {
    dialog.warning({
        title: '警告',
        content: `确定要删除分类 "${node.label}" 吗？如果该分类下有子分类也会被删除。`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            try {
                const res = await deleteCategory(node.id);
                if (res.code === 0) {
                    message.success('删除成功');
                    fetchCategories();
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
                let res;
                if (modalMode.value === 'create' || modalMode.value === 'createSub') {
                    res = await createCategory({
                        label: formModel.label,
                        parent: currentParentId.value
                    });
                } else {
                    // Edit
                    if (!currentEditId.value) return;
                    res = await updateCategory(currentEditId.value, {
                        label: formModel.label
                    });
                }

                if (res.code === 0) {
                    message.success(modalMode.value === 'edit' ? '更新成功' : '创建成功');
                    showModal.value = false;
                    fetchCategories();
                } else {
                    message.error(res.message || '操作失败');
                }
            } catch (error) {
                message.error('操作失败');
            } finally {
                submitting.value = false;
            }
        }
    });
};

// Tree Render Suffix
const renderSuffix = ({ option }: { option: TreeOption }) => {
    return h(NSpace, { align: 'center', size: 'small' }, {
        default: () => [
            h(NButton, {
                text: true,
                type: 'primary',
                size: 'tiny',
                onClick: (e) => {
                    e.stopPropagation();
                    handleAddSub(option as unknown as CategoryGroup);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Add) }) }),
            h(NButton, {
                text: true,
                type: 'info',
                size: 'tiny',
                onClick: (e) => {
                    e.stopPropagation();
                    handleEdit(option as unknown as CategoryGroup);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Pencil) }) }),
            h(NButton, {
                text: true,
                type: 'error',
                size: 'tiny',
                onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(option as unknown as CategoryGroup);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Trash) }) })
        ]
    });
};

onMounted(() => {
    fetchCategories();
});
</script>
