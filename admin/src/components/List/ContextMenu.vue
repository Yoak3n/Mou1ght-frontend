<script setup lang="ts">
import { computed } from 'vue';
import { NDropdown } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';

// 通用右键菜单：由表格组件传入 options，选中后通过事件上抛。
// 事件流的终点是视图（页面）里的具体业务处理，不再依赖全局事件总线。
const props = defineProps<{
    x: number;
    y: number;
    show: boolean;
    options: DropdownOption[];
}>();

const emit = defineEmits<{
    select: [key: string];
    close: [];
}>();

// 错误类型的选项标红，便于区分危险操作
const styledOptions = computed(() =>
    props.options.map((option) => {
        if (option.type !== 'error') return option;
        const existingStyle = typeof option.props?.style === 'object' ? option.props.style : {};
        return {
            ...option,
            props: {
                ...(option.props || {}),
                style: { ...(existingStyle as object), color: '#d03050' },
            },
        };
    })
);
</script>

<template>
    <n-dropdown
        :x="x"
        :y="y"
        :options="styledOptions"
        :show="show"
        @select="(key: string) => emit('select', key)"
        @clickoutside="emit('close')"
    />
</template>
