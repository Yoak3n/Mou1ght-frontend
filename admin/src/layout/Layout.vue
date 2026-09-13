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
        if (route.path !== '/entry') {
            router.replace('/entry');
        }
    }
    prefetchRoutes()
})

// 空闲时预取各页面的懒加载 chunk，消除首次切换菜单时的短暂卡顿
const prefetchRoutes = () => {
    const idle = (cb: () => void) => {
        const w = window as any
        if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(cb, { timeout: 5000 })
        else window.setTimeout(cb, 2000)
    }
    idle(() => {
        import('@/views/Post/Article.vue')
        import('@/views/Post/Sharing.vue')
        import('@/views/Post/Message.vue')
        import('@/views/Post/Attachment.vue')
        import('@/views/Post/Group.vue')
        import('@/views/Settings.vue')
        import('@/views/Profile.vue')
    })
}

const pushRoute = (path: string) => {
    if (path === route.path) return;
    router.push(path);
    document.title = route.meta.title as string || 'Mou1ght';
}


</script>
