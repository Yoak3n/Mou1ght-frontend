<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { NForm, NInput, NFormItem, NButton } from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const model = ref({ username: '', password: '', check: false })
const isLoading = ref(false)

const $router = useRouter()
const formRef = ref<FormInst | null>(null)

const userStore = useUserStore()
const rules: FormRules = {
    username: {
        required: true,
        message: '请输入用户名',
        trigger: ['input'],
    },
    password: {
        required: true,
        validator(_: FormItemRule, value: string) {
            if (!value) {
                return new Error("请输入密码")
            } else if (value.length < 6) {
                return new Error("请输入至少6位密码")
            } else {
                return true
            }
        },
        trigger: ['input', 'blur'],
    }
}

const loginHandle = async () => {
    isLoading.value = true
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // 处理登录逻辑
            const res = await userStore.userLogin({
                username: model.value.username,
                password: model.value.password,
            })
            isLoading.value = false
            if (res) {
                // 登录成功跳转首页
                $router.push('/')
            }
        } else {
            isLoading.value = false
        }
    })
}
</script>

<template>
    <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false" size="large">
        <n-form-item label="用户名" path="username">
            <n-input
                v-model:value="model.username" placeholder="请输入用户名"
                :input-props="{ autocomplete: 'username' }"
            />
        </n-form-item>
        <n-form-item label="密码" path="password">
            <n-input v-model:value="model.password"
                type="password" placeholder="请输入密码"
                show-password-on="mousedown"
                :input-props="{ autocomplete: 'current-password' }"
                @keydown.enter="loginHandle"
            />
        </n-form-item>
        <n-button class="submit-btn" type="primary" block size="large" :loading="isLoading" @click="loginHandle">
            登 录
        </n-button>
    </n-form>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px;
    font-weight: 600;
    letter-spacing: 2px;
}
</style>
