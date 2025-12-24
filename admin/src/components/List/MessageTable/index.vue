<template>
    <n-data-table :data="data" :columns="columns"/>
    <ContextMenu  :x="mouseAction.x" :y="mouseAction.y" :show="mouseAction.show" :close="closeContextMenu"/>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { NDataTable, } from 'naive-ui';

import { createData,createColumns } from '.';
import type { MessageInfo } from '@/types';
import ContextMenu from './ContextMenu.vue';

const {messages, actionHandler} = defineProps<{
    messages: MessageInfo[],
    actionHandler: (id?: string)=> void
}>()
const mouseAction = reactive<{x: number,y :number, show: boolean}>({x:0,y:0, show: false})
const data = computed(() => createData(messages))
const columns = createColumns({
    action(e, data) {
        e.preventDefault();
        actionHandler(data.id)
        mouseAction.x = e.clientX
        mouseAction.y = e.clientY
        mouseAction.show  = true
    }
})

const closeContextMenu = (cache: boolean) => {
    mouseAction.show = false 
    if (!cache) {
        actionHandler()
    }
}

</script>

<style scoped>
</style>