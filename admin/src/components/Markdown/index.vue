<template>
    <MKEditor 
    :value="content" :plugins="plugins" 
    @change="(v:string)=>content=v"/>
    <slot />
</template>

<script lang="ts" setup>
import gfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.css'
// @ts-ignore
import  { Editor as MKEditor} from '@bytemd/vue-next'
const content = defineModel<string>('content', {
  default: '',
})
const plugins = [gfm()]
</script>

<style>
.bytemd {
    height: 50vh !important;
    .CodeMirror-lines{
        max-width: 100% !important;
    }
    .markdown-body{
        max-width: 100% !important
    }
}
</style>
