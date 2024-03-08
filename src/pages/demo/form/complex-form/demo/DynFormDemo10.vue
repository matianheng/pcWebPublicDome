<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <el-button type="primary" class="w-full" @click="onToggle">
        只读与可编辑切换
      </el-button>
    </div>
    <div class="mb-3">标记有误数据:{{ fieldMarkErrorMap }}</div>
    <LsyDynForm
      ref="dynFormRef"
      v-model:form-data="formData"
      :form-item-arr="formItemArr"
      :form-item-comp-name-map="formItemCompNameMap"
      class="dyn-form"
    ></LsyDynForm>
    <div>{{ formData }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  LsyDynFormType,
  LsyFormItemConfig,
  VueComp,
} from '@/components/lsy/dyn-form/typing'
import { nextTick, ref } from 'vue'
import { CustomFormData } from './typing'
import { onMounted } from 'vue'

defineOptions({ name: 'DynFormDemo10' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

const dynFormRef = ref<LsyDynFormType>()
const formData = ref<CustomFormData>({
  name: '发送旅客的肌肤拉克丝的积分卡拉就发绿卡法拉盛街坊邻居啊圣诞快乐房价埃里克森的法拉圣诞节分厘卡机的发链接啊发生了打开房间啊离开',
  isChina: false,
  male: 1,
  role: 'normal',
})

const editable = ref<boolean>(false)
function onToggle() {
  editable.value = !editable.value
}
const fieldMarkErrorMap = ref<Map<string, string>>(new Map())
onMounted(() => {
  setTimeout(() => {
    const map = new Map<string, string>()
    map.set('role', '这是角色的初始标记有误数据')
    fieldMarkErrorMap.value = map
    // 因为需要操作子组件，因此必须在 mounted 钩子中执行，而不能在 created 中执行
    dynFormRef.value?.elFormInstance?.validate()
  }, 300)
})
function onValidateMarkError(
  field: string,
  callback: (error?: string | Error) => void
) {
  const errorText = fieldMarkErrorMap.value.get(field)
  errorText ? callback(errorText) : callback()
}
function onSaveMarkError(
  fieldName: string,
  markError: string
): Promise<boolean> {
  console.log('onSaveMarkError', fieldName, markError)
  fieldMarkErrorMap.value.set(fieldName, markError)
  nextTick(() => {
    dynFormRef.value?.elFormInstance?.validateField(fieldName)
  })
  return Promise.resolve(true)
}
function onClearMarkError(fieldName: string): Promise<boolean> {
  fieldMarkErrorMap.value.delete(fieldName)
  nextTick(() => {
    dynFormRef.value?.elFormInstance?.validateField(fieldName)
  })
  return Promise.resolve(true)
}
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'EditableInputMarkError',
    label: '姓名',
    prop: 'name',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError('name', callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get('name'),
    }),
    customCompEvents: {
      onSaveMarkError,
      onClearMarkError,
    },
  },
  {
    name: 'EditableSelectMarkError',
    label: '角色',
    prop: 'role',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError('role', callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get('role'),
    }),
    customCompEvents: {
      onSaveMarkError,
      onClearMarkError,
    },
  },
])
</script>

<style scoped lang="scss">
.dyn-form {
  ::v-deep(.dyn-form-item-el-select) {
    width: 100%;
  }
}
</style>
