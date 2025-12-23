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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { NTabs, NTabPane } from 'naive-ui';

import $emitter from '@/bus'
import { listArticle} from '@/api/article'
import type {PostListRequest} from '@/api/article/type'
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
onMounted(async()=>{
    $emitter.on("article:updateAction",openModify)
    $emitter.on('article:previewAction',openPreview)
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
    try {
        const res  = await listArticle(req)
        if (res.code == 0) {
            articlesData.value = res.data.articles!
        }else{
            throw new Error(res.message)
        }
        
        
    }catch(e:any){
        window.$message.error(e.message || '请求错误')
    }
})
onBeforeUnmount(()=>{
    $emitter.off('article:updateAction',openModify)
    $emitter.off('article:previewAction',openPreview)
})
const actionHandler = (id?: string) => modifyID.value = id
</script>

<style scoped></style>