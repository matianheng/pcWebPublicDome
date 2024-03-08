<template>
  <LsyContentContainer title="通过自定义指令鉴权" :enable-toc="true">
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">html的button</h3>
        </template>
        <button
          v-permission="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限则禁用)
        </button>
        <button
          v-permission:hidden="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 mt-3 mb-3"
          @click="sayHello"
        >
          权限按钮(没权限则隐藏)
        </button>
        <button
          v-permission:tips="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限给出tips提示)
        </button>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">html的a</h3>
        </template>
        <a
          v-permission="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 cursor-pointer"
          @click="sayHello"
        >
          权限按钮(没权限则禁用)
        </a>
        <a
          v-permission:hidden="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 mt-3 mb-3 cursor-pointer"
          @click="sayHello"
        >
          权限按钮(没权限则隐藏)
        </a>
        <a
          v-permission:tips="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 cursor-pointer"
          @click="sayHello"
        >
          权限按钮(没权限给出tips提示)
        </a>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">html的span</h3>
        </template>
        <span
          v-permission="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限则禁用)
        </span>
        <span
          v-permission:hidden="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 mt-3 mb-3"
          @click="sayHello"
        >
          权限按钮(没权限则隐藏)
        </span>
        <span
          v-permission:tips="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限给出tips提示)
        </span>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">el-button</h3>
        </template>
        <el-button
          v-permission="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限则禁用)
        </el-button>
        <el-button
          v-permission:hidden="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3 mt-3 mb-3"
          @click="sayHello"
        >
          权限按钮(没权限则隐藏)
        </el-button>
        <el-button
          v-permission:tips="'add'"
          class="block border-4 border-red-200 border-solid rounded-md p-3"
          @click="sayHello"
        >
          权限按钮(没权限给出tips提示)
        </el-button>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">自定义按钮</h3>
        </template>
        <MyButton v-permission="'add'" @click="sayHello">
          权限按钮(没权限则禁用)
        </MyButton>
        <MyButton v-permission:hidden="'add'" @click="sayHello">
          权限按钮(没权限则隐藏)
        </MyButton>
        <MyButton v-permission:tips="'add'" @click="sayHello">
          权限按钮(没权限给出tips提示)
        </MyButton>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import MyButton from './MyButton.vue'
import { vPermission } from '@/directive/vPermission'

function sayHello() {
  ElMessage({
    showClose: true,
    message: '我执行了点击事件',
    type: 'success',
  })
}
</script>

<style scoped></style>
