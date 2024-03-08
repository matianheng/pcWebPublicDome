<template>
  <!-- 默认必须为visibility: hidden -->
  <div ref="eleRef" style="visibility: hidden">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const eleRef = ref<HTMLDivElement>()
const visible = ref<boolean>(false)

function callback(entries: IntersectionObserverEntry[]) {
  entries.map(entry => {
    // 当元素和viewport相交时，添加类名选择器，触发对应的animation
    if (entry.isIntersecting && entry.target === eleRef.value) {
      eleRef.value.classList.add('fadeIn')
      console.log('显示', eleRef.value)
      visible.value = true
      // 释放掉observer，减少性能负担
      observer.disconnect()
    }
  })
}
let observer: IntersectionObserver = new IntersectionObserver(callback, {
  rootMargin: '-140px',
})
onMounted(() => {
  if (eleRef.value) {
    observer.observe(eleRef.value)
  }
})
onBeforeUnmount(() => {
  if (eleRef.value) {
    observer.unobserve(eleRef.value)
  }
  observer.disconnect()
})
</script>

<style scoped lang="scss">
.fadeIn {
  animation: fade-in 1.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: forwards;
  visibility: initial !important;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(120px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
