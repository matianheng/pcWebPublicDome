<template>
  <LsyContentContainer
    title="component is 实现分步表单"
    desc="分享分步表单常见开发套路"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">基于 component is 实现</h3>
          <small>StepFormDemo01</small>
        </template>
        <div class="flex flex-col">
          <small class="mb-1">
            * 各个分步表单组件，应该通过prop方式(通过vuex和pinia方式也可
            [这里实际强调的通过外部注入数据来对表单进行初始化])，设置表单初始值
            (如果：某个表单的数据验证需要，需要之前的表单数据，那也应该通过prop传入)
          </small>
          <small class="mb-1">
            * 各个分步表单组件，应该通过 defineExpose
            方式(vuex或pinia方式也可)，将 elForm 实例以及表单数据暴露给外部
          </small>
          <small class="mb-1">
            *
            建议在分步表单之外实现从后端获取分步表单的初始数据，以及将分步表单数据提交到后端
          </small>
          <small class="mb-5">
            * 事情都给外部做了，那各个分步表单组件本身做啥呢?
            个人认为：分步表单内部的主要关注点，应该是表单项的数据验证逻辑，以及对于复杂表单项，自行实现内部数据的获取(如：select的选项数据，树菜单数据等这类表单项的选项数据)
          </small>
          <StepFormDemo01></StepFormDemo01>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">基于 component is和keep-alive 实现</h3>
          <small>StepFormDemo02</small>
        </template>
        <div class="flex flex-col">
          <small class="mb-5">
            * 可以在未保存表单数据的情况下，保持已填写的表单数据
          </small>
          <StepFormDemo02></StepFormDemo02>
        </div>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import StepFormDemo01 from './step-form-demo/StepFormDemo01.vue'
import StepFormDemo02 from './step-form-demo/StepFormDemo02.vue'

defineOptions({ name: 'StepFormExample' })
</script>

<style scoped></style>
