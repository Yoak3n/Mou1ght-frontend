<template>
    <n-data-table :data="data" :columns="columns" />
    <ContextMenu  :x="mouseAction.x" :y="mouseAction.y" :show="mouseAction.show" :close="closeContextMenu"/>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { NDataTable } from 'naive-ui';
import type { ArticleInfo} from '@/types';
import {createData, createColumns } from '.'
import ContextMenu from './ContextMenu.vue';

const { articles,actionHandler } = defineProps<{
    articles: ArticleInfo[],
    actionHandler: (id?: string)=> void
}>()
const mouseAction = reactive<{x: number,y :number, show: boolean}>({x:0,y:0, show: false})
const data = computed(() => createData(articles))
const closeContextMenu = (cache: boolean) => {
    mouseAction.show = false 
    if (!cache) {
        actionHandler()
    }
}

const columns = createColumns({
    action(e, data) {
        actionHandler(data.id)
        mouseAction.x = e.clientX
        mouseAction.y = e.clientY
        mouseAction.show  = true
    }
})
</script>

<style scoped></style>