<template>
    <n-card title="分类管理" size="large" embedded>
        <template #header-extra>
            <n-space align="center" size="small">
                <n-text depth="3" style="font-size: 12px">拖拽节点可调整父子关系，也可用「移动」</n-text>
                <n-button size="small" round @click="handleAddRoot">
                    <template #icon>
                        <n-icon>
                            <Add />
                        </n-icon>
                    </template>
                </n-button>
            </n-space>
        </template>

        <n-spin :show="loading">
            <n-alert v-if="treeOptions.length === 0 && !loading" type="info" :show-icon="true" style="margin-bottom: 12px">
                暂无分类，点击右上角 + 新建根分类。
            </n-alert>
            <div class="category-tree-wrap">
                <n-tree
                    block-line
                    draggable
                    :data="treeOptions"
                    key-field="key"
                    label-field="label"
                    children-field="children"
                    expand-on-click
                    :allow-drop="allowDrop"
                    @drop="handleDrop"
                    @dragstart="handleDragStart"
                    :render-prefix="renderPrefix"
                    :render-suffix="renderSuffix"
                />
            </div>
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
                <n-form-item v-if="modalMode === 'edit' || modalMode === 'move'" label="上级分类" path="parent">
                    <n-tree-select
                        v-model:value="formModel.parent"
                        :options="parentSelectOptions as any"
                        key-field="key"
                        label-field="label"
                        children-field="children"
                        clearable
                        placeholder="不选则为根分类"
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
import { computed, h, ref, onMounted, reactive } from 'vue';
import {
    NAlert, NButton, NCard, NIcon, NTree, NTreeSelect, NSpin, NModal, NForm, NFormItem, NInput, NSpace, NText,
    useMessage, useDialog
} from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { Add, Pencil, Trash, MoveOutline } from '@vicons/ionicons5';
import { getAllCategoryGroup, createCategory, updateCategory, deleteCategory } from '@/api/category';
import type { CategoryGroup, CategoryRequest } from '@/types';

type CatNode = {
    key: string;
    label: string;
    id: string;
    parent?: string;
    isLeaf?: boolean;
    children?: CatNode[];
};

const loading = ref(false);
const rawCategories = ref<CategoryGroup[]>([]);
const showModal = ref(false);
const submitting = ref(false);
const modalTitle = ref('');
const modalMode = ref<'create' | 'edit' | 'createSub' | 'move'>('create');
const currentParentId = ref<string | undefined>(undefined);
const currentEditId = ref<string | undefined>(undefined);

const formModel = reactive({
    label: '',
    parent: null as string | null,
});

const rules = {
    label: {
        required: true,
        message: '请输入分类名称',
        trigger: ['input', 'blur']
    }
};

const formRef = ref();
const message = useMessage();
const dialog = useDialog();

/** 转成 n-tree 需要的结构：空 children 视为叶子，避免误显示展开箭头并干扰拖放判定 */
const toTreeNodes = (nodes: CategoryGroup[], parent = ''): CatNode[] => {
    return (nodes || []).map(n => {
        const kids = n.children || [];
        const node: CatNode = {
            key: n.id,
            label: n.label,
            id: n.id,
            parent: n.parent || parent,
            children: undefined,
            isLeaf: kids.length === 0,
        };
        if (kids.length > 0) {
            node.children = toTreeNodes(kids, n.id);
            node.isLeaf = false;
        }
        return node;
    });
};

const treeOptions = computed<CatNode[]>(() => toTreeNodes(rawCategories.value));

const fetchCategories = async () => {
    loading.value = true;
    try {
        const res = await getAllCategoryGroup();
        if (res.code === 0) {
            rawCategories.value = res.data ?? [];
        } else {
            message.error(res.message || '获取分类失败');
        }
    } catch {
        message.error('获取分类失败');
    } finally {
        loading.value = false;
    }
};

