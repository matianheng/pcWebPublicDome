<template>
  <div class="flex flex-col">
    <div>表单二</div>
    <el-form ref="elFormRef" :model="formData">
      <el-form-item prop="nikeName" label="昵称" :rules="rules">
        <el-input v-model="formData.nikeName"></el-input>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input v-model="formData.age"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormItemRule } from 'element-plus'
import { ref, toRefs } from 'vue'
import {
  StepForm01DataType,
  StepForm02DataType,
  StepFormDataType,
} from './typing'
import { watch } from 'vue'

defineOptions({ name: 'StepForm02' })

const props = defineProps<{ stepFormData: StepFormDataType }>()
const { stepFormData } = toRefs(props)
const elFormRef = ref<FormInstance>()
const formData = ref<StepForm02DataType>({
  nikeName: undefined,
  age: undefined,
})
let step01FormData: StepForm01DataType
watch(
  stepFormData,
  newStepFormData => {
    const { step01Data, step02Data } = newStepFormData
    if (step02Data) {
      formData.value = step02Data
    }
    if (step01Data) {
      step01FormData = step01Data
    }
  },
  { immediate: true, deep: true }
)

const rules: FormItemRule[] = [
  { required: true, message: '该项必填' },
  {
    validator: (_, val, callback) => {
      if (step01FormData && val === step01FormData.name) {
        callback('姓名和昵称不能相同')
      } else {
        callback()
      }
    },
  },
]

defineExpose({
  elFormRef,
  formData,
})
</script>

<style scoped></style>
