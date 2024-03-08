<!--

@author: pan
@createDate: 2023-09-13 21:01
-->
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import type {
  LsyFormItemConfig,
  ElFormProps,
  StringParamStringReturnFun,
  LsyDynFormData,
  VueComp,
  CustomCompPropsFactory,
  EditMode,
  EditModeFactoryFun,
} from './typing'
import { FormInstance } from 'element-plus'
import NewMarkErrorPopover from './NewMarkErrorPopover.vue'
import { MarkErrorInfoType } from '../mock-api/ApiTyping'

defineOptions({ name: 'BasicDynForm' })
const props = withDefaults(
  defineProps<{
    /**
     * 表单项配置
     */
    formItemArr?: LsyFormItemConfig[]
    /**
     * 表单数据对象.(v-model)
     * p.s. 必须通过v-model方式使用，否则会导致表单项值无法改变
     */
    formData?: LsyDynFormData
    fieldMarkErrorMap?: Map<string, MarkErrorInfoType>
    section: string
    /**
     * 支持el-form除model外的所有props属性
     */
    elFormProps?: ElFormProps
    /**
     * 主要用于做i18n的转换
     */
    formItemLabelConvertFun?: StringParamStringReturnFun
    /**
     * 主要用于做i18n的转换
     */
    formItemPlaceholderConvertFun?: StringParamStringReturnFun
    formItemCompNameMap?: Map<string, VueComp>
  }>(),
  {
    formItemArr: () => [],
    formData: () => ({}),
    elFormProps: undefined,
    formItemLabelConvertFun: (str?: string) => (str ? str : ''),
    formItemPlaceholderConvertFun: (str?: string) => (str ? str : ''),
    formItemCompNameMap: undefined,
    fieldMarkErrorMap: () => new Map<string, MarkErrorInfoType>(),
  }
)
const { formData, formItemCompNameMap } = toRefs(props)
const $emits = defineEmits<{
  'update:formData': [val: LsyDynFormData]
}>()
const formDataComputed = computed<LsyDynFormData>({
  get() {
    return formData.value
  },
  set(val: LsyDynFormData) {
    $emits('update:formData', val)
  },
})

function loadFormItemComp(name: string) {
  if (!formItemCompNameMap.value) {
    throw new Error(`动态表单所需的[${name}]组件未找到或不存在!`)
  }
  const comp = formItemCompNameMap.value.get(name)
  if (!comp) {
    throw new Error(`动态表单所需的[${name}]组件未找到或不存在!`)
  }
  return comp
}
function formItemIsNeedShow(
  formItem: LsyFormItemConfig,
  formData: LsyDynFormData
) {
  const { show = true } = formItem
  if (typeof show === 'boolean') {
    return show
  } else {
    return show(formItem, formData)
  }
}

function formItemIsNeedDisable(
  formItem: LsyFormItemConfig,
  formData: LsyDynFormData
) {
  const { disable = false } = formItem
  if (typeof disable === 'boolean') {
    return disable
  } else {
    return disable(formItem, formData)
  }
}

function loadFormRules(formItem: LsyFormItemConfig, formData: LsyDynFormData) {
  const { rules } = formItem
  if (typeof rules === 'function') {
    return rules(formItem, formData)
  } else {
    return rules
  }
}
function buildCustomCompProps(
  customCompProps?: Record<string, unknown> | CustomCompPropsFactory
) {
  if (customCompProps instanceof Function) {
    return customCompProps()
  } else {
    return customCompProps
  }
}
function editModelFactory(editModel: EditMode | EditModeFactoryFun) {
  if (editModel instanceof Function) {
    return editModel()
  } else {
    return editModel
  }
}
const elFormInstance = ref<FormInstance>()
function onSaveMarkError(row: number, field: string) {
  elFormInstance.value?.validateField(field)
}
defineExpose({
  elFormInstance,
})
</script>

<template>
  <el-form ref="elFormInstance" v-bind="elFormProps" :model="formDataComputed">
    <template v-for="formItem in formItemArr" :key="formItem.prop">
      <el-form-item
        v-if="formItemIsNeedShow(formItem, formDataComputed)"
        :class="`dyn-form-item-${formItem.prop}`"
        v-bind="formItem.elFormItemProps"
        :label="props.formItemLabelConvertFun(formItem.label as string)"
        :prop="formItem.prop"
        :rules="loadFormRules(formItem, formDataComputed)"
      >
        <NewMarkErrorPopover
          :mark-error-id="fieldMarkErrorMap.get(formItem.prop)?.id"
          :val="formDataComputed[formItem.prop]"
          :section="section"
          :row="fieldMarkErrorMap.get(formItem.prop)?.row ?? 0"
          :mark-error="fieldMarkErrorMap.get(formItem.prop)?.msg"
          :field="formItem.prop"
          :edit-mode="editModelFactory(formItem.editMode)"
          :input-is-text-area="formItem.inputIsTextArea"
          :input-is-avatar="formItem.inputIsAvatar"
          @save-mark-error="onSaveMarkError"
        >
          <template #default="{ updateContent }">
            <component
              :is="loadFormItemComp(formItem.name)"
              v-model="formDataComputed[formItem.prop]"
              :form-data="formDataComputed"
              :disabled="formItemIsNeedDisable(formItem, formDataComputed)"
              :placeholder="formItemPlaceholderConvertFun(formItem.placeholder)"
              :item-config="formItem"
              v-bind="buildCustomCompProps(formItem.customCompProps)"
              :update-content="updateContent"
              :edit-mode="editModelFactory(formItem.editMode)"
            ></component>
          </template>
        </NewMarkErrorPopover>
      </el-form-item>
    </template>
    <slot name="extraElFormItems"></slot>
  </el-form>
</template>

<style lang="scss" scoped></style>
