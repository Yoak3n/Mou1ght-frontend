<template>
    <n-breadcrumb separator=">">
        <n-breadcrumb-item 
            v-for="(item, index) in $route.matched" 
            v-show="item.meta.title" 
            :key="index" @click="() => {
            $router.push(item.path)
        }">
            {{ item.meta.title }}
        </n-breadcrumb-item>
    </n-breadcrumb>

</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
const $route = useRoute();
const $router = useRouter();


</script>