<template>
    <n-data-table :data="data" :columns="columns" />
    <ContextMenu :x="mouseAction.x" :y="mouseAction.y" :show="mouseAction.show"
        :options="contextMenuOptions" @select="handleMenuSelect" @close="handleMenuClose" />
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { NDataTable } from 'naive-ui';
import type { MessageInfo } from '@/types';
import { createData, createColumns, contextMenuOptions } from '.';
import ContextMenu from '../ContextMenu.vue';

const props = defineProps<{
    messages: MessageInfo[];
}>();

const emit = defineEmits<{
    select: [id: string];
    deselect: [];
    action: [key: string];
}>();

const mouseAction = reactive<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
const data = computed(() => createData(props.messages));

const columns = createColumns({
    action(e, row) {
        e.preventDefault();
        emit('select', row.id);
        mouseAction.x = e.clientX;
        mouseAction.y = e.clientY;
        mouseAction.show = true;
    },
});

const handleMenuSelect = (key: string) => {
    mouseAction.show = false;
    emit('action', key);
};
const handleMenuClose = () => {
    mouseAction.show = false;
    emit('deselect');
};
</script>

<style scoped></style>
