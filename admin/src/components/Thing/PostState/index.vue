<template>
    <div>
        字数：{{ state.length }}
    </div>
    <div>
        阅读： {{ state.view }}
    </div>
    <div>
        状态： {{ state.status }}
    </div>
</template>

<script setup lang="ts">
import type { PostState } from '@/types';

const { state } = defineProps<{ state: PostState }>()

</script>

<style scoped></style>