<template>
    <n-tabs animated type="line" size="large" default-value="list" v-model:value="tabKey">
        <n-tab-pane tab="说说列表" name="list" display-directive="show">
            <SharingTable :sharings="sharingsData"/>
        </n-tab-pane>
        <n-tab-pane tab="创建说说" name="modify" display-directive="if">
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui';
import SharingTable from '@/components/List/SharingTable/index.vue'
import type { SharingInfo } from '@/types';

const tabKey = ref<string>('list')
const sharingsData = ref<SharingInfo[]>([])
</script>

<style scoped></style>