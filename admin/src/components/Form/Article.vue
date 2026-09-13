<template>
    <n-form :model="articleModel">
        <n-form-item path="title" label="标题">
            <n-input v-model:value="articleModel.title" placeholder="请输入文章标题" />
        </n-form-item>
        <n-grid :cols="24" :x-gap="24">
            <n-form-item-grid-item label="分类" span="10">
                <CategorySelect v-model:values="articleModel.categories" multiple />
            </n-form-item-grid-item>
            <n-form-item-grid-item label="标签" span="10">
                <TagSelect v-model:values="articleModel.tags" multiple />
            </n-form-item-grid-item>
            <n-form-item-grid-item label="附件" span="24">
                <div class="attachment-block">
                    <n-upload
                        v-model:file-list="fileListRef"
                        :accept="'.mp3,.flac,.wav,.ogg,.m4a,.aac,.jpg,.jpeg,.png,.gif,.webp'"
                        :default-upload="false"
                        @update:file-list="handleUpdateFileList"
                        multiple
                        :max="9"
                    >
                        <n-upload-dragger>
                            <div class="attachment-dragger">
                                <n-icon :size="28" :depth="3"><CloudUploadOutline /></n-icon>
                                <div class="attachment-dragger-title">点击选择或拖拽文件到此处上传</div>
                                <div class="attachment-dragger-sub">选择后立即上传，保存文章时生效；前台会为音频渲染播放器</div>
                            </div>
                        </n-upload-dragger>
                    </n-upload>
                    <span class="attachment-hint">支持音频（mp3/flac/wav/ogg/m4a/aac）与图片，最多 9 个。</span>
                </div>
            </n-form-item-grid-item>
        </n-grid>

    </n-form>
    <Editor :handleSubmit="handleSubmit" :initContent="articleModel.content" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NForm, NFormItem, NInput, NGrid, NFormItemGridItem, NUpload, NUploadDragger, NIcon } from 'naive-ui';
import { CloudUploadOutline } from '@vicons/ionicons5';
import type { UploadFileInfo } from 'naive-ui'

import useUserStore from '@/store/modules/user'
import { createArticle, detailArticle, updateArticle } from '@/api';
import type { UpdateArticleRequest } from '@/api/article/type';
import Editor from '@/components/Editor/index.vue';
import CategorySelect from '@/components/Select/CategorySelect/index.vue'
import TagSelect from '@/components/Select/TagSelect/index.vue'
import { uploadAttachment } from '@/api/attachment';
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

type UploadFileWithAttachment = UploadFileInfo & {
    attachmentId?: string
}
const fileListRef = ref<UploadFileWithAttachment[]>([])
const uploadingAttachments = ref(false)

const batchUploadAttachments = async (files: UploadFileWithAttachment[]) => {
    const pending = files.filter(f => !!f.file && !f.attachmentId)
    if (pending.length === 0) return
    if (uploadingAttachments.value) return

    const formData = new FormData()
    for (const f of pending) {
        const raw = f.file as File | undefined
        if (raw) formData.append('file', raw)
    }

    uploadingAttachments.value = true
    try {
        pending.forEach(f => (f as any).status = 'uploading')
        fileListRef.value = [...fileListRef.value]

        const res = await uploadAttachment(formData)
        if (res.code !== 0) {
            pending.forEach(f => (f as any).status = 'error')
            fileListRef.value = [...fileListRef.value]
            window.$message.error(res.message || '上传失败')
            return
        }

        const attachments = res.data?.attachments ?? []
        for (const [i, f] of pending.entries()) {
            const a = attachments[i]
            if (!a?.url || !a?.id) {
                ;(f as any).status = 'error'
                continue
            }
            f.url = a.url
            f.attachmentId = a.id
            ;(f as any).status = 'finished'
        }
        fileListRef.value = [...fileListRef.value]
    } catch (error) {
        pending.forEach(f => (f as any).status = 'error')
        fileListRef.value = [...fileListRef.value]
        window.$message.error('上传出错')
    } finally {
        uploadingAttachments.value = false
    }
}

const handleUpdateFileList = (next: UploadFileInfo[]) => {
    fileListRef.value = next as UploadFileWithAttachment[]
    void batchUploadAttachments(fileListRef.value)
}

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
                // 回填已关联的附件，避免保存时丢失
                fileListRef.value = (data.attachments || []).map((a: any) => ({
                    id: a.id,
                    name: a.original_name || a.file_path || '附件',
                    status: 'finished',
                    attachmentId: a.id,
                    url: a.url,
                } as UploadFileWithAttachment))
            } else {
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
    await batchUploadAttachments(fileListRef.value)
    const attachmentIDs = fileListRef.value
        .filter(f => f.status === 'finished' && !!f.attachmentId)
        .map(f => f.attachmentId as string)

    const req = {
        title: articleModel.value.title,
        content: articleModel.value.content,
        author: userStore.info?.id!,
        categories: articleModel.value.categories,
        tags: articleModel.value.tags,
        attachment_ids: attachmentIDs
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

<style scoped>
.attachment-block {
    width: 100%;
}

.attachment-dragger {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 18px 12px;
}

.attachment-dragger-title {
    font-size: 14px;
    color: #555;
}

.attachment-dragger-sub {
    font-size: 12px;
    color: #999;
}

.attachment-hint {
    display: block;
    margin-top: 4px;
    color: #999;
    font-size: 12px;
}
</style>
