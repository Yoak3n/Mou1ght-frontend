<template>
    <div class="link-controller">
        <div v-if="links.length === 0" class="link-empty">暂无导航链接，点击下方按钮添加</div>

        <div v-for="(link, index) in links" :key="index" class="link-row">
            <n-select
                :value="link.type"
                :options="linkTypeOptions"
                size="small"
                class="link-type"
                @update:value="(t) => onChangeType(index, t as string)"
            />
            <div class="link-fields">
                <!-- 站内页面：选择目标，自动填 label 与 href -->
                <n-select
                    v-if="link.type === 'internal'"
                    :value="link.href"
                    :options="internalDestinationOptions"
                    size="small"
                    placeholder="选择站内页面"
                    @update:value="(h) => onSelectInternal(index, h as string)"
                />
                <!-- 分类 / 标签：选择后自动填 label 与 href -->
                <CategorySelect
                    v-else-if="link.type === 'category'"
                    :value="link.label"
                    size="small"
                    placeholder="选择分类"
                    @update:value="(v) => onSelectGroup(index, 'category', v as string)"
                />
                <TagSelect
                    v-else-if="link.type === 'tag'"
                    :value="link.label"
                    size="small"
                    placeholder="选择标签"
                    @update:value="(v) => onSelectGroup(index, 'tag', v as string)"
                />
                <!-- 外链：自定义名称与 URL -->
                <template v-else>
                    <n-input v-model:value="link.label" size="small" placeholder="链接名称" />
                    <n-input v-model:value="link.href" size="small" placeholder="https://..." />
                </template>
            </div>
            <div class="link-actions">
                <n-button size="tiny" quaternary :disabled="index === 0" @click="move(index, -1)">上移</n-button>
                <n-button size="tiny" quaternary :disabled="index === links.length - 1" @click="move(index, 1)">下移</n-button>
                <n-button size="tiny" quaternary type="error" @click="removeLink(index)">删除</n-button>
            </div>
        </div>

        <div class="link-add">
            <span class="link-add-label">添加：</span>
            <n-button size="small" @click="quickAdd('internal')">站内页面</n-button>
            <n-button size="small" @click="quickAdd('category')">分类</n-button>
            <n-button size="small" @click="quickAdd('tag')">标签</n-button>
            <n-button size="small" @click="quickAdd('external')">外链</n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NInput, NButton, NSelect } from 'naive-ui';
import TagSelect from '@/components/Select/TagSelect/index.vue';
import CategorySelect from '@/components/Select/CategorySelect/index.vue';
import type { LinkSetting } from '@/types';

const links = defineModel<LinkSetting[]>('links', {
    type: Array as () => Array<LinkSetting>,
    required: true,
});

const linkTypeOptions = [
    { label: '站内页面', value: 'internal' },
    { label: '分类', value: 'category' },
    { label: '标签', value: 'tag' },
    { label: '外链', value: 'external' },
];

const internalDestinationOptions = [
    { label: '主页', value: '/' },
    { label: '留言板', value: '/board' },
    { label: '说说', value: '/sharings' },
    { label: '分类', value: '/categories' },
    { label: '标签', value: '/tags' },
];

const blankLink = (type: string): LinkSetting => ({ type, label: '', href: '' });

// 以不可变方式更新数组，保证 defineModel 与父组件响应式稳定
function commit(updater: (list: LinkSetting[]) => LinkSetting[]) {
    links.value = updater([...links.value]);
}

const onChangeType = (index: number, type: string) => {
    commit((list) => {
        const link = blankLink(type);
        // 站内页面直接给第一个预设，减少操作
        if (type === 'internal') {
            const preset = internalDestinationOptions[0]!;
            link.label = preset.label;
            link.href = preset.value;
        }
        list[index] = link;
        return list;
    });
};

const onSelectInternal = (index: number, href: string) => {
    commit((list) => {
        const preset = internalDestinationOptions.find((o) => o.value === href);
        list[index] = { type: 'internal', label: preset?.label ?? '', href };
        return list;
    });
};

const onSelectGroup = (index: number, type: 'category' | 'tag', label: string) => {
    commit((list) => {
        list[index] = { type, label, href: `/${type}/${encodeURIComponent(label)}` };
        return list;
    });
};

const quickAdd = (type: string) => {
    commit((list) => {
        const link = blankLink(type);
        if (type === 'internal') {
            const preset = internalDestinationOptions[0]!;
            link.label = preset.label;
            link.href = preset.value;
        }
        list.push(link);
        return list;
    });
};

const removeLink = (index: number) => {
    commit((list) => list.filter((_, i) => i !== index));
};

const move = (index: number, delta: -1 | 1) => {
    commit((list) => {
        const target = index + delta;
        if (target < 0 || target >= list.length) return list;
        const current = list[index]!;
        const next = list[target]!;
        list[index] = next;
        list[target] = current;
        return list;
    });
};
</script>

<style scoped>
.link-controller {
    width: 100%;
}

.link-empty {
    color: #999;
    font-size: 13px;
    padding: 12px 0;
}

.link-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
}

.link-type {
    width: 120px;
    flex-shrink: 0;
}

.link-fields {
    flex: 1;
    display: flex;
    gap: 8px;
    min-width: 0;
}

.link-fields > :deep(.n-select),
.link-fields > :deep(.n-input) {
    flex: 1;
}

.link-actions {
    flex-shrink: 0;
    display: flex;
    gap: 0;
}

.link-add {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.link-add-label {
    color: #666;
    font-size: 13px;
}
</style>
