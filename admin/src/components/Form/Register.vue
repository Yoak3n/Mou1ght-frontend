<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NInput, NFormItem, NButton } from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';

const userStore = useUserStore()
const $router = useRouter()
const model = ref({ username: '', password: '', repeat_password: '', email: '' })
const isLoading = ref(false)

const formRef = ref<FormInst | null>(null)
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
    },
    repeat_password: {
        required: true,
        validator(_: FormItemRule, value: string) {
            if (!value) {
                return new Error("请再次输入密码")
            } else if (value !== model.value.password) {
                return new Error("两次密码输入不一致")
            } else {
                return true
            }
        },
        trigger: ['input', 'blur'],
    },
    email: {
        required: true,
        validator(_: FormItemRule, value: string) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value) {
                return new Error("请输入邮箱")
            } else if (!emailRegex.test(value)) {
                return new Error("请输入有效的邮箱地址")
            } else {
                return true
            }
        },
        trigger: ['blur']
    }
}

const registerHandle = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            isLoading.value = true
            try {
                await userStore.userRegister({
                    username: model.value.username,
                    password: model.value.password,
                    email: model.value.email,
                })
                $router.push('/')
            } catch (error) {
                // 请求拦截器 reject 的是错误信息字符串，Error 对象则取其 message
                const message = typeof error === 'string' ? error : (error as Error)?.message || '注册失败'
                window.$notification.error({
                    content: message,
                    duration: 2500,
                    closable: false,
                })
            } finally {
                model.value.username = ''
                model.value.password = ''
                isLoading.value = false
            }
        }
    })
}
</script>

<template>
    <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false" size="large">
        <n-form-item label="用户名" path="username">
            <n-input v-model:value="model.username" placeholder="请输入您的用户名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email" show-require-mark>
            <n-input v-model:value="model.email" placeholder="请输入您的邮箱" :input-props="{ autocomplete: 'off' }" />
        </n-form-item>
        <n-form-item label="密码" path="password" show-require-mark>
            <n-input v-model:value="model.password" type="password"
                placeholder="请输入您的密码"
                :input-props="{ autocomplete: 'new-password' }"
                show-password-on="mousedown" />
        </n-form-item>
        <n-form-item label="确认密码" path="repeat_password" show-require-mark>
            <n-input v-model:value="model.repeat_password" type="password" placeholder="请再次输入密码"
                :input-props="{ autocomplete: 'new-password' }"
                show-password-on="mousedown" />
        </n-form-item>
        <n-button class="submit-btn" type="primary" block size="large" :loading="isLoading" @click="registerHandle">
            注 册
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
