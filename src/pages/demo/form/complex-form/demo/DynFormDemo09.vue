<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <el-button type="primary" class="w-full" @click="onToggle">
        只读与可编辑切换
      </el-button>
    </div>
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

defineOptions({ name: 'DynFormDemo09' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

const formData = ref<CustomFormData>({
  name: '发送旅客的肌肤拉克丝的积分卡拉就发绿卡法拉盛街坊邻居啊圣诞快乐房价埃里克森的法拉圣诞节分厘卡机的发链接啊发生了打开房间啊离开',
  isChina: false,
  male: 1,
})

const editable = ref<boolean>(true)
function onToggle() {
  editable.value = !editable.value
}
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'EditableInput',
    label: '姓名',
    prop: 'name',
    customCompProps: () => ({
      readonly: !editable.value,
    }),
  },
  {
    name: 'EditableSelect',
    label: '角色',
    prop: 'role',
    customCompProps: () => ({
      readonly: !editable.value,
    }),
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
