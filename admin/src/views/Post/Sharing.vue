<template>
    <n-tabs animated type="line" size="large" default-value="list" v-model:value="tabKey">
        <n-tab-pane tab="说说列表" name="list" display-directive="show">
            <SharingTable :sharings="sharingsData || []" @select="handleSelect" @deselect="handleDeselect" @action="handleMenuAction" />
        </n-tab-pane>
        <n-tab-pane tab="创建说说" name="modify" display-directive="if">
            <SharingForm />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui';

import SharingTable from '@/components/List/SharingTable/index.vue'
import type { SharingInfo } from '@/types';
import { getSharingList, deleteSharing, updateSharingStatus } from '@/api/sharing';
import SharingForm from '@/components/Form/Sharing.vue'

const tabKey = ref<string>('list')
const sharingsData = ref<SharingInfo[] | null>(null)
const openPreview = () => {}

// 当前选中的说说 ID（右键菜单操作的目标）
const modifyID = ref<string | undefined>(undefined)
const handleSelect = (id: string) => { modifyID.value = id }
const handleDeselect = () => { modifyID.value = undefined }

const handleMenuAction = (key: string) => {
    switch (key) {
        case 'publishSharing':
            setSharingStatus('publish')
            break
        case 'privateSharing':
            setSharingStatus('draft')
            break
        case 'previewSharing':
            openPreview()
            break
        case 'deleteSharing':
            deleteSharingByID()
            break
    }
}

const fetchSharingList = async () => {
    try {
        const res = await getSharingList();
        if (res.code === 0 && res.data) {
            sharingsData.value = res.data.sharings ?? null;
        } else {
            window.$message.error(res.message || '获取说说列表失败');
        }
    } catch (error) {
        window.$message.error('获取说说列表出错');
    }
}

const deleteSharingByID = async () => {
    if (!modifyID.value) {
        window.$message.warning('请先选择一条说说')
        return
    }
    try {
        const res = await deleteSharing(modifyID.value)
        if (res.code === 0) {
            window.$message.success('删除说说成功')
        } else {
            window.$message.error(res.message || '删除说说失败')
        }
        fetchSharingList()
    } catch (error) {
        window.$message.error('删除说说出错');
    }
}

const setSharingStatus = async (status: 'draft' | 'publish') => {
    if (!modifyID.value) {
        window.$message.warning('请先选择一条说说')
        return
    }
    try {
        const res = await updateSharingStatus({
            post_type: 'sharing',
            post_id: modifyID.value,
            status,
        })
        if (res.code === 0) {
            window.$message.success('更新状态成功')
            fetchSharingList()
        } else {
            window.$message.error(res.message || '更新状态失败')
        }
    } catch (error) {
        window.$message.error('更新状态出错')
    }
}

onMounted(() => {
    fetchSharingList();
})
</script>
