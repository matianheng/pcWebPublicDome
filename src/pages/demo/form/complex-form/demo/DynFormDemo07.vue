<template>
  <div class="flex flex-col">
    <h3 class="mb-3">
      ‘是否中国籍’, 字段值改变时，会同时触发 ‘政治面貌’ 的验证
    </h3>
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

defineOptions({ name: 'DynFormDemo07' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

const dynFormRef = ref<LsyDynFormType>()
const formData = ref<CustomFormData>({
  name: '',
  isChina: false,
  politicsStatus: 2,
  male: 1,
})

const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'ElInput',
    label: '姓名',
    prop: 'name',
    rules: [{ required: true, message: '该项必填' }],
  },
  {
    name: 'ElSelect',
    label: '是否中国籍',
    prop: 'isChina',
    elSelectEvents: {
      change() {
        // -important- 这类关联验证，只能在这类组件事件中触发，而不能在自定义验证方法中触发
        dynFormRef.value?.elFormInstance?.validateField('politicsStatus')
      },
    },
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
  {
    name: 'ElSelect',
    label: '政治面貌',
    prop: 'politicsStatus',
    rules: (_, fd) => [
      { required: true, message: '该项必填' },
      {
        validator: (rule, value, callback) => {
          const cfd = fd as CustomFormData
          if (!cfd.isChina && value !== 3) {
            callback('非中国籍，政治面貌只能是群众')
          } else {
            callback()
          }
        },
      },
    ],
    options: [
      { label: '团员', value: 1 },
      { label: '党员', value: 2 },
      { label: '群众', value: 3 },
    ],
    placeholder: '请选择...',
  },
  // {
  //   name: 'ElSelect',
  //   label: '性别',
  //   prop: 'male',
  //   disable(itemConfig, _formData) {
  //     const ret = !_formData.isChina
  //     if (ret) {
  //       _formData.male = 1
  //     }
  //     return ret
  //   },
  //   options: [
  //     { label: '男', value: 1 },
  //     { label: '女', value: 2 },
  //     { label: '未知', value: 3 },
  //   ],
  //   placeholder: '请选择...',
  // },
  // {
  //   name: 'RoleSelect',
  //   label: '角色',
  //   prop: 'role',
  //   disable(itemConfig, _formData) {
  //     const ret = !_formData.isChina
  //     return ret
  //   },
  //   placeholder: '请选择...',
  // },
])
</script>

<style scoped lang="scss">
.dyn-form {
  ::v-deep(.dyn-form-item-el-select) {
    width: 100%;
  }
}
</style>
