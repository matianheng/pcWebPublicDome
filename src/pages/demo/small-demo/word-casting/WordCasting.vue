<template>
  <LsyContentContainer :fit-all-content="true">
    <div class="w-52 bg-slate-500 text-white overflow-hidden">
      <div class="o-text-content w-max whitespace-nowrap">
        滚滚长江东逝水，浪花淘尽英雄，是非成败... ...
      </div>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.o-text-content {
  animation: roll 5s linear infinite;

  &::before {
    content: '';
    display: inline-block;

    // 这里的长度需要与最外层容器一致
    width: 13rem;
    height: 100%;
  }
}

@keyframes roll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}
</style>
