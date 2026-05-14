<template>
  <div>
    <n-form :model="sharingForm" label-width="120px">
      <n-form-item label="内容" path="content">
        <n-input v-model:value="sharingForm.content" type="textarea" rows="4" placeholder="请输入内容" />
      </n-form-item>
      <n-form-item label="附件" path="attachment_ids">
        <n-upload 
        v-model:file-list="fileListRef"
        :accept="'.jpg,.jpeg,.png,.gif'" 
        :default-upload="false"
        @update:file-list="handleUpdateFileList"
        multiple
        :max="9"
        list-type="image-card" />
      </n-form-item>
      <n-form-item label="标签" path="tags">
        <TagSelect v-model:values="sharingForm.tags" />
      </n-form-item>
      <n-form-item label="私密" path="private">
        <n-switch v-model:value="sharingForm.private" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="submitForm">提交</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NButton, NUpload, NSwitch } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui'
import TagSelect from '@/components/Select/TagSelect/index.vue'
import type { CreateSharingRequest } from '@/api/sharing/type';
import { createSharing } from '@/api/sharing';
import { uploadAttachment } from '@/api/attachment';


const sharingForm = ref<CreateSharingRequest>({
    content: '',
    author: '',
    private: false,
    attachment_ids: [],
    tags: [],
})
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

const submitForm = async () => {
    await batchUploadAttachments(fileListRef.value)

    const attachmentIDs = fileListRef.value
        .filter(f => f.status === 'finished' && !!f.attachmentId)
        .map(f => f.attachmentId as string);

    sharingForm.value.attachment_ids = attachmentIDs;

    try {
        const res = await createSharing(sharingForm.value);
        if (res.code === 0) {
            window.$message.success('发布成功');
            // Reset form
            sharingForm.value = {
                content: '',
                author: '',
                private: false,
                attachment_ids: [],
                tags: [],
            };
            fileListRef.value = [];
        } else {
            window.$message.error(res.message || '发布失败');
        }
    } catch (error) {
        window.$message.error('发布失败');
    }
}
</script>
