<template>
  <LsyContentContainer
    title="基于el layout实现响应式表单"
    desc="<a target='_blank' class='text-blue-500' href='https://element-plus.gitee.io/zh-CN/component/layout.html'>el layout</a> 基于 el-row/el-col 实现响应式布局, 响应式断点与 <a target='_blank' class='text-blue-500' href='https://v5.bootcss.com/docs/layout/breakpoints/#available-breakpoints'>Bootstrap</a> 一致"
    :features="['实现灵活，基于屏幕分辨率进行响应式断点, 有较强的扩展能力']"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="h-full flex flex-col">
      <el-card shadow="never" class="u-clear-el-card-pb">
        <el-form label-width="auto">
          <el-row :gutter="20">
            <!-- 
              xs,sm,md,lg 说明

              1. 在超小屏幕(xs)el-col占据24栅格(效果:1列布局)
              2. 在小屏幕(sm)和中等屏幕(md)el-col占据12栅格(效果:2列布局)
              3. 在小屏幕(lg)屏幕el-col占据8栅格(效果:3列布局)
            -->
            <el-col :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item label="用户账号">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item label="组织机构">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="expand" :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item label="手机号"> <el-input></el-input> </el-form-item
            ></el-col>
            <el-col v-if="expand" :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item label="邮箱">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="expand" :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item label="创建时间">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8">
              <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button>重置</el-button>
                <el-link type="primary" class="ml-3" @click="onToggle">
                  {{ toggleText }}
                </el-link>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'ElResponsiveForm' })

const expand = ref(false)
const toggleText = computed(() => (expand.value ? '收缩' : '展开'))
function onToggle() {
  expand.value = !expand.value
}
</script>

<style scoped></style>
