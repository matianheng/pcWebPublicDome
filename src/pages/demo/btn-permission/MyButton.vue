<script setup lang="ts">
const $emits = defineEmits<{
  click: [evt: MouseEvent]
}>()
function onClick(evt: MouseEvent) {
  // 把事件对象往上传是为了让自定义click事件支持vue的事件修饰符
  $emits('click', evt)
}
</script>

<template>
  <div class="MyButton" @click="onClick($event)">
    <a><slot>自定义按钮</slot></a>
  </div>
</template>

<style lang="scss" scoped>
.MyButton {
  display: block;
  border: 2px solid #333333;
  border-radius: 5px;
  padding: 2px;
  width: fit-content;

  a {
    color: #333333;
  }
}
</style>
