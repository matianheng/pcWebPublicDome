<template>
  <el-input
    v-if="editMode === 'writable'"
    v-model="valComputed"
    clearable
    style="width: 100%"
  >
  </el-input>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { EditMode } from '../typing'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * v-model
     */
    modelValue?: string

    updateContent: (content: string) => void
    editMode: EditMode
  }>(),
  { modelValue: undefined }
)

const $emits = defineEmits<{
  'update:modelValue': [val?: string]
}>()

const { modelValue } = toRefs(props)
const valComputed = computed({
  get() {
    return modelValue.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
  },
})
</script>

<style scoped></style>
