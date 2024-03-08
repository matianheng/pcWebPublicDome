<template>
  <LsyContentContainer
    title="标签页操作"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <el-button @click="onCloseCur">关闭当前标签并转入/打开其他标签</el-button>
    <el-button @click="onCreateTab">手动打开标签并转入</el-button>
    <el-button @click="onCloseOther">关闭其他标签页</el-button>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import {
  emitCloseCurAndToRoute,
  emitOpenTabAndToRoute,
  emitCloseOther,
} from '@/components/lsy/router-tabs/LsyRouterTabsKeepAliveWrapperEventUtil'

function onCloseCur() {
  emitCloseCurAndToRoute({
    name: 'ElResponsiveForm',
  })
}
function onCreateTab() {
  emitOpenTabAndToRoute({ name: 'ContainerResponsiveForm' })
}
function onCloseOther() {
  emitCloseOther()
}
</script>

<style scoped></style>
