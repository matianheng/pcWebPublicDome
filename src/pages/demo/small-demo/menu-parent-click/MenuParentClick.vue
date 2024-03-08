<template>
  <LsyContentContainer :fit-all-content="true">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @select="handleSelect"
    >
      <el-sub-menu index="1">
        <template #title>
          <MenuParentSlot>Navigator One</MenuParentSlot>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><MenuParentSlot>item four</MenuParentSlot></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <span>Navigator Two</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <span>Navigator Three</span>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <span>Navigator Four</span>
      </el-menu-item>
    </el-menu>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import MenuParentSlot from './MenuParentSlot.vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

function handleSelect() {
  ElMessage.success('handleSelect')
}
</script>

<style scoped></style>
