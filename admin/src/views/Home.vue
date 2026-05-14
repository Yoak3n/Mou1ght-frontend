<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { NButton, NCard, NGi, NGrid, NSpace } from 'naive-ui'

import { getTimeDutation } from '@/utils/time'
import AttachmentPanel from '@/components/Thing/AttachmentPanel/index.vue'

const router = useRouter()

const greeting = computed(() => `${getTimeDutation()}好`)


</script>

<template>
    <div class="home">
        <n-space vertical size="large">
            <n-card>
                <n-space align="center" justify="space-between">
                    <div class="home-title">
                        <div class="home-greeting">{{ greeting }}</div>
                        <div class="home-subtitle">欢迎回到后台面板</div>
                    </div>
                </n-space>
            </n-card>

            <n-grid :x-gap="12" :y-gap="12" cols="2 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
                <n-gi>
                    <AttachmentPanel />
                </n-gi>

                <n-gi>
                    <n-card title="快捷入口" hoverable>
                        <n-space vertical>
                            <n-button block secondary @click="router.push({ name: 'article' })">文章管理</n-button>
                            <n-button block secondary @click="router.push({ name: 'sharing' })">说说管理</n-button>
                            <n-button block secondary @click="router.push({ name: 'message' })">留言管理</n-button>
                            <n-button block secondary @click="router.push({ name: 'settings' })">网站设置</n-button>
                        </n-space>
                    </n-card>
                </n-gi>
            </n-grid>
        </n-space>
    </div>
</template>

<style scoped>
.home {
    width: 100%;
}
.home-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.home-greeting {
    font-size: 18px;
    font-weight: 600;
}
.home-subtitle {
    font-size: 12px;
    opacity: 0.7;
}
</style>
