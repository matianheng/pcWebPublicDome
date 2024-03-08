<template>
  <el-button :type="type" @click="onClick">
    <el-icon :class="{ 'is-loading': loading, 'mr-1': true }">
      <Loading v-if="loading" />
      <slot v-else name="icon">
        <Search />
      </slot>
    </el-icon>
    <slot>查询</slot>
  </el-button>
</template>

<script setup lang="ts">
import { Loading, Search } from '@element-plus/icons-vue'
defineOptions({ name: 'LsyLoadingButton' })

type BtnType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
defineProps<{
  loading?: boolean
  type?: BtnType
}>()

const $emits = defineEmits<{
  click: []
}>()

function onClick() {
  $emits('click')
}
</script>

<style scoped></style>
