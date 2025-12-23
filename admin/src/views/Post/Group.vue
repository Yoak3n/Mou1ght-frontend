<template>
    <div class="post-group">
        <n-grid :x-gap="24" cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
            <n-gi>
                <category-list />
            </n-gi>
            <n-gi>
                <tag-list />
            </n-gi>
        </n-grid>
    </div>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui';
import CategoryList from '@/components/List/CategoryList/index.vue';
import TagList from '@/components/List/TagList/index.vue';

</script>
