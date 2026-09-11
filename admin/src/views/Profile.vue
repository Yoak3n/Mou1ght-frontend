<template>
    <n-space vertical size="large">
        <n-card title="用户资料">
            <n-form ref="profileFormRef" :model="profileModel" :rules="profileRules" label-placement="left" label-width="auto">
                <n-form-item label="用户名" path="username">
                    <n-input v-model:value="profileModel.username" placeholder="请输入用户名" />
                </n-form-item>
                <n-form-item label="邮箱" path="email">
                    <n-input v-model:value="profileModel.email" placeholder="请输入邮箱" />
                </n-form-item>
                <n-form-item label="手机号" path="phone">
                    <n-input v-model:value="profileModel.phone" placeholder="请输入手机号" />
                </n-form-item>
                <n-form-item label="头像地址" path="avatar">
                    <n-input v-model:value="profileModel.avatar" placeholder="请输入头像图片地址" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" :loading="savingProfile" @click="saveProfile">保存资料</n-button>
                </n-form-item>
            </n-form>
        </n-card>

        <n-card title="修改密码">
            <n-form ref="passwordFormRef" :model="passwordModel" :rules="passwordRules" label-placement="left" label-width="auto">
                <n-form-item label="原密码" path="old_password">
                    <n-input v-model:value="passwordModel.old_password" type="password" show-password-on="mousedown" placeholder="请输入原密码" />
                </n-form-item>
                <n-form-item label="新密码" path="new_password">
                    <n-input v-model:value="passwordModel.new_password" type="password" show-password-on="mousedown" placeholder="至少 6 位" />
                </n-form-item>
                <n-form-item label="确认新密码" path="confirm_password">
                    <n-input v-model:value="passwordModel.confirm_password" type="password" show-password-on="mousedown" placeholder="再次输入新密码" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" :loading="savingPassword" @click="savePassword">修改密码</n-button>
                </n-form-item>
            </n-form>
        </n-card>
    </n-space>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton, NSpace } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import useUserStore from '@/store/modules/user';
import { updateProfile, changePassword } from '@/api/user';

const userStore = useUserStore();

const profileModel = reactive({
    username: '',
    email: '',
    phone: '',
    avatar: '',
});
const profileRules: FormRules = {
    username: { required: true, message: '请输入用户名', trigger: ['input', 'blur'] },
    email: { required: true, message: '请输入邮箱', trigger: ['input', 'blur'] },
};
const profileFormRef = ref<FormInst | null>(null);
const savingProfile = ref(false);

const saveProfile = () => {
    profileFormRef.value?.validate(async (errors) => {
        if (errors) return;
        savingProfile.value = true;
        try {
            const res = await updateProfile({
                username: profileModel.username.trim(),
                email: profileModel.email.trim(),
                phone: profileModel.phone.trim(),
                avatar: profileModel.avatar.trim(),
            });
            if (res.code === 0) {
                userStore.info = res.data.user;
                window.$message.success('资料已保存');
            } else {
                window.$message.error(res.message || '保存失败');
            }
        } catch (e: any) {
            window.$message.error(typeof e === 'string' ? e : e?.message || '保存失败');
        } finally {
            savingProfile.value = false;
        }
    });
};

const passwordModel = reactive({
    old_password: '',
    new_password: '',
    confirm_password: '',
});
const passwordRules: FormRules = {
    old_password: { required: true, message: '请输入原密码', trigger: ['input', 'blur'] },
    new_password: {
        required: true,
        validator: (_rule, value: string) => {
            if (!value) return new Error('请输入新密码');
            if (value.length < 6) return new Error('新密码至少 6 位');
            return true;
        },
        trigger: ['input', 'blur'],
    },
    confirm_password: {
        required: true,
        validator: (_rule, value: string) => {
            if (!value) return new Error('请再次输入新密码');
            if (value !== passwordModel.new_password) return new Error('两次输入不一致');
            return true;
        },
        trigger: ['input', 'blur'],
    },
};
const passwordFormRef = ref<FormInst | null>(null);
const savingPassword = ref(false);

const savePassword = () => {
    passwordFormRef.value?.validate(async (errors) => {
        if (errors) return;
        savingPassword.value = true;
        try {
            const res = await changePassword({
                old_password: passwordModel.old_password,
                new_password: passwordModel.new_password,
            });
            if (res.code === 0) {
                window.$message.success('密码已修改');
                passwordModel.old_password = '';
                passwordModel.new_password = '';
                passwordModel.confirm_password = '';
            } else {
                window.$message.error(res.message || '修改失败');
            }
        } catch (e: any) {
            window.$message.error(typeof e === 'string' ? e : e?.message || '修改失败');
        } finally {
            savingPassword.value = false;
        }
    });
};

onMounted(async () => {
    try {
        await userStore.userInfo();
    } catch {
        // 未登录时由路由守卫处理
        return;
    }
    const info = userStore.info;
    if (info) {
        profileModel.username = info.username || '';
        profileModel.email = info.email || '';
        profileModel.phone = info.phone || '';
        profileModel.avatar = info.avatar || '';
    }
});
</script>

<style scoped></style>
