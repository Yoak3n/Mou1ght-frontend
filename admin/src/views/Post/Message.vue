<template>
    <MessageTable :messages="messagesData" @select="handleSelect" @deselect="handleDeselect" @action="handleMenuAction" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMessageList, deleteMessage, updateMessageStatus } from '@/api/message';
import MessageTable from '@/components/List/MessageTable/index.vue';
import type { MessageInfo } from '@/types';

const messagesData = ref<MessageInfo[]>([])

// 当前选中的留言 ID（右键菜单操作的目标）
const modifyID = ref<string | undefined>(undefined)
const handleSelect = (id: string) => { modifyID.value = id }
const handleDeselect = () => { modifyID.value = undefined }

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

const handleMenuAction = (key: string) => {
    switch (key) {
        case 'passMessage':
            approveMessage()
            break
        case 'previewMessage':
            break
        case 'deleteMessage':
            deleteMessageByID()
            break
    }
}

const approveMessage = async () => {
    if (!modifyID.value) {
        window.$message.warning('请先选择一条留言')
        return
    }
    try {
        const res = await updateMessageStatus({
            post_type: 'message',
            post_id: modifyID.value,
            status: 'publish',
        })
        if (res.code === 0) {
            window.$message.success('审核通过')
            fetchMessageList()
        } else {
            window.$message.error(res.message || '审核失败')
        }
    } catch (error) {
        window.$message.error('审核出错')
    }
}

const deleteMessageByID = async () => {
    if (!modifyID.value) {
        window.$message.warning('请先选择一条留言')
        return
    }
    try {
        const res = await deleteMessage(modifyID.value)
        if (res.code === 0) {
            window.$message.success('删除留言成功')
        } else {
            window.$message.error(res.message || '删除留言失败')
        }
        fetchMessageList()
    } catch (error) {
        window.$message.error('删除留言出错')
    }
}

onMounted(() => {
    fetchMessageList();
})
</script>

<style scoped></style>
