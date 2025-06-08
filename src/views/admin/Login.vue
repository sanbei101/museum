<template>
  <div class="login-container">
    <n-card class="login-card" :bordered="false">
      <div class="login-header">
        <h1>博物馆管理系统</h1>
        <p>Museum Admin System</p>
      </div>

      <n-form ref="formRef" :model="loginForm" :rules="rules">
        <n-form-item path="username" label="用户名">
          <n-input
            v-model:value="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            @keyup.enter="handleLogin" />
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password-on="mousedown"
            @keyup.enter="handleLogin" />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" size="large" :loading="loading" @click="handleLogin" block>
            登录
          </n-button>
        </n-form-item>

        <n-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          closable
          @close="errorMessage = ''" />
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
  type FormInst,
  type FormRules
} from 'naive-ui';

const router = useRouter();
const formRef = ref<FormInst | null>(null);

const loginForm = ref({
  username: '',
  password: ''
});

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  // 模拟登录延迟
  setTimeout(() => {
    if (loginForm.value.username === 'admin' && loginForm.value.password === '123456') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push({ name: RouteName.AdminDashboard });
    } else {
      errorMessage.value = '用户名或密码错误';
    }
    loading.value = false;
  }, 1000);
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 480px) {
  .login-header h1 {
    font-size: 24px;
  }
}
</style>
