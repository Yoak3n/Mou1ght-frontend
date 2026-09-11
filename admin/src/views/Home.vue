<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCard, NGi, NGrid, NSpace, NStatistic } from 'naive-ui'

import { getTimeDutation } from '@/utils/time'
import AttachmentPanel from '@/components/Attachment/Panel.vue'
import { listArticle } from '@/api/article'
import { getSharingList } from '@/api/sharing'
import { getMessageList } from '@/api/message'
import { getAttachmentList } from '@/api/attachment'

const router = useRouter()

const greeting = computed(() => `${getTimeDutation()}好`)

// 内容统计：文章 / 说说 / 留言 / 附件
const stats = ref({ articles: 0, sharings: 0, messages: 0, attachments: 0 })

onMounted(async () => {
    const [a, s, m, att] = await Promise.allSettled([
        listArticle({ filter: { type: 'single', sort: 'desc' }, data: { keyword: [] } }),
        getSharingList(),
        getMessageList(),
        getAttachmentList(),
    ])
    if (a.status === 'fulfilled' && a.value.code === 0) stats.value.articles = a.value.data.total ?? 0
    if (s.status === 'fulfilled' && s.value.code === 0) stats.value.sharings = s.value.data.total ?? 0
    if (m.status === 'fulfilled' && m.value.code === 0) stats.value.messages = m.value.data.total ?? 0
    if (att.status === 'fulfilled' && att.value.code === 0) stats.value.attachments = att.value.data.attachments?.length ?? 0
})
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

            <n-grid :x-gap="12" :y-gap="12" cols="2 s:2 m:4 l:4 xl:4 2xl:4" responsive="screen">
                <n-gi>
                    <n-card hoverable size="small" @click="router.push({ name: 'article' })" style="cursor: pointer">
                        <n-statistic label="文章" :value="stats.articles" />
                    </n-card>
                </n-gi>
                <n-gi>
                    <n-card hoverable size="small" @click="router.push({ name: 'sharing' })" style="cursor: pointer">
                        <n-statistic label="说说" :value="stats.sharings" />
                    </n-card>
                </n-gi>
                <n-gi>
                    <n-card hoverable size="small" @click="router.push({ name: 'message' })" style="cursor: pointer">
                        <n-statistic label="留言" :value="stats.messages" />
                    </n-card>
                </n-gi>
                <n-gi>
                    <n-card hoverable size="small" @click="router.push({ name: 'post' })" style="cursor: pointer">
                        <n-statistic label="附件" :value="stats.attachments" />
                    </n-card>
                </n-gi>
            </n-grid>

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
