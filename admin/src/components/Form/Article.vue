<template>
    <n-form :model="articleModel">
        <n-form-item path="title" label="标题">
            <n-input v-model:value="articleModel.title" placeholder="请输入文章标题" />
        </n-form-item>
        <n-form-item label="分类">
            <CategorySelect v-model:values="articleModel.categories" />
        </n-form-item>
        <n-form-item label="标签">
            <TagSelect v-model:values="articleModel.tags" />
        </n-form-item>
    </n-form>
    <Editor :handleSubmit="handleSubmit" :initContent="articleModel.content" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NForm, NFormItem, NInput } from 'naive-ui';

import useUserStore from '@/store/modules/user'
import { createArticle, detailArticle, updateArticle } from '@/api';
import type { UpdateArticleRequest } from '@/api/article/type';
import Editor from '@/components/Editor/index.vue';
import CategorySelect from '@/components/Select/CategorySelect/index.vue'
import TagSelect from '@/components/Select/TagSelect/index.vue'
import type { ArticleInfo } from '@/types';
const { article } = defineProps<{ article?: ArticleInfo }>()
const initialAtricle = {
    id: '',
    title: '',
    content: '',
    author: '',
    tags: [],
    categories: []
}
const articleModel = ref<UpdateArticleRequest>(initialAtricle)
const userStore = useUserStore()

onMounted(async () => {
    if (article) {
        try {
            const res = await detailArticle(article.id)
            if (res.code == 0) {
                const data = res.data
                articleModel.value = {
                    id: data.id,
                    title: data.title,
                    content: data.content,
                    author: data.author.id,
                    tags: data.tags,
                    categories: data.categories
                }
            }else{
                throw new Error(res.message)
            }
        } catch (e: any) {
            window.$message.error(e.message)
        }


    }
})

const handleSubmit = async (content: string) => {
    articleModel.value.content = content
    if (content == '') {
        window.$message.error("article content can't be empty")
        return
    }
    const req = {
        title: articleModel.value.title,
        content: articleModel.value.content,
        author: userStore.info?.id!,
        categories: articleModel.value.categories,
        tags: articleModel.value.tags
    }
    try {
        if (article) {
            const res = await updateArticle({ ...req, id: article.id })
            window.$message.success(res.message)
        } else {
            const res = await createArticle(req)
            window.$message.success(res.message)
        }
    } catch (e: any) {
        window.$message.error(e.message || '操作失败')
    }
}


</script>

<style scoped></style>