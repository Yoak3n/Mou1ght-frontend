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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NDropdown, NIcon } from 'naive-ui';
import { PersonCircleSharp } from '@vicons/ionicons5'
import useUserStore from '@/store/modules/user';

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

const router = useRouter();
const userStore = useUserStore();
const showDropdown = ref(false);

const handleSelect = (key: string) => {
  showDropdown.value = false;
  switch (key) {
    case 'profile':
    case 'editProfile':
      router.push('/profile');
      break;
    case 'logout':
      userStore.userLogout()
        .then(() => router.push('/entry'))
        .catch((e: any) => {
          const msg = typeof e === 'string' ? e : e?.message || '退出失败';
          window.$message.error(msg);
        });
      break;
  }
}

</script>
