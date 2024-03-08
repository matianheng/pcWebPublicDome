<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <el-button type="primary" class="w-full" @click="onLoadBackendData">
        模拟后端数据加载
      </el-button>
    </div>

    <div class="mb-3">
      <el-button class="w-full" @click="() => (fieldList = [])">
        清空加载字段
      </el-button>
    </div>
    <div class="mb-3">加载到的显示字段: {{ fieldList }}</div>
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
import { LsyFormItemConfig, VueComp } from '@/components/lsy/dyn-form/typing'
import { ref } from 'vue'
import { CustomFormData } from './typing'

defineOptions({ name: 'DynFormDemo04' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

const formData = ref<CustomFormData>({
  name: '',
  isChina: false,
  politicsStatus: 3,
  male: 1,
})
const fieldList = ref<string[]>([])
function onLoadBackendData() {
  fieldList.value.push(...['name', 'isChina'])
}
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'ElInput',
    label: '姓名',
    prop: 'name',
    rules: [{ required: true, message: '该项必填' }],
    show: () => fieldList.value.includes('name'),
  },
  {
    name: 'ElSelect',
    label: '是否中国籍',
    prop: 'isChina',
    show: () => fieldList.value.includes('isChina'),
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
  {
    name: 'ElSelect',
    label: '政治面貌',
    prop: 'politicsStatus',
    show: () => fieldList.value.includes('politicsStatus'),
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
