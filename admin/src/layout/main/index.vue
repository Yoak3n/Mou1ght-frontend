<template>
  <n-flex justify="space-between">
    <breadcrumb />
    <user-action />
  </n-flex>

  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { NFlex} from 'naive-ui';
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import UserAction from '@/components/UserAction/index.vue'

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
</style>