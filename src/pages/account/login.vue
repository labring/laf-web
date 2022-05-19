<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import * as useraApi from '~/api/user'
import * as auth from '~/utils/auth'

const loading = $ref(false)
const loginFormRef = $ref<FormInstance>()
const loginForm = $ref({
  username: '',
  password: '',
})
const loginRules = {
  username: [
    { required: true, message: 'Please input your username!' },
  ],
  password: [
    { required: true, message: 'Please input your password!' },
  ],
}
const login = async (loginEl: FormInstance | undefined) => {
  if (!loginEl)
    return

  loginEl.validate(async (valid) => {
    if (!valid)
      return

    const { username, password } = loginForm

    const res = await useraApi.login({ username: username.trim(), password }) as any

    if (res.error) {
      ElMessage({
        message: res.error,
        type: 'error',
      })
      return
    }
    auth.setToken(res.data.access_token, res.data.expire)
  })
}

const router = useRouter()
const goRegister = () => {
  router.push('/account/register')
}
</script>

<template>
  <el-card w-sm mt-20 ma>
    <template #header>
      <div flex justify-between items-center>
        <span text-4>LAF 云开发账户登录</span>
        <el-button
          type="primary"
          text
          @click="goRegister"
        >
          去注册？
        </el-button>
      </div>
    </template>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      label-width="100px"
      label-position="top"
      :rules="loginRules"
      autocomplete="off"
    >
      <el-form-item label="账户" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账户名" />
      </el-form-item>
      <el-form-item label="密码" mt-6 prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item mt-10>
        <el-button
          type="success"
          plain
          w-screen
          :loading="loading"
          @click="login(loginFormRef)"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
