<template>
  <div>
    <n-form :model="sharingForm" label-width="120px">
      <n-form-item label="内容" path="content">
        <n-input v-model:value="sharingForm.content" type="textarea" rows="4" placeholder="请输入内容" />
      </n-form-item>
      <n-form-item label="附件" path="attachment">
        <n-upload 
        v-model:file-list="fileListRef"
        :accept="'.jpg,.jpeg,.png,.gif'" 
        :custom-request="customUpload"
        :default-upload="true"  
        multiple
        :max="9"
        list-type="image-card" />
      </n-form-item>
      <n-form-item label="标签" path="tags">
        <TagSelect v-model:values="sharingForm.tags" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="submitForm">提交</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NButton, NUpload, useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import TagSelect from '@/components/Select/TagSelect/index.vue'
import type { CreateSharingRequest } from '@/api/sharing/type';
import { createSharing } from '@/api/sharing';
import { uploadAttachment } from '@/api/attachment';

const message = useMessage();
const sharingForm = ref<CreateSharingRequest>({
    content: '',
    author: '',
    attachment: '',
    tags: [],
})
const fileListRef = ref<UploadFileInfo[]>([])


const customUpload = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
    const formData = new FormData();
    if (file.file) {
        formData.append('file', file.file);
        try {
            const res = await uploadAttachment(formData);
            if (res.code === 0) {
                file.url = res.data; // Assuming backend returns the URL in data
                // Update attachment string in form
                if (sharingForm.value.attachment) {
                    sharingForm.value.attachment += `,${res.data}`;
                } else {
                    sharingForm.value.attachment = res.data;
                }
                onFinish();
            } else {
                message.error(res.message || '上传失败');
                onError();
            }
        } catch (error) {
            message.error('上传出错');
            onError();
        }
    }
}

const submitForm = async () => {

    const attachments = fileListRef.value
        .filter(f => f.status === 'finished' && f.url)
        .map(f => f.url)
        .join(',');
        
    sharingForm.value.attachment = attachments;

    try {
        const res = await createSharing(sharingForm.value);
        if (res.code === 0) {
            message.success('发布成功');
            // Reset form
            sharingForm.value = {
                content: '',
                author: '',
                attachment: '',
                tags: [],
            };
            fileListRef.value = [];
        } else {
            message.error(res.message || '发布失败');
        }
    } catch (error) {
        message.error('发布失败');
    }
}
</script>
