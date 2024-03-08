<template>
  <div>
    <LsyTinymce v-model="content"></LsyTinymce>
    <div>
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref<string>()
setTimeout(() => {
  content.value =
    '<p><span style="background-color: rgb(241, 196, 15);"><strong>发射点发生</strong></span>了解</p>'
}, 3000)
</script>

<style scoped></style>
