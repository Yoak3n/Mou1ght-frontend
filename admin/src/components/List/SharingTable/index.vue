<template>
    <n-data-table :data="data" :columns="columns"/>
</template>

<script setup lang="ts">
import { NDataTable, } from 'naive-ui';
import type { SharingInfo } from '@/types';
import { createData,createColumns } from '.';
import { computed } from 'vue';

const {sharings} = defineProps<{
    sharings: SharingInfo[]
}>()
const data = computed(() => createData(sharings))
const columns = createColumns({
    action(e, data) {
    }
})
</script>