const excludeIdsForEdit = computed(() => {
    if (!currentEditId.value) return new Set<string>();
    const exclude = new Set<string>([currentEditId.value]);
    const walk = (nodes: CategoryGroup[]) => {
        for (const n of nodes) {
            if (exclude.has(n.id)) {
                for (const c of n.children || []) {
                    exclude.add(c.id);
                }
                walk(n.children || []);
            }
        }
    };
    walk(rawCategories.value);
    return exclude;
});

const parentSelectOptions = computed<CatNode[]>(() => {
    const mapNodes = (nodes: CategoryGroup[], parent = ''): CatNode[] =>
        toTreeNodes(nodes, parent)
            .filter(n => !excludeIdsForEdit.value.has(n.key))
            .map(n => ({
                ...n,
                children: n.children ? mapChildren(n.children) : undefined,
            }));
    const mapChildren = (nodes: CatNode[]): CatNode[] =>
        nodes
            .filter(n => !excludeIdsForEdit.value.has(n.key))
            .map(n => ({
                ...n,
                children: n.children ? mapChildren(n.children) : undefined,
            }));
    return mapNodes(rawCategories.value);
});

const findParentId = (nodes: CategoryGroup[], id: string, parentId = ''): string => {
    for (const n of nodes) {
        if (n.id === id) return parentId;
        const found = findParentId(n.children || [], id, n.id);
        if (found) return found;
    }
    return '';
};

const isDescendant = (nodes: CategoryGroup[], ancestorId: string, targetId: string): boolean => {
    const findNode = (list: CategoryGroup[]): CategoryGroup | null => {
        for (const n of list) {
            if (n.id === ancestorId) return n;
            const hit = findNode(n.children || []);
            if (hit) return hit;
        }
        return null;
    };
    const node = findNode(nodes);
    if (!node) return false;
    const walk = (list: CategoryGroup[]): boolean => {
        for (const n of list) {
            if (n.id === targetId) return true;
            if (walk(n.children || [])) return true;
        }
        return false;
    };
    return walk(node.children || []);
};

type DropInfo = {
    node: TreeOption;
    dragNode: TreeOption;
    dropPosition: 'before' | 'after' | 'inside';
    event?: DragEvent;
};

type DragStartInfo = {
    node: TreeOption;
    event: DragEvent;
};

// 显式放行，避免 defaultAllowDrop 对 isLeaf/children 判定过严
const allowDrop = ({ node, dropPosition }: { node: TreeOption; dropPosition: string }) => {
    if (dropPosition === 'inside' && node.isLeaf === true) {
        // 叶子也能收：拖进去就变成父节点
        return true;
    }
    return true;
};

const handleDragStart = ({ event, node }: DragStartInfo) => {
    try {
        event.dataTransfer?.setData('text/plain', String(node.key));
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    } catch {
        // ignore
    }
};

const handleDrop = async ({ node, dragNode, dropPosition }: DropInfo) => {
    const targetId = String(node.key);
    const dragId = String(dragNode.key);
    const dragLabel = String((dragNode as unknown as CatNode).label ?? '');
    if (!dragId || dragId === targetId) return;

    if (isDescendant(rawCategories.value, dragId, targetId)) {
        message.warning('不能把分类挂到自己的子分类下');
        return;
    }

    let newParent: string;
    if (dropPosition === 'inside') {
        newParent = targetId;
    } else {
        newParent = findParentId(rawCategories.value, targetId);
    }

    const currentParent = findParentId(rawCategories.value, dragId);
    if (newParent === currentParent) return;

    await applyMove(dragId, dragLabel, newParent);
};

const applyMove = async (id: string, label: string, newParent: string) => {
    loading.value = true;
    try {
        const res = await updateCategory(id, {
            label,
            parent: newParent,
        });
        if (res.code === 0) {
            message.success(newParent ? '已移动到该分类下' : '已设为根分类');
        } else {
            message.error(res.message || '调整层级失败');
        }
        await fetchCategories();
    } catch {
        message.error('调整层级失败');
        await fetchCategories();
    } finally {
        loading.value = false;
    }
};

