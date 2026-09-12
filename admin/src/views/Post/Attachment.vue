<template>
    <div class="attachment-page">
        <n-card title="附件管理" :content-style="{ padding: '16px' }">
            <template #header-extra>
                <n-button type="primary" size="small" :loading="uploading" @click="openUpload">
                    <template #icon>
                        <n-icon><CloudUploadOutline /></n-icon>
                    </template>
                    上传附件
                </n-button>
                <input ref="fileInputRef" type="file" multiple hidden @change="onFilePicked" />
            </template>

            <n-alert type="info" :show-icon="true" style="margin-bottom: 12px">
                被引用的附件（说说等已使用）删除前会提示；引用中的附件无法删除，请先在相关内容中移除。
            </n-alert>

            <n-data-table
                :columns="columns"
                :data="attachments"
                :loading="loading"
                :bordered="false"
                :row-key="(row: AttachmentInfo) => row.id"
                :pagination="{ pageSize: 12 }"
                size="small"
            />
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import {
    NAlert, NButton, NCard, NDataTable, NIcon, NImage, NSpace, NTag, NText
} from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { CloudUploadOutline } from '@vicons/ionicons5';

import { getAttachmentList, uploadAttachment, deleteAttachment, type AttachmentInfo } from '@/api/attachment';

// 优先后端返回的 file_path，兼容旧数据的 url
const getAttachmentPath = (row: AttachmentInfo) => (row.file_path || row.url || '').trim();

// 附件静态资源挂在站点根路径 /upload/，不能拼上 API 前缀
const resolveAttachmentSrc = (row: AttachmentInfo) => {
    const p = getAttachmentPath(row);
    if (!p) return '';
    if (/^(https?:)?\/\//.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p;
    const apiBase = ((import.meta.env.VITE_APP_BASE_API as string | undefined) || '/api/v1').replace(/\/+$/, '');
    // 开发环境 VITE_APP_BASE_API 带 host；生产是相对路径，直接走同源 /upload/
    const origin = apiBase.startsWith('http') ? apiBase.replace(/\/api\/v1$/, '') : '';
    return `${origin}${p.startsWith('/') ? p : `/${p}`}`;
};

const loading = ref(false);
const uploading = ref(false);
const attachments = ref<AttachmentInfo[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

const formatBytes = (bytes: number) => {
    const b = Number.isFinite(bytes) ? bytes : 0;
    if (b <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const exp = Math.min(Math.floor(Math.log(b) / Math.log(base)), units.length - 1);
    const value = b / Math.pow(base, exp);
    return `${value.toFixed(value >= 10 || exp === 0 ? 0 : 1)} ${units[exp]}`;
};

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await getAttachmentList();
        if (res.code === 0) {
            attachments.value = res.data?.attachments ?? [];
        } else {
            window.$message.error(res.message || '获取附件列表失败');
        }
    } catch (e) {
        window.$message.error((e as string) || '获取附件列表出错');
    } finally {
        loading.value = false;
    }
};

const openUpload = () => fileInputRef.value?.click();

const onFilePicked = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ''; // 允许重复选择同一批文件
    if (files.length === 0) return;

    const formData = new FormData();
    for (const f of files) formData.append('file', f);

    uploading.value = true;
    try {
        const res = await uploadAttachment(formData);
        if (res.code === 0) {
            window.$message.success(`成功上传 ${res.data?.attachments?.length ?? files.length} 个附件`);
            fetchList();
        } else {
            window.$message.error(res.message || '上传失败');
        }
    } catch (err) {
        window.$message.error((err as string) || '上传出错');
    } finally {
        uploading.value = false;
    }
};

// 被引用的附件：删除前弹提醒；未引用的正常确认删除
const handleDelete = (row: AttachmentInfo) => {
    if (row.referenced) {
        window.$dialog.warning({
            title: '附件被引用，无法删除',
            content: `「${row.original_name}」已被内容引用。请先在引用它的说说等内容中移除该附件，再回来删除。`,
            positiveText: '知道了',
            onPositiveClick: () => undefined,
        });
        return;
    }
    window.$dialog.warning({
        title: '确认删除',
        content: `确定删除附件「${row.original_name}」吗？该操作不可恢复。`,
        positiveText: '删除',
        negativeText: '取消',
        onPositiveClick: async () => {
            try {
                const res = await deleteAttachment(row.id);
                if (res.code === 0) {
                    window.$message.success('删除成功');
                    fetchList();
                } else {
                    // 兜底：后端仍可能以 409 拒绝（如并发下刚被引用）
                    window.$message.error(res.message || '删除失败');
                    fetchList();
                }
            } catch (err) {
                window.$message.error((err as string) || '删除出错');
                fetchList();
            }
        },
    });
};

// 复制附件相对路径（部署后同源可直接访问）
const copyPath = async (row: AttachmentInfo) => {
    const path = getAttachmentPath(row);
    try {
        await navigator.clipboard.writeText(path);
        window.$message.success('路径已复制');
    } catch {
        window.$message.info(path);
    }
};

const copyLink = async (row: AttachmentInfo) => {
    const path = getAttachmentPath(row);
    const url = path.startsWith('http') ? path : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    try {
        await navigator.clipboard.writeText(url);
        window.$message.success('链接已复制');
    } catch {
        window.$message.info(url);
    }
};

const columns = computed<DataTableColumns<AttachmentInfo>>(() => [
    {
        title: '预览',
        key: 'preview',
        width: 90,
        render: (row) => {
            const isImage = (row.mime || '').startsWith('image/');
            const src = resolveAttachmentSrc(row);
            return isImage
                ? h(NImage, { src, width: 48, height: 48, objectFit: 'cover', style: 'border-radius:4px' })
                : h('div', { style: 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border-radius:4px;font-size:11px;color:#999' }, '附件');
        },
    },
    {
        title: '文件名',
        key: 'original_name',
        ellipsis: { tooltip: true },
        render: (row) => h(NText, { depth: 1 }, { default: () => row.original_name }),
    },
    {
        title: '路径',
        key: 'file_path',
        ellipsis: { tooltip: true },
        render: (row) => h(NText, { depth: 3, style: 'font-size:12px' }, { default: () => row.file_path || row.url || '-' }),
    },
    {
        title: '类型',
        key: 'mime',
        width: 140,
        render: (row) => h(NTag, { size: 'small', type: 'default' }, { default: () => row.mime || 'unknown' }),
    },
    {
        title: '大小',
        key: 'size',
        width: 100,
        render: (row) => formatBytes(row.size),
    },
    {
        title: '引用状态',
        key: 'referenced',
        width: 100,
        render: (row) =>
            row.referenced
                ? h(NTag, { size: 'small', type: 'warning' }, { default: () => '被引用' })
                : h(NTag, { size: 'small', type: 'success' }, { default: () => '未引用' }),
    },
    {
        title: '操作',
        key: 'actions',
        width: 220,
        render: (row) =>
            h(NSpace, { size: 4 }, {
                default: () => [
                    h(NButton, { size: 'tiny', quaternary: true, onClick: () => copyPath(row) }, { default: () => '复制路径' }),
                    h(NButton, { size: 'tiny', quaternary: true, onClick: () => copyLink(row) }, { default: () => '复制链接' }),
                    h(NButton, { size: 'tiny', type: 'error', quaternary: true, onClick: () => handleDelete(row) }, { default: () => '删除' }),
                ],
            }),
    },
]);

onMounted(() => {
    fetchList();
});
</script>

<style scoped>
.attachment-page {
    width: 100%;
}
</style>
