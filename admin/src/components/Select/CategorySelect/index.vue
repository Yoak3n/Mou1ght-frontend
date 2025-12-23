<template>
    <n-select multiple :options="options" value-field="key" label-field="label" remote
        @update-show="(show) => show && loadOptions()" :renderTag="renderTag" :value="keys"
        @update:value="onUpdateKeys" />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { NSelect } from 'naive-ui';
import type { SelectOption } from 'naive-ui'
import { renderTag } from '../index'
import { getAllCategoryGroup } from '@/api/category';
import type { CategoryGroup, Sign } from '@/types';

let optionData: Map<string, Sign> = new Map();
const options = ref<SelectOption[]>([])
const keys = computed(() => values.value.map(item => item.id))
const values = defineModel<Sign[]>('values', { default: [] })

let initDone = false

// 使用立即执行的 watch，但只执行一次
const unwatch = watch(() => values.value, async (newValues) => {
    if (initDone) return

    // 等待一下确保不是空值
    await nextTick()

    if (newValues && newValues.length > 0) {
        await loadOptions()
        initDone = true
        unwatch() // 停止监听
    }
}, { immediate: true })

const onUpdateKeys = (v: string[]) => {
    values.value = v.map(item => optionData.get(item))
        .filter((item): item is Sign => item !== undefined)
}
const loadOptions = async () => {
    options.value = []
    try {
        const res = await getAllCategoryGroup()
        if (res.code == 0) {
            optionData.clear()
            options.value = buildOptions(res.data)
        } else {
            throw new Error(res.message)
        }
    } catch (e) {
        window.$message.error(`获取category失败：${e}`)
    }
}

const buildOptions = (data: CategoryGroup[], parent?: string): SelectOption[] => {
    let ret: SelectOption[] = []
    data.forEach(item => {
        optionData.set(item.id, { id: item.id, label: item.label })
        const label = parent ? `${parent}/${item.label}` : item.label
        const layer = parent ? label.split("/").length : 1
        const o: SelectOption = {
            key: item.id,
            label,
            layer
        }
        ret.push(o)
        if (item.children.length > 0) {
            const children = buildOptions(item.children, label)
            ret.push(...children)
        }
    })
    return ret
}

</script>