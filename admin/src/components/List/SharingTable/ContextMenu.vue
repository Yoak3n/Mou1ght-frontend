<template>
    <n-dropdown 
    :x="x" :y="y" 
    :options="contextMenuOptions" 
    :show="show" @clickoutside="()=>close(false)" @select="contextMenuHandler"/>
</template>

<script setup lang="ts">
import { NDropdown } from 'naive-ui';
import $emitter from '@/bus'
import { contextMenuOptions } from '.';
const {x,y, close} = defineProps<{
    x: number,
    y: number,
    show: boolean,
    close: (m:boolean)=> void
}>()

const contextMenuHandler = (key: string) => {
    switch (key){
        // case 'updateArticle':
        //     $emitter.emit('article:updateAction')
        //     break
        case 'previewSharing':
            $emitter.emit('sharing:previewAction')
            break
        case 'deleteSharing':
            $emitter.emit('sharing:deleteAction')
            break
    }
    close(true)
}
</script>