const handleAddRoot = () => {
    modalMode.value = 'create';
    modalTitle.value = '新建根分类';
    formModel.label = '';
    formModel.parent = null;
    currentParentId.value = undefined;
    currentEditId.value = undefined;
    showModal.value = true;
};

const handleAddSub = (node: CategoryGroup) => {
    modalMode.value = 'createSub';
    modalTitle.value = `新建 "${node.label}" 的子分类`;
    formModel.label = '';
    formModel.parent = node.id;
    currentParentId.value = node.id;
    currentEditId.value = undefined;
    showModal.value = true;
};

const handleEdit = (node: CategoryGroup) => {
    modalMode.value = 'edit';
    modalTitle.value = '编辑分类';
    formModel.label = node.label;
    formModel.parent = node.parent || null;
    currentEditId.value = node.id;
    currentParentId.value = node.parent || undefined;
    showModal.value = true;
};

/** 不依赖拖拽：直接选上级 */
const handleMove = (node: CategoryGroup) => {
    modalMode.value = 'move';
    modalTitle.value = `移动 "${node.label}"`;
    formModel.label = node.label;
    formModel.parent = node.parent || null;
    currentEditId.value = node.id;
    currentParentId.value = node.parent || undefined;
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
            } catch {
                message.error('删除失败');
            }
        }
    });
};

const handleSubmit = async () => {
    formRef.value?.validate(async (errors: any) => {
        if (errors) return;
        submitting.value = true;
        try {
            let res;
            if (modalMode.value === 'create' || modalMode.value === 'createSub') {
                const payload: CategoryRequest = {
                    label: formModel.label.trim(),
                };
                if (currentParentId.value) payload.parent = currentParentId.value;
                res = await createCategory(payload);
            } else if (modalMode.value === 'move') {
                if (!currentEditId.value) return;
                res = await updateCategory(currentEditId.value, {
                    label: formModel.label.trim(),
                    parent: formModel.parent || '',
                });
            } else {
                if (!currentEditId.value) return;
                res = await updateCategory(currentEditId.value, {
                    label: formModel.label.trim(),
                    parent: formModel.parent || '',
                });
            }

            if (res.code === 0) {
                message.success(modalMode.value === 'create' || modalMode.value === 'createSub' ? '创建成功' : '已更新');
                showModal.value = false;
                fetchCategories();
            } else {
                message.error(res.message || '操作失败');
            }
        } catch {
            message.error('操作失败');
        } finally {
            submitting.value = false;
        }
    });
};

const renderPrefix = () => {
    return h(NIcon, { style: 'margin-right: 4px; opacity: 0.35; cursor: grab' }, {
        default: () => h(MoveOutline),
    });
};

const renderSuffix = ({ option }: { option: TreeOption }) => {
    const node = option as unknown as CategoryGroup;
    return h(NSpace, { align: 'center', size: 'small' }, {
        default: () => [
            h(NButton, {
                text: true,
                type: 'primary',
                size: 'tiny',
                title: '添加子分类',
                onClick: (e) => {
                    e.stopPropagation();
                    handleAddSub(node);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Add) }) }),
            h(NButton, {
                text: true,
                type: 'warning',
                size: 'tiny',
                title: '移动',
                onClick: (e) => {
                    e.stopPropagation();
                    handleMove(node);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(MoveOutline) }) }),
            h(NButton, {
                text: true,
                type: 'info',
                size: 'tiny',
                title: '编辑',
                onClick: (e) => {
                    e.stopPropagation();
                    handleEdit(node);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Pencil) }) }),
            h(NButton, {
                text: true,
                type: 'error',
                size: 'tiny',
                title: '删除',
                onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(node);
                }
            }, { icon: () => h(NIcon, null, { default: () => h(Trash) }) })
        ]
    });
};

onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.category-tree-wrap :deep(.n-tree-node) {
    cursor: grab;
    user-select: none;
}
.category-tree-wrap :deep(.n-tree-node:active) {
    cursor: grabbing;
}
</style>
