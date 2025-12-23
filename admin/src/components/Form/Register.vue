<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NInput, NFormItem, NButton, NGrid, NGi } from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';

const userStore = useUserStore()
const $router = useRouter()
const model = ref({ username: '', password: '', repeat_password: '', email: '' })
let isLoading = ref(false)

const formRef = ref<FormInst | null>(null)
let rules: FormRules = {
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
                window.$notification.error({
                    content: (error as Error).message,
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
    <div class="register-card">
        <h1>Hello!</h1>
        <h2>欢迎来到Mou1ght~</h2>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
            <n-form-item label="用户名" path="username">
                <n-input v-model:value="model.username" placeholder="请输入您的用户名" />
            </n-form-item>
            <n-form-item label="邮箱" path="email" show-require-mark>
                <n-input v-model:value="model.email" placeholder="请输入您的邮箱" :input-props="{autocomplete:'off'}" />
            </n-form-item>
            <n-form-item label="密码" path="password" show-require-mark >
                <n-input 
                    v-model:value="model.password" type="password"
                    placeholder="请输入您的密码"
                    :input-props="{autocomplete:'new-password'}"
                    show-password-on="mousedown" />
            </n-form-item>
            <n-form-item label="确认密码" path="repeat_password" show-require-mark >
                <n-input v-model:value="model.repeat_password" type="password" placeholder="请再次输入密码"
                    :input-props="{autocomplete:'new-password'}"
                    show-password-on="mousedown" />
            </n-form-item>

            <!-- 添加窗口 -->
            <div style="display: flex; justify-content: flex-end">
                <n-button class="register-button" createLocalStorage type="primary" :loading="isLoading"
                    @click="registerHandle">
                    注册
                </n-button>
            </div>
        </n-form>
    </div>
</template>

<style scoped>
.register-card {
    font-size: large;
    color: #fff;
    position: relative;
    width: 80%;
    border-radius: 8px;
    padding: 40px;
    margin: 0 auto;

    h1 {
        color: white;
        font-size: 40px;
    }

    h2 {
        font-size: 20px;
        color: #fff;
        margin: 20px 0;
    }

    .register-button {
        width: 100%;
    }
}
</style>