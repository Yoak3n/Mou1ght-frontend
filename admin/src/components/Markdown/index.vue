<template>
    <div id="markdown-container">
        <div ref="editorRef"></div>
    </div>
    <n-button type="primary" @click="onSubmit">提交</n-button>
</template>

<script lang="ts" setup>
import {ref,onMounted} from 'vue'
import { NButton } from 'naive-ui'
import MKEditor from '@toast-ui/editor'
import "@toast-ui/editor/dist/toastui-editor.css"
import "@toast-ui/editor/dist/i18n/zh-cn"
let markDownEditor: MKEditor
const editorRef = ref<HTMLDivElement|null>(null)
const {submitContent, initContent } = defineProps<{
    submitContent: (content: string) => void,
    initContent?: string
}>()

onMounted(() => {
    init()
})

const onSubmit = () => {
    const markdown = markDownEditor.getMarkdown()
    submitContent(markdown)
}

const init = () =>{
    markDownEditor = new MKEditor({
        el: editorRef.value!,
        previewStyle: 'vertical',
        language: 'zh-CN',
        height: '800px',
    })
    if (initContent) {
        markDownEditor.setMarkdown(initContent)
    }
}

</script>