<template>
  <Transition name="fade">
    <div v-if="show" class="absolute bottom-3 right-3 z-10" @click="onClick">
      <el-button circle :icon="ArrowUpBold"></el-button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ArrowUpBold } from '@element-plus/icons-vue'
defineOptions({ name: 'LsyBackTopAffix' })

defineProps<{ show: boolean }>()

const $emits = defineEmits<{
  click: []
}>()
function onClick() {
  $emits('click')
}
</script>

<style scoped lang="scss">
.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-leave-from,
.fade-enter-to {
  position: absolute;
  opacity: 1;
}
</style>
