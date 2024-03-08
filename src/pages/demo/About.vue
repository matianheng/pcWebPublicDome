<template>
  <LsyContentContainer
    title="关于"
    desc="`管理系统骨架` 项目基于Vue3 + Vite+TypeScript + Element-Plus + Tailwindcss开发, 兼容PC和移动端. 目标是帮助开发者快速开始这类系统的开发, 并提供开发常用示例, 包含详细的代码注释与文档说明, 且基于MIT协议, 完全开源, 完全免费, 让您用的放心, 更舒心。"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">联系作者</h3>
        </template>
        <div class="flex flex-col">
          <div><strong class="mr-2">作者</strong><span>coder_pan</span></div>
          <div>
            <strong class="mr-2">邮箱</strong><span>sd4015700@126.com</span>
          </div>
          <div><strong class="mr-2">微信</strong><span>coder_pan</span></div>
          <div>
            <strong class="mr-2">说明</strong>
            <span>合作机会/交流学习都可联系我</span>
          </div>
          <div>
            <strong class="mr-2">源码</strong>
            <el-link
              href="https://gitee.com/free_pan/archetype-backend-template"
            >
              https://gitee.com/free_pan/archetype-backend-template
            </el-link>
          </div>
          <div>
            <strong class="mr-2">文档</strong>
            <el-link
              href="https://free_pan.gitee.io/archetype-backend-template-doc/"
            >
              https://free_pan.gitee.io/archetype-backend-template-doc/
            </el-link>
          </div>
          <div>
            <strong class="mr-2">视频</strong>
            <el-link href="https://www.bilibili.com/video/BV1v64y1V7to">
              https://www.bilibili.com/video/BV1v64y1V7to
            </el-link>
          </div>
          <div class="flex flex-col md:flex-row md:justify-around">
            <div class="flex flex-col text-center mt-4 mb-4 md:ml-4 md:mr-4">
              <img src="@/assets/my-wx.jpg" />
              <small>微信</small>
            </div>
            <div class="flex flex-col text-center md:mt-4">
              <img src="@/assets/doc-code.png" />
              <small>文档地址</small>
            </div>
            <div class="flex flex-col text-center md:mt-4">
              <img src="@/assets/home-code.png" />
              <small>预览地址</small>
            </div>
            <div class="flex flex-col text-center md:mt-4">
              <img src="@/assets/video.png" />
              <small>视频地址</small>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">项目信息</h3>
        </template>
        <div class="text-center font-extrabold mb-3">{{ name }}</div>
        <div class="flex flex-col lg:flex-row">
          <div class="md:w-1/2 mb-1 flex flex-row">
            <strong>打包</strong>
            <span class="ml-2">{{ lastBuildTime }}</span>
          </div>
          <div class="md:w-1/2">
            <strong>版本</strong>
            <span class="ml-2">{{ version }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">生产依赖</h3>
        </template>
        <div class="flex flex-row flex-wrap">
          <div
            v-for="entries of dependenciesEntries"
            :key="entries[0]"
            class="flex flex-row w-[100%] lg:w-1/3"
          >
            <strong>{{ entries[0] }}&nbsp;</strong>
            <span>{{ entries[1] }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card>
        <template #header>
          <h3 class="font-bold">开发依赖</h3>
        </template>
        <div class="flex flex-row flex-wrap">
          <div
            v-for="entries of devDependenciesEntries"
            :key="entries[0]"
            class="flex flex-row w-[100%] lg:w-1/2"
          >
            <strong>{{ entries[0] }}&nbsp;</strong>
            <span>{{ entries[1] }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
// @ts-ignore
// eslint-disable-next-line
const { pkg, lastBuildTime } = __APP_INFO__
const { dependencies, devDependencies, name, version } = pkg
const dependenciesEntries = Object.entries(dependencies)
const devDependenciesEntries = Object.entries(devDependencies)
</script>

<style scoped></style>
