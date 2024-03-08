<template>
  <div class="h-full flex flex-row">
    <div
      class="h-full flex flex-col justify-center pl-4 pr-3"
      @click="onToggleFullScreen"
    >
      <div class="cursor-pointer h-5">
        <el-icon :size="20"><FullScreen /></el-icon>
      </div>
    </div>
    <div class="h-full flex flex-col justify-center pl-4 pr-3">
      <el-badge is-dot class="o-system-bell-item cursor-pointer">
        <el-icon :size="20"><Bell /></el-icon>
      </el-badge>
    </div>
    <el-dropdown
      class="h-full pl-1 pr-5 o-custom-dropdown"
      popper-class="o-system-toolbar-dropdown"
      @command="onCommand"
    >
      <div class="h-full flex flex-row justify-center">
        <div class="flex flex-row self-center">
          <el-avatar
            :size="28"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="flex flex-col justify-center pl-2 o-nike-name">张三</div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="userDetail">
            <el-icon><User /></el-icon>
            <span>用户详情</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出</span>
          </el-dropdown-item>
          <el-dropdown-item command="settings">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ThemeLayoutSettingsDialog
      v-model:visible="settingsDialogVisible"
    ></ThemeLayoutSettingsDialog>
  </div>
</template>

<script setup lang="ts">
import {
  Bell,
  FullScreen,
  SwitchButton,
  User,
  Setting,
} from '@element-plus/icons-vue'
import { clearLoginData } from '@/utils/LoginUtil'
import { ref } from 'vue'
import { toggleFullscreen } from '@/utils/FullScreenUtil'

defineOptions({ name: 'LsyHeaderToolbar' })

const settingsDialogVisible = ref<boolean>(false)
function onCommand(command: string | number | object) {
  if (command === 'logout') {
    clearLoginData()
    // 这里是为了清除 pinia 中的数据，然后路由守卫会负责跳转到登录页
    window.location.reload()
  } else if (command === 'settings') {
    settingsDialogVisible.value = true
  }
}
function onToggleFullScreen() {
  toggleFullscreen(document.documentElement, false)
}
</script>

<style lang="scss">
.o-system-toolbar-dropdown {
  margin-top: -0.5rem !important;

  .el-popper__arrow {
    display: none;
  }
}

.o-system-bell-item {
  top: 0.25rem;
}

.o-custom-dropdown {
  &:focus-visible {
    border: none;
    outline: none;
  }

  &:focus {
    border: none;
    outline: none;
  }

  > div:focus-visible {
    border: none;
    outline: none;
  }
}
</style>
