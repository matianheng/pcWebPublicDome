<template>
  <div class="flex flex-col">
    <div>表单一</div>
    <el-form ref="elFormRef" :model="formData">
      <el-form-item prop="name" label="姓名" :rules="rules">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormItemRule } from 'element-plus'
import { ref } from 'vue'
import { StepForm01DataType, StepFormDataType } from './typing'
import { toRefs } from 'vue'
import { watch } from 'vue'

defineOptions({ name: 'StepForm01' })

const props = defineProps<{ stepFormData: StepFormDataType }>()
const { stepFormData } = toRefs(props)
const elFormRef = ref<FormInstance>()
const formData = ref<StepForm01DataType>({ name: undefined })
watch(
  stepFormData,
  newStepFormData => {
    const { step01Data } = newStepFormData
    if (step01Data) {
      formData.value = step01Data
    }
  },
  { immediate: true }
)
const rules: FormItemRule[] = [{ required: true, message: '该项必填' }]

defineExpose({
  elFormRef,
  formData,
})
</script>

<style scoped></style>
