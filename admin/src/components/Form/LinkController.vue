<template>
    <div class="link-controller">
        <div ref="parent">
            <div v-for="(element, index) in links" :index="index" :key="element.label" >
                <n-space class="link-item">
                    <n-input-group>
                        <n-input v-model:value="element.label" placeholder="Link Label" />
                        <n-input v-model:value="element.url" placeholder="Link URL" />
                        <n-select v-model:value="element.type" placeholder="Link Type" :options="linkTypeOptions" />
                    </n-input-group>
                    <n-button-group>
                        <n-button @click="removeLink(index)" v-if="index !== 0">
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
            <n-form-item label="Label">
                <n-input v-model:value="linkForm.label" placeholder="Label" />
            </n-form-item>
            <n-form-item label="URL">
                <n-input v-model:value="linkForm.url" placeholder="URL" />
            </n-form-item>
            <n-form-item label="Type">
                <n-select v-model:value="linkForm.type" placeholder="Type" :options="linkTypeOptions" />
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
import type { LinkSetting } from '@/types';

const visible = ref(false)
const linkForm = ref<LinkSetting>({
    label: '',
    url: '',
    type: 'link'
})
const linkTypeOptions = ref([
    {
        label: 'Link',
        value: 'link'
    },
    {
        label: 'Dropdown',
        value: 'dropdown'
    }
])

const links = defineModel('links', {
    type: Array as () => Array<LinkSetting>,
    required: true
});

const addLink = () => {
    visible.value = true
    console.log(visible.value);

}

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