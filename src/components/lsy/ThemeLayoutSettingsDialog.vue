<template>
  <el-dialog
    v-model="visibleComputed"
    title="设置"
    :append-to-body="true"
    modal-class="o-lsy-dialog"
  >
    <div class="flex flex-col">
      <div class="flex flex-row">
        <strong class="h-8 leading-8 mr-3">布局类型</strong>
        <el-radio-group v-model="layoutType">
          <el-radio label="Left-Top-Bottom">左右</el-radio>
          <el-radio label="Top-Bottom">上下</el-radio>
          <el-radio label="Top-Left-Right">混合</el-radio>
        </el-radio-group>
      </div>
      <div class="flex flex-row">
        <strong class="h-8 leading-8 mr-3">启用多标签</strong>
        <el-radio-group v-model="enableRouterTab">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="visibleComputed = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useLsyLayoutStore } from '@/store/LsyLayoutStore'
import { storeToRefs } from 'pinia'
import { toRefs } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
}>()
const $emits = defineEmits<{
  'update:visible': [val: boolean]
}>()

const lsyLayoutStore = useLsyLayoutStore()

const { layoutType, enableRouterTab } = storeToRefs(lsyLayoutStore)

const { visible } = toRefs(props)
const visibleComputed = computed({
  get() {
    return visible.value
  },
  set(val: boolean) {
    $emits('update:visible', val)
  },
})
</script>

<style scoped></style>
