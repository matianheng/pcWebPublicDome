<template>
  <div class="flex flex-col h-[32rem]">
    <div class="flex-shrink-0">
      <el-button type="primary" @click="() => onLanguageChange('zh-Hans')">
        简体中文
      </el-button>
      <el-button @click="() => onLanguageChange('en')">英文</el-button>
      <el-button @click="() => onLanguageChange('zh-Hant')">繁体中文</el-button>
    </div>
    <LsyTinymce
      v-model="content"
      class="flex-1 h-0"
      height="100%"
      :language="language"
    ></LsyTinymce>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref<string>(
  '<p><span style="background-color: rgb(241, 196, 15);"><strong>发射点发生</strong></span>了解</p>'
)
const language = ref<string>('zh-Hans')

function onLanguageChange(lang: string) {
  language.value = lang
}
</script>

<style scoped></style>
