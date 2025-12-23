<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { NForm, NInput, NFormItem, NButton} from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const model = ref({ username: '', password: '', check: false })
let isLoading = ref(false)

const $router = useRouter()
const formRef = ref<FormInst | null>(null)

const userStore = useUserStore()
// 自定义表单验证 
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
    }
}




let showFeedback = ref(false)
const loginHandle = async () => {
    showFeedback.value = true
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
    <div class="login-card">
        <h1>Hello!</h1>
        <h2>欢迎登录~</h2>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
            <n-form-item label="用户名" path="username">
                <n-input 
                    v-model:value="model.username" placeholder="请输入您的用户名"
                    :input-props="{autocomplete: 'username'}" />
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input v-model:value="model.password" 
                    type="password" placeholder="请输入您的密码"
                    show-password-on="mousedown"
                    :input-props="{autocomplete:'current-password'}"
                    @keydown.enter="loginHandle" />
            </n-form-item>
            <!-- 添加窗口 -->
            <div style="display: flex; justify-content: flex-end">
                <n-button class="login-button" createLocalStorage type="info" @click="loginHandle" :loading="isLoading">
                    登录
                </n-button>
            </div>
        </n-form>
    </div>

</template>

<style scoped>
.login-card {
    font-size: large;
    color: #fff;
    position: relative;
    width: 80%;
    border-radius: 12px;
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

    .login-button {
        width: 100%;
    }
}
</style>