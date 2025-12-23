<template>
    <n-layout has-sider style="height: 100vh;">
        <n-layout-sider width="200" bordered>
            <Menu :path="route.path" :router-push="pushRoute"/>
        </n-layout-sider>
        <n-layout-content>
            <Main></Main>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';

import Main from '@/layout/Main.vue';
import Menu from '@/components/Nav/Menu/index.vue';
import useUserStore from '@/store/modules/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
onMounted(async()=> {
    document.title = route.meta.title as string || 'Mou1ght';
    try {
        await userStore.userInfo();
    }catch (error) {
        window.$message.error(`User not logged in ${error}`,{ duration: 2000 });
    }
})

const pushRoute = (path: string) => {
    console.log(path);
    if (path === route.path) return;
    router.push(path);
    document.title = route.meta.title as string || 'Mou1ght';
}


</script>
