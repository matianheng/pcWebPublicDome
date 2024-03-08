<template>
  <LsyContentContainer
    title="容器宽度响应式表单"
    desc="通过监听容器宽度变化, 结合 LsyContainerResponsiveWrapper.tsx 组件, 实现响应式"
    :features="[
      '使用简单，设置完响应方式后，表单项不再需要关注如何进行响应',
      '实现思路来自react的children属性，实现方式参考 el-space 组件',
      '通过监听html元素的大小变化来实现响应式(通过: ResizeObserver 监听容器的大小变化)',
      'tsx中可以获取到children属性, 该属性表示当前组件下所有一级子vnode，理论上对每个vnode包裹一个div，然后对该div进行响应式控制即可，但vue的vnode类型包含: slot，template，comment，text等，对于类似slot这类虚拟节点，对其本身包裹div无意义，需要对其子节点包裹div，对类似comment这类节点(表示注释)，对其包裹div是无意义的，因此要跳过',
    ]"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="h-full flex flex-col">
      <div class="pb-3">
        <el-card shadow="never" class="u-clear-el-card-pb">
          <template #header>
            <h3 class="font-bold">5个需填写的el-form-item</h3>
            <small>ContainerResponsiveWrapperDemo01</small>
          </template>
          <ContainerResponsiveWrapperDemo01></ContainerResponsiveWrapperDemo01>
        </el-card>
      </div>
      <div class="pb-3">
        <el-card shadow="never" class="u-clear-el-card-pb">
          <template #header>
            <h3 class="font-bold">1个需填写的el-form-item</h3>
            <small>ContainerResponsiveWrapperDemo02</small>
          </template>
          <ContainerResponsiveWrapperDemo02></ContainerResponsiveWrapperDemo02>
        </el-card>
      </div>
      <div class="pb-3">
        <el-card shadow="never" class="u-clear-el-card-pb">
          <template #header>
            <h3 class="font-bold">2个需填写的el-form-item</h3>
            <small>ContainerResponsiveWrapperDemo03</small>
          </template>
          <ContainerResponsiveWrapperDemo03></ContainerResponsiveWrapperDemo03>
        </el-card>
      </div>
      <div class="pb-3">
        <el-card shadow="never" class="u-clear-el-card-pb">
          <template #header>
            <h3 class="font-bold">4个需填写的el-form-item[动态增/减项]</h3>
            <small>ContainerResponsiveWrapperDemo04</small>
          </template>
          <ContainerResponsiveWrapperDemo04></ContainerResponsiveWrapperDemo04>
        </el-card>
      </div>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import ContainerResponsiveWrapperDemo01 from './container-responsive-wrapper-demo/ContainerResponsiveWrapperDemo01.vue'
import ContainerResponsiveWrapperDemo02 from './container-responsive-wrapper-demo/ContainerResponsiveWrapperDemo02.vue'
import ContainerResponsiveWrapperDemo03 from './container-responsive-wrapper-demo/ContainerResponsiveWrapperDemo03.vue'
import ContainerResponsiveWrapperDemo04 from './container-responsive-wrapper-demo/ContainerResponsiveWrapperDemo04.vue'

defineOptions({ name: 'ContainerResponsiveForm' })
</script>

<style scoped lang="scss"></style>
