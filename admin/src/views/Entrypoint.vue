<template>
    <div class="wrapper">
        <div class="card">
            <n-tabs size="large" default-value="login" animated v-model:value="key">
                <n-tab-pane name="login" tab="登录">
                    <Login />
                </n-tab-pane>
                <n-tab-pane  name="register" tab="注册">
                    <Register />
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { NTabs, NTabPane } from 'naive-ui';
import Login from '../components/Form/Login.vue'
import Register from '../components/Form/Register.vue'
import { ref } from 'vue';
const key = ref('login');
const route = useRoute();
if (route.query.type === 'register') {
    key.value = 'register';
}

</script>

<style scoped>
.wrapper {
    background-color: #def;
    background-size: cover;
    height: 100vh;

    .card {
        font-size: large;
        color: #fff;
        position: relative;
        width: 80%;
        top: 30vh;
        background: linear-gradient(#89cffa, #def8);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
}
</style>
