<template>
    <div class="link-controller">
        <div ref="parent">
            <div v-for="(element, index) in links" :index="index" :key="element.label" >
                <n-space class="link-item">
                    <n-input-group>
                        <n-input v-model:value="element.label" placeholder="Link Label" :disabled="element.type != 'external'"/>
                        <n-input v-model:value="element.href" placeholder="Link URL" v-if="element.type == 'external'" />
                        <n-select v-model:value="element.type" placeholder="Link Type" :options="linkTypeOptions" />
                    </n-input-group>
                    <n-button-group>
                        <n-button @click="removeLink(index)" v-if="links.length > 1 && index != 0">
                            <n-icon>
                                <Remove />
                            </n-icon>
                        </n-button>
                        <n-button @click="addLink" v-if="index === links.length - 1" :round="index !== 0">
                            <n-icon>
                                <Add />
                            </n-icon>
                        </n-button>
                    </n-button-group>
                </n-space>
            </div>
        </div>

    </div>
    <n-modal v-model:show="visible" title="Add Link" preset="card" :style="{ width: '800px' }">
        <n-form :model="linkForm">
            <n-form-item label="Label" >
                <n-input v-model:value="linkForm.label" placeholder="Label" v-if="linkForm.type == 'external'" />
                <n-select v-model:value="linkForm.label" placeholder="Internal link" v-if="linkForm.type == 'internal'" :options="internalLinkOption"/>
                <CategorySelect v-model:value="linkForm.label" placeholder="Category" v-if="linkForm.type == 'category'" />
                <TagSelect v-model:value="linkForm.label" placeholder="Tag" v-if="linkForm.type == 'tag'"  />   
            </n-form-item>
            <n-form-item label="URL" v-if="linkForm.type == 'external' || linkForm.type == 'home'">
                <n-input v-model:value="linkForm.href" placeholder="URL" />
            </n-form-item>
            <n-form-item label="Type">
                <n-select v-model:value="linkForm.type" placeholder="Type" :options="linkTypeOptions"  @update:value="onTypeChange"/>
            </n-form-item>
        </n-form>
        <template #footer>
            <n-space justify="end">
                <n-button  @click="visible = false">Cancel</n-button>
                <n-button  @click="submitLinkToModel">Add</n-button>
            </n-space>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDragAndDrop } from 'fluid-dnd/vue';
import { NInput, NInputGroup, NButtonGroup, NButton, NModal, NForm, NFormItem, NSelect, NIcon, NSpace } from 'naive-ui';
import { Add, Remove } from '@vicons/ionicons5';

import TagSelect from '@/components/Select/TagSelect/index.vue'
import CategorySelect from '@/components/Select/CategorySelect/index.vue'
import type { LinkSetting } from '@/types';

const visible = ref(false)
const linkForm = ref<LinkSetting>({
    label: '',
    href: '',
    type: 'internal'
})
const linkTypeOptions = [
    {
        label: 'Internal',
        value: 'internal'
    },
    {
        label: 'Category',
        value: 'category'
    },{
        label: 'Tag',
        value: 'tag'
    },
    {
        label: 'External',
        value: 'external'
    }
]

const internalLinkOption = [
    {
        label: 'Home',
        value: 'home'
    },{
        label: 'Board',
        value: 'board'
    }
]

const onTypeChange = () => {
    linkForm.value.href = ''
    linkForm.value.label = ''
}

const links = defineModel('links', {
    type: Array as () => Array<LinkSetting>,
    required: true
});

const addLink = () => visible.value = true

const removeLink = (index: number) => {
    links.value.splice(index, 1)
}

const submitLinkToModel = () => {
    links.value.push(linkForm.value)
    visible.value = false
}

const [parent] = useDragAndDrop(links)

defineExpose({ parent })
</script>

<style scoped>
.link-controller {
    width: 100%;
}

.link-item {
    margin-bottom: 8px;
    padding: 8px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: move;
}
</style>