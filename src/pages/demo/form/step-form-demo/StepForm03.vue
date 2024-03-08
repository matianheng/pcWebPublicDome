<template>
  <div class="flex flex-col">
    <div>表单三</div>
    <div>
      {{ stepFormData }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { StepFormDataType } from './typing'

defineOptions({ name: 'StepForm03' })

const props = defineProps<{ stepFormData: StepFormDataType }>()
const { stepFormData } = toRefs(props)
</script>

<style scoped></style>
