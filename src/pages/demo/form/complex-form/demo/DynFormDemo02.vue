<template>
  <div class="flex flex-col">
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

defineOptions({ name: 'DynFormDemo02' })

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

const formItemArr = ref<LsyFormItemConfig[]>([
  // {
  //   name: 'ElInput',
  //   label: '姓名',
  //   prop: 'name',
  // },
  {
    name: 'ElSelect',
    label: '是否中国籍',
    prop: 'isChina',
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
  {
    name: 'ElSelect',
    label: '政治面貌',
    prop: 'politicsStatus',
    disable(itemConfig, _formData) {
      const fd = _formData as CustomFormData
      const ret = !fd.isChina
      if (ret) {
        fd.politicsStatus = 3
      }
      return ret
    },
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
