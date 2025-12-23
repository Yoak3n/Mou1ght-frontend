<template>
    <div class="container">
        <div class="header">
            <breadcrumb />
            <user-action />
        </div>
        <div class="body">
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>

</template>
<script setup lang="ts">
import Breadcrumb from '@/components/Nav/Breadcrumb/index.vue'
import UserAction from '@/components/Nav/UserAction/index.vue'

</script>

<style scoped>
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.5s ease-in-out;
}

.fade-enter-to {
    opacity: 1;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px 0 16px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        display: block;
        height: 1px;
        width: 100%;
        background-color: #e8e8e8;
        bottom: -.5rem;
    }
}

.body {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
}
</style>