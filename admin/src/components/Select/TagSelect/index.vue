<template>
    <n-select :multiple="multiple" :options="options" remote @update:show="(show) => show && loadOptions()" :value="multiple?keys:value"
        :value-field="multiple?'key':'label'" label-field="label" @update-value="onUpdateKeys">
        <template #action>
            <div class="inline-create" @click.stop @mousedown.stop @keydown.stop>
                <n-input v-model:value="newLabel" size="small" placeholder="新标签名称" @keydown.enter.prevent="createOption" />
                <n-button size="small" type="primary" ghost :loading="creating" :disabled="!newLabel.trim()" @click="createOption">
                    新建
                </n-button>
            </div>
        </template>
    </n-select>
</template>

<script setup lang="ts">
import { computed, nextTick,ref, watch } from 'vue'
import { NSelect } from 'naive-ui';
import type { SelectOption } from 'naive-ui'
import { createTag, getAllTags } from '@/api/tag';
import type { Sign } from '@/types';

const {multiple} = defineProps({
    multiple: {
        type: Boolean,
        default: false
    }
})

let optionData: Map<string, Sign> = new Map();
const options = ref<SelectOption[]>([])
const values = defineModel<Sign[]>('values', { default: [] })
const value = defineModel<string>('value', { default: '' })
const keys = computed(() => values.value.map(item => item.id))

let initDone = false

// 使用立即执行的 watch，但只执行一次
const unwatch = watch(() => values.value, async (newValues) => {
    if (initDone) return

    // 等待一下确保不是空值
    await nextTick()

    if (newValues && newValues.length > 0) {
        await loadOptions()
        initDone = true
        if (!multiple) {
            value.value = optionData.keys().next().value || ''
        }
        unwatch() // 停止监听
    }
}, { immediate: true })

const onUpdateKeys = (v: string[] | string) => {
    if (!multiple) {
        value.value = v as string || ''
        return
    }
    values.value = (v as string[]).map(item => optionData.get(item))
        .filter((item): item is Sign => item !== undefined)
}
// 下拉菜单底部现场新建标签，成功后刷新选项并自动选中
const newLabel = ref('')
const creating = ref(false)
const createOption = async () => {
    const label = newLabel.value.trim()
    if (!label || creating.value) return
    creating.value = true
    try {
        const res = await createTag({ label })
        if (res.code != 0) throw new Error(res.message)
        window.$message.success(`标签「${label}」创建成功`)
        newLabel.value = ''
        await loadOptions()
        let created: Sign | undefined
        optionData.forEach((item) => { if (item.label === label) created = item })
        if (created) {
            if (multiple) {
                if (!values.value.some(v => v.id === created!.id)) values.value = [...values.value, created]
            } else {
                value.value = created.label
            }
        }
    } catch (e: any) {
        window.$message.error(e.message || '创建标签失败')
    } finally {
        creating.value = false
    }
}

const loadOptions = async () => {
    options.value = []
    try {
        const res = await getAllTags()
        if (res.code == 0) {
            res.data.forEach(item => {
                optionData.set(item.id, { id: item.id, label: item.label })
                const o: SelectOption = {
                    key: item.id,
                    label: item.label,
                }
                options.value.push(o)
            })
        } else {
            throw new Error(res.message)
        }

    } catch (e) {
        window.$message.error(`获取tag失败：${e}`)
    }
}
</script>

<style scoped>
.inline-create {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 6px;
    box-sizing: border-box;
}
</style>
