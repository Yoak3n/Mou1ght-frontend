<template>
    <MessageTable :messages="messagesData" :actionHandler="actionHandler" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMessageList } from '@/api';
import MessageTable from '@/components/List/MessageTable/index.vue';
import type { MessageInfo } from '@/types';

const messagesData = ref<MessageInfo[]>([])

const fetchMessageList = async () => {
    try {
        const res = await getMessageList();
        if (res.code === 0 && res.data) {
            messagesData.value = res.data.messages || [];
        } else {
            window.$message.error(res.message || '获取留言列表失败');
        }
    } catch (error) {
        window.$message.error('获取留言列表出错');
    }
}
const modifyID = ref<string | undefined>(undefined)
const actionHandler = (id?: string) => modifyID.value = id

onMounted(() => {
    fetchMessageList();
})
</script>

<style scoped></style>