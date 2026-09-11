<template>
    <div class="entry-wrapper">
        <!-- 背景装饰光斑 -->
        <div class="entry-bg" aria-hidden="true">
            <div class="bg-blob blob-1"></div>
            <div class="bg-blob blob-2"></div>
            <div class="bg-blob blob-3"></div>
        </div>

        <div class="entry-card">
            <div class="entry-brand">
                <div class="entry-logo">M</div>
                <h1 class="entry-title">Mou1ght</h1>
                <p class="entry-subtitle">个人博客 · 内容管理系统</p>
            </div>

            <n-tabs v-model:value="key" type="segment" animated size="large" class="entry-tabs">
                <n-tab-pane name="login" tab="登录">
                    <Login />
                </n-tab-pane>
                <n-tab-pane v-if="registrationOpen" name="register" tab="注册">
                    <Register />
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NTabs, NTabPane } from 'naive-ui';
import Login from '../components/Form/Login.vue'
import Register from '../components/Form/Register.vue'
import { getRegisterStatus } from '@/api/user';

const key = ref('login');
const route = useRoute();
// 注册仅在没有任何用户时开放（首个账号引导），已初始化环境隐藏注册入口
const registrationOpen = ref(false);

onMounted(async () => {
    try {
        const res = await getRegisterStatus();
        registrationOpen.value = res.data.open;
    } catch {
        registrationOpen.value = false;
    }
    if (route.query.type === 'register' && registrationOpen.value) {
        key.value = 'register';
    }
});
</script>

<style scoped>
.entry-wrapper {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: linear-gradient(135deg, #0f172a 0%, #16324f 55%, #2d5a8e 100%);
    overflow: hidden;
}

.entry-bg {
    position: absolute;
    inset: 0;
}

.bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.35;
}

.blob-1 {
    width: 420px;
    height: 420px;
    background: #3b82f6;
    top: -120px;
    left: -100px;
}

.blob-2 {
    width: 380px;
    height: 380px;
    background: #8b5cf6;
    bottom: -120px;
    right: -90px;
}

.blob-3 {
    width: 260px;
    height: 260px;
    background: #06b6d4;
    top: 38%;
    left: 60%;
    opacity: 0.22;
}

.entry-card {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
    padding: 40px 36px 32px;
}

.entry-brand {
    text-align: center;
    margin-bottom: 26px;
}

.entry-logo {
    width: 52px;
    height: 52px;
    margin: 0 auto 14px;
    border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: #fff;
    font-size: 26px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
}

.entry-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.entry-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 6px;
}

.entry-tabs :deep(.n-tabs-nav) {
    justify-content: center;
}
</style>
