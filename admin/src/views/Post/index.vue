<template>
  <div>
    <div class="post-index" v-if="$route.name === 'post'">
      <div class="post-content">
        <n-grid :x-gap="12" :y-gap="12" cols="3 s:1 m:2 l:3 xl:3 2xl:3" responsive="screen">
          <n-gi>
            <n-card title="文章管理" hoverable :header-style="{cursor:'pointer'}"  @click="handleCardClick('article')">
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="说说管理" hoverable :header-style="{cursor:'pointer'}" @click="handleCardClick('sharing')">
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="留言管理" hoverable :header-style="{cursor:'pointer'}" @click="handleCardClick('message')">
            </n-card>
          </n-gi>
        </n-grid>
      </div>
      <n-divider />
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
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

import { NGrid, NGi, NCard, NDivider } from 'naive-ui';

import CategoryList from '@/components/List/CategoryList/index.vue';
import TagList from '@/components/List/TagList/index.vue';


const $router = useRouter();
const $route = useRoute();


const handleCardClick = (name: string) => {
    $router.push({ name});
}
</script>

<style scoped></style>
