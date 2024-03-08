<template>
  <div v-if="nextFrameShow" class="c-system-main-content w-full h-full">
    <LsyRouterTabsKeepAliveWrapper
      v-if="enableRouterTab"
    ></LsyRouterTabsKeepAliveWrapper>
    <router-view v-else v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'LsyMainContent' })

defineProps<{
  enableRouterTab: boolean
}>()

const transitionName = ref('slide')
const nextFrameShow = ref(false)
requestAnimationFrame(() => {
  nextFrameShow.value = true
})
</script>

<style lang="scss" scoped>
.slide-enter-from {
  opacity: 0;
  transform: translateY(18%);
}

.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(90%);
  opacity: 0;
}

.slide-enter-active {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 150ms;
  transition-delay: 80ms;
}

.slide-leave-active {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 450ms;
}
</style>
