<template>
    <div class="article-list-wrapper">
        <n-button type="primary" @click="$router.push('/article/list')">返回列表</n-button>
        <n-card>
            <n-form>
                <n-form-item label="标题" prop="title">
                    <n-input v-model:value="article.title" />
                </n-form-item>
                <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi label="标签" prop="tag">
                        <div style="width: 100%;">
                            <n-input-group>
                                <n-input v-model:value="tagInput" />
                                <n-button @click="() => { article.tag.push(tagInput); tagInput = '' }">添加</n-button>
                            </n-input-group>
                            <n-space>
                                <n-tag v-for="(_, index) in article.tag" closable
                                    @close="() => article.tag.splice(index, 1)" :key="index"
                                    :type="TagColor.get(index % 5) as any || 'default'">
                                    {{ article.tag[index] }}
                                </n-tag>
                            </n-space>
                        </div>
                    </n-form-item-gi>
                    <n-form-item-gi label="分类">
                        <n-select v-model:value="article.category.name">
                        </n-select>
                    </n-form-item-gi>
                </n-grid>
                <n-form-item label="描述" prop="description">
                    <n-input :autosize="{
                        minRows: 3,
                        maxRows: 5,
                    }" type="textarea" v-model:value="article.description" />
                </n-form-item>
                <n-form-item label="封面">
                    <n-input v-model:value="article.cover" />
                    <n-image :src="article.cover" width="100px" height="100px" v-if="article.cover" />
                </n-form-item>
               
            </n-form>
        </n-card>
        <Markdown ref="markdownRef" :submitContent="handleSubmit" :initContent="article.content" />
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
    NCard,
    NForm,
    NFormItemGi,
    NGrid,
    NFormItem,
    NInput,
    NInputGroup,
    NButton,
    NSpace,
    NSelect,
    NImage,
    NTag
} from 'naive-ui'
import Markdown from '@/components/Markdown/index.vue'
import { onMounted, reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'



import { ArticleDetailView } from '@/api/article/type'
import { addArticle, getArticleDetail, updateArticle } from '@/api/article'
import { Response } from '@/api/res'

const $router = useRouter()
const $route = useRoute()
const userStore = useUserStore()

let tagInput = ref('')
let article = reactive<ArticleDetailView>({
    id: 0,
    title: '',
    tag: [],
    description: '',
    category: {
        name: '',
        description: ''
    },
    cover: '',
    content: '',
    author_id: 0
})
let modifyMode = false

onMounted(() => {
    const id = $route.params.id as string
    if (id !== 'add') {
        modifyMode = true
        const id_number = Number(id)
        article.id = id_number
        getArticleDetail(id_number).then(res => article = res)
    }
})

const handleSubmit = async (content: string) => {
    article.content = content
    article.author_id = userStore.userID
    let res: Response<ArticleDetailView>
    modifyMode ? res = await updateArticle(article) : res = await addArticle(article)
    if (res.code === 0) {
        $router.push('/article/list')
    }
}

const TagColor: Map<number, string> = new Map<number, string>([
    [4, 'info'],
    [3, 'error'],
    [1, 'success'],
    [2, 'warning'],
    [0, 'default']
])


</script>

