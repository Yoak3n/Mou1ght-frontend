<template>
    <NGAvatarGroup :options="options" :max="3" size="medium">
        <template #avatar="{ option: { name, src } }">
            <n-tooltip>
                <template #trigger>
                    <n-avatar :src="`${baseUrl}${src}`" :round="false" />
                </template>
                {{ name.split('.').slice(0, -1).join('.') }}
            </n-tooltip>
        </template>
        <template #rest="{ options: restOptions, rest }">
            <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
                <n-avatar>+{{ rest }}</n-avatar>
            </n-dropdown>
        </template>
    </NGAvatarGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Attachment } from '@/types';
import { NAvatar, NTooltip, NDropdown } from 'naive-ui';
import type { AvatarGroupOption} from 'naive-ui'
import { NGAvatarGroup } from 'naive-ui/generic';

type Option = AvatarGroupOption & { name: string }
const { srcs } = defineProps<{
    srcs: Attachment[]
}>()

const options = computed(() => {
    const ret =  srcs.map(item => ({
        name: item.file_name,
        src: item.file_path,
    }))
    return ret as Option[];
})

const baseUrl = import.meta.env.VITE_APP_BASE_URL as string;

function createDropdownOptions(options: Option[]) {
  return options.map(option => ({
    key: option.name,
    label: option.name
  }))
}
</script>

<style scoped></style>