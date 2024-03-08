<template>
  <div v-if="drawer" class="el-drawer-wrapper">
    <el-drawer v-model="drawer" :title="title">
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    /**
     * v-model
     */
    visible: boolean
  }>(),
  {
    title: undefined,
    visible: false,
  }
)
const $emits = defineEmits<{
  'update:visible': [boolean]
}>()
const drawer = computed({
  get() {
    return props.visible
  },
  set(val: boolean) {
    console.log('val', val)
    $emits('update:visible', val)
  },
})
</script>

<style scoped lang="scss">
.el-drawer-wrapper {
  ::v-deep(.el-drawer__header) {
    margin-bottom: 16px;
    border-bottom: 1px solid #333333;
    padding: 16px 20px;
  }

  ::v-deep(.el-drawer__body) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
