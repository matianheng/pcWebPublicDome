<template>
  <div class="h-full w-full lg:flex lg:flex-col lg:justify-center bg-[#f0f2f5]">
    <div
      class="lg:rounded-md lg:shadow-md lg:w-230 lg:m-auto lg:flex lg:flex-row bg-white"
    >
      <div
        class="h-34 flex flex-col justify-center lg:flex-1 lg:w-0 lg:h-96 lg:rounded-l-md o-login-top-panel"
      >
        <div class="z-10">
          <h2 class="text-white text-5xl text-center">管理系统骨架</h2>
          <h4 class="text-white text-2xl text-center">
            灵活/简洁/实用的前端管理系统骨架
          </h4>
        </div>
      </div>
      <div class="lg:w-96">
        <h3 class="text-2xl font-bold pl-5 pt-5">用户登录</h3>
        <div class="flex flex-row justify-between pl-5 pr-5">
          <small>管理员:admin/admin</small>
          <small>普通用户:test/test</small>
        </div>
        <el-form
          ref="formRef"
          size="large"
          :model="loginData"
          label-width="auto"
          class="p-5"
        >
          <el-form-item prop="account" :rules="rule">
            <el-input
              v-model="loginData.account"
              placeholder="请输入账号"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pwd" :rules="rule">
            <el-input
              v-model="loginData.pwd"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="w-full"
              :loading="loading"
              data-test="login-btn"
              @click="onLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <canvas
    class="absolute block top-0 left-0 z-0 login-background-canvas"
  ></canvas>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { login } from '@/pages/demo/mock-api/ListApi'
import { FormInstance, FormItemRule } from 'element-plus'
import { saveLoginResult } from '@/utils/LoginUtil'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { onBeforeUnmount } from 'vue'

interface LoginDataType {
  account: string
  pwd: string
}
const rule: FormItemRule = {
  required: true,
  message: '该项必填',
}
const formRef = ref<FormInstance>()
const loginData = ref<LoginDataType>({
  account: 'admin',
  pwd: 'admin',
})
const $router = useRouter()
async function loginFormValidateCallback(isValid: boolean) {
  if (isValid) {
    const { account, pwd } = loginData.value
    const loginRet = await login(account, pwd)
    saveLoginResult(loginRet)
    // 这里之所以在$router.push方法加await是为了,防止loading状态在登录接口响应之后,路由未跳转完成之前,由true变为false
    await $router.push({ name: 'Index' })
  }
}
const { loading, run: runLoginFormValidateCallback } = useRequest(
  loginFormValidateCallback,
  { manual: true }
)
function onLogin() {
  formRef.value?.validate(runLoginFormValidateCallback)
}
onBeforeUnmount(() => {
  // Particles是登录页的粒子动画库，如果不销毁，会导致登录跳转之后界面卡顿(因为Particles会不停重绘)。ParticlesJS通过loadScript.js动态引入
  //@ts-ignore
  window.Particles && window.Particles.destroy()
})
</script>

<style scoped lang="scss">
.o-login-top-panel {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(@/assets/jpg/work.jpg);

  &::after {
    content: ' ';
    position: absolute;
    inset: 0;
    background-color: rgb(0 0 0 / 50%);
  }
}

.login-background-canvas {
  pointer-events: none;
}

@media (width >= 1024px) {
  .o-login-top-panel {
    &::after {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }
  }
}
</style>
