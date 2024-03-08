<template>
  <div>
    <LsyTinymce v-model="content" :height="200" :auto-focus="true"></LsyTinymce>
    <div>
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref<string>()
</script>

<style scoped></style>
