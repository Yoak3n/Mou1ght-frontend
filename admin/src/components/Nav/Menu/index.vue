<template>
    <n-menu  :options="menuOptions" :value="path" key-field="path"  @update-value="routerPush"/>
</template>

<script setup lang="ts">
import { NMenu } from 'naive-ui';
import menuOptions from './option';

const { path} = defineProps<{
    path: string,
    routerPush?: (path: string) => void
}>();

</script>
