<template>
    <n-dropdown 
    :x="x" :y="y" 
    :options="options" 
    :show="show" @clickoutside="()=>close(false)" @select="contextMenuHandler"/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NDropdown } from 'naive-ui';
import $emitter from '@/bus'
import { contextMenuOptions } from '.';
const {x,y, close} = defineProps<{
    x: number,
    y: number,
    show: boolean,
    close: (m:boolean)=> void
}>()

const options = computed(() => {
    return contextMenuOptions.map((option) => {
        if (option.type !== 'error') {
            return option
        }
        const existingStyle = typeof option.props?.style === 'object' ? option.props.style : {}
        return {
            ...option,
            props: {
                ...(option.props || {}),
                style: {
                    ...(existingStyle as object),
                    color: '#d03050'
                }
            }
        }
    })
})

const contextMenuHandler = (key: string) => {
    switch (key){
        case 'updateArticle':
            $emitter.emit('article:updateAction')
            break
        case 'changeStatus':
            $emitter.emit('article:statusAction')
            break
        case 'previewArticle':
            $emitter.emit('article:updateAction')
            break
        case 'deleteArticle':
            $emitter.emit('article:deleteAction')
            break
    }
    close(true)
}
</script>
