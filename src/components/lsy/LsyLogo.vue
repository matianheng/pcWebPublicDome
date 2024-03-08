<template>
  <div class="flex flex-col self-center justify-center" :class="heightCls">
    <div class="flex flex-row justify-center">
      <div class="text-3xl">
        <SvgIcon name="logo"></SvgIcon>
      </div>
      <div
        v-if="!hideText"
        class="text-xl ml-2 overflow-hidden whitespace-nowrap o-lsy-main-logo-text"
      >
        管理系统骨架
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tailwindSafetyListObj } from '@/utils/TailwindSafeList'
import { toRefs } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'

defineOptions({ name: 'LsyLogo' })
const props = withDefaults(
  defineProps<{
    /**
     * 是否需要显示logo文本
     */
    showText?: boolean
  }>(),
  { showText: true }
)
const { showText } = toRefs(props)
const hideText = ref(false)
let flag: number
watch(
  showText,
  newShowText => {
    if (flag) {
      clearTimeout(flag)
    }
    const val = !newShowText
    let time = 450
    if (!val) {
      time = 200
    }
    flag = window.setTimeout(() => {
      hideText.value = val
    }, time)
  },
  { immediate: true }
)
const heightCls = tailwindSafetyListObj.hSystemHeaderHeight
</script>

<style scoped></style>
