<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import NaiveProvider from '@/components/Provider/NaiveProvider.vue'
</script>

<template>
    <n-config-provider>
        <NaiveProvider>
            <router-view></router-view>
        </NaiveProvider>
    </n-config-provider>
</template>

<style scoped></style>
