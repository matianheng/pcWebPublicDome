<template>
  <div>
    <el-button @click="build">加水印</el-button>
    <el-button @click="clear">去除水印</el-button>
  </div>
</template>

<script setup lang="ts">
import { watermarkBuilder } from '@/components/lsy/watermark'

const { build, clear } = watermarkBuilder({
  text: '管理系统骨架',
  width: 235,
  height: 70,
  fontSize: 16,
  fontFamily: 'Microsoft Yahei',
  color: '#ffe7ba',
  angle: -20,
  zIndex: 999,
  position: 'absolute',
  textAlign: 'right',
  textBaseline: 'alphabetic',
  x: 90,
  y: 50,
})
</script>

<style scoped></style>
