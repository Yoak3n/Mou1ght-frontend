<template>
    <n-dropdown 
    trigger="manual"
    :show="showDropdown"
    @select="handleSelect"
    @clickoutside="showDropdown = false"
    :options="options">
      <n-button text
      @click="showDropdown = !showDropdown">
        <template #icon>
          <n-icon size="28">
            <PersonCircleSharp />
          </n-icon>
        </template>
      </n-button>
    </n-dropdown>

</template>

<script setup lang="ts">
import { ref} from 'vue'
import {NButton,NDropdown,NIcon } from 'naive-ui';
import {
  PersonCircleSharp
}from '@vicons/ionicons5'
const options = [
  {
    label: '用户资料',
    key: 'profile',
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
  },
  {
    label: '退出登录',
    key: 'logout',
  }
]

let showDropdown = ref(false)
const handleSelect = (key: string) => {
  console.log(key);
}

</script>