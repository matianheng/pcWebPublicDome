<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <el-button type="primary" class="w-full" @click="onLoadBackendData">
        模拟后端数据加载
      </el-button>
    </div>

    <div class="mb-3">
      <el-button class="w-full" @click="() => (fieldError = {})">
        清空字段错误提示信息
      </el-button>
    </div>
    <div class="mb-3">加载到的错误提示信息: {{ fieldError }}</div>
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
import { ref } from 'vue'
import { CustomFormData } from './typing'

defineOptions({ name: 'DynFormDemo06' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

type FieldError = Record<string, string>
const fieldError = ref<FieldError>({})
const dynFormRef = ref<LsyDynFormType>()
function onLoadBackendData() {
  fieldError.value = { name: '姓名不能为张三', male: '性别不能为未知' }
  console.log(dynFormRef.value?.elFormInstance?.validate)
  dynFormRef.value?.elFormInstance?.validate()
}
let oldData: CustomFormData = {
  name: '',
  isChina: false,
  male: 1,
}
const formData = ref<CustomFormData>({
  name: '',
  isChina: false,
  male: 1,
})
// 模拟从后端加载初始数据
setTimeout(() => {
  // 将加载的数据保存为旧值
  oldData = {
    name: '张三',
    isChina: false,
    politicsStatus: 3,
    male: 3,
  }
  // 将加载到的数据设置到表单
  formData.value = { ...oldData }
}, 1000)

function getFieldError(field: string) {
  return fieldError.value[field]
}
function getFieldOldVal(field: string) {
  // @ts-ignore
  return oldData[field]
}

function validateHasNewValWhenBackendMarkError(
  field: string,
  value: any,
  callback: (error?: string | Error) => void
) {
  const fieldErrorMsg = getFieldError(field)
  if (fieldErrorMsg) {
    const fieldVal = getFieldOldVal(field)
    if (fieldVal === value) {
      callback(fieldErrorMsg)
    } else {
      callback()
    }
  } else {
    // -important-: 这里很重要，如果不加这一句，则el-form会认为验证方法依然在执行，后续字段的验证方法就不会执行了
    callback()
  }
}
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'ElInput',
    label: '姓名',
    prop: 'name',
    rules: () => [
      { trigger: 'change', required: true, message: '该项必填' },
      {
        trigger: 'change',
        validator: (_, value, callback) =>
          validateHasNewValWhenBackendMarkError('name', value, callback),
      },
    ],
  },
  {
    name: 'ElSelect',
    label: '是否中国籍',
    prop: 'isChina',
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
    rules: () => [
      {
        trigger: 'change',
        validator: (_, value, callback) =>
          validateHasNewValWhenBackendMarkError('isChina', value, callback),
      },
    ],
  },
  {
    name: 'ElSelect',
    label: '政治面貌',
    prop: 'politicsStatus',
    rules: (_, fd) => [
      { trigger: 'change', required: true, message: '该项必填' },
      {
        trigger: 'change',
        validator: (rule, value, callback) => {
          const cfd = fd as CustomFormData
          if (!cfd.isChina && value !== 3) {
            callback('非中国籍，政治面貌只能是群众')
          } else {
            callback()
          }
        },
      },
      {
        trigger: 'blur',
        validator: (_, value, callback) =>
          validateHasNewValWhenBackendMarkError(
            'politicsStatus',
            value,
            callback
          ),
      },
    ],
    options: [
      { label: '团员', value: 1 },
      { label: '党员', value: 2 },
      { label: '群众', value: 3 },
    ],
    placeholder: '请选择...',
  },
  {
    name: 'ElSelect',
    label: '性别',
    prop: 'male',
    rules: () => [
      {
        validator(_, value, callback) {
          validateHasNewValWhenBackendMarkError('male', value, callback)
        },
        trigger: 'change',
      },
    ],
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
      { label: '未知', value: 3 },
    ],
    placeholder: '请选择...',
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
