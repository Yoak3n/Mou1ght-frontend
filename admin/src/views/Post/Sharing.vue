<template>
    <n-tabs animated type="line" size="large" default-value="list" v-model:value="tabKey">
        <n-tab-pane tab="说说列表" name="list" display-directive="show">
            <SharingTable :sharings="sharingsData" :action-handler="actionHandler" />
        </n-tab-pane>
        <n-tab-pane tab="创建说说" name="modify" display-directive="if">
            <SharingForm />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui';

import $emitter from '@/bus'
import SharingTable from '@/components/List/SharingTable/index.vue'
import type { SharingInfo } from '@/types';
import { getSharingList, deleteSharing } from '@/api/sharing';
import SharingForm from '@/components/Form/Sharing.vue'

const tabKey = ref<string>('list')
const sharingsData = ref<SharingInfo[]>([])
// const openModify = () => tabKey.value = 'modify'
const openPreview = () => {}

// 蠢蠢的，暂时用这个变量存储要修改的ID
const modifyID = ref<string | undefined>(undefined)
const actionHandler = (id?: string) => modifyID.value = id
const fetchSharingList = async () => {
    try {
        const res = await getSharingList();
        if (res.code === 0 && res.data) {
            sharingsData.value = res.data["sharings"] as SharingInfo[];
        } else {
            window.$message.error(res.message || '获取说说列表失败');
        }
    } catch (error) {
        window.$message.error('获取说说列表出错');
    }
}
const deleteSharingByID = async () => {
    try {
        const res = await deleteSharing(modifyID.value??'')
        if (res.code === 0) {
            window.$message.success('删除说说成功')
            fetchSharingList();
        } else {
            window.$message.error(res.message || '删除说说失败')
        }
        fetchSharingList()
    } catch (error) {
        window.$message.error('删除说说出错');
    }
}

onMounted(async () => {
    // $emitter.on("sharing:updateAction", openModify)
    $emitter.on('sharing:previewAction', openPreview)
    // $emitter.on('sharing:listRefresh', fetchSharingList)
    $emitter.on('sharing:deleteAction', deleteSharingByID)
    fetchSharingList();
})

onBeforeUnmount(() => {
    // $emitter.off("sharing:updateAction", openModify)
    $emitter.off('sharing:previewAction', openPreview)
    // $emitter.off('sharing:listRefresh', fetchSharingList)
    $emitter.off('sharing:deleteAction', fetchSharingList)
})
</script>
