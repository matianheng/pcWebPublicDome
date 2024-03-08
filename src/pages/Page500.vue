<template>
  <div class="h-full w-full flex flex-col justify-center">
    <div class="pb-16">
      <SvgIcon name="500" class="!w-80 !h-100 m-auto"></SvgIcon>
      <div class="flex flex-row justify-center mt-2">
        <el-link class="!text-2xl" type="primary" @click="onGoHome">
          返回首页
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function onGoHome() {
  window.location = import.meta.env.VITE_PUBLIC_BASEPATH
}
</script>

<style scoped lang="scss"></style>
