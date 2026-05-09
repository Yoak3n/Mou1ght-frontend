<template>
    <n-tabs animated type="line" size="large" default-value="list" v-model:value="tabKey" @update:value="(v)=> v== 'list' && (modifyID = undefined) ">
        <n-tab-pane tab="文章列表" name="list" display-directive="show">
            <ArticleTable :articles="articlesData" :action-handler="actionHandler"/>
        </n-tab-pane>
        <n-tab-pane :tab="modifyID && tabKey == 'modify'? '更新文章' : '新建文章'" name="modify" display-directive="if">
            <ArticleForm :article="modifyArticle"/>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue';
import { NSelect, NTabs, NTabPane } from 'naive-ui';

import $emitter from '@/bus'
import { listArticle, updateArticleStatus } from '@/api/article'
import type { PostListRequest, PostStatus } from '@/api/article/type'
import type { ArticleInfo} from '@/types';
import ArticleTable from '@/components/List/ArticleTable/index.vue'
import ArticleForm from '@/components/Form/Article.vue';


const tabKey = ref('list')
const modifyID = ref<string| undefined>(undefined)
const modifyArticle = computed(()=> {
    if (modifyID.value){
        const ret = articlesData.value[articlesData.value.findIndex((v)=> v.id == modifyID.value)]
        return ret
    }else{
        return undefined
    }
})
const articlesData = ref<ArticleInfo[]>([])

const openModify = () => tabKey.value = 'modify'
const openPreview = () => {
}

const fetchArticles = async () => {
    const req :PostListRequest= {
        filter: {
            type: 'single',
            date_range: undefined,
            sort: 'desc'
        },
        data: {
            keyword: []
        }
    }
    const res  = await listArticle(req)
    if (res.code == 0) {
        articlesData.value = res.data.articles!
        return
    }
    throw new Error(res.message)
}

const normalizeToRequestStatus = (s?: string): PostStatus => {
    switch (s) {
        case 'draft':
            return 'draft'
        case 'published':
            return 'publish'
        case 'archived':
            return 'archive'
        default:
            return 'draft'
    }
}

const openStatus = () => {
    if (!modifyID.value) {
        window.$message.error('请选择文章')
        return
    }
    const initial = normalizeToRequestStatus(modifyArticle.value?.state.status)
    const status = ref<PostStatus>(initial)
    window.$dialog.create({
        title: '更改文章状态',
        positiveText: '确认',
        negativeText: '取消',
        content: () => h(NSelect, {
            value: status.value,
            options: [
                { label: '草稿', value: 'draft' },
                { label: '发布', value: 'publish' },
                { label: '归档', value: 'archive' },
            ],
            'onUpdate:value': (v: PostStatus) => status.value = v
        }),
        onPositiveClick: async () => {
            const res = await updateArticleStatus({
                post_type: 'article',
                post_id: modifyID.value!,
                status: status.value
            })
            if (res.code === 0) {
                window.$message.success(res.message)
                await fetchArticles()
                return true
            }
            window.$message.error(res.message || '操作失败')
            return false
        }
    })
}

onMounted(async()=>{
    $emitter.on("article:updateAction",openModify)
    $emitter.on('article:previewAction',openPreview)
    $emitter.on('article:statusAction', openStatus)
    try {
        await fetchArticles()
    }catch(e:any){
        window.$message.error(e.message || '请求错误')
    }
})
onBeforeUnmount(()=>{
    $emitter.off('article:updateAction',openModify)
    $emitter.off('article:previewAction',openPreview)
    $emitter.off('article:statusAction', openStatus)
})
const actionHandler = (id?: string) => modifyID.value = id
</script>

<style scoped></style>
