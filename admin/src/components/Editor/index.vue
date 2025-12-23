<template>
    <MarkdownEditor v-model:content="content">
        <n-flex justify="end" style="margin-top: 16px;">
        <n-button @click="(e)=>{e.preventDefault();props.handleSubmit(content)}" type="primary" size="large">
            提交
        </n-button>
    </n-flex>
    </MarkdownEditor>
    

</template>

<script setup lang="ts">
import {  ref, watch } from 'vue';
import { NFlex, NButton } from 'naive-ui';
import MarkdownEditor from '@/components/Markdown/index.vue';

const props = defineProps<{
    initContent?: string,
    handleSubmit: (content: string) => void;
}>();
const content = ref<string>('');
watch(()=> props.initContent,(n)=>{
    content.value = n || ''
})
</script>

<style scoped></style>