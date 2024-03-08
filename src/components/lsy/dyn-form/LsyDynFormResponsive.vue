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
} from './typing'
import LsyContainerResponsiveWrapper from '@/components/lsy/container-responsive-wrapper/LsyContainerResponsiveWrapper'
import {
  useResizeObserverHook,
  type UpdateRowColCountFun,
} from '@/components/lsy/container-responsive-wrapper/hooks/ResizeObserverHook'
import { FormInstance } from 'element-plus'
import { watch } from 'vue'
// 使用了vue3的泛型特性之后，外部需要获取当前组件的expose的类型定义就无法再通过InstanceType<typeof LsyDynForm>获取了，所以，这里单独声明一个，以供外部使用
export interface DynFromExposeType {
  elFormInstance: FormInstance
}
defineOptions({ name: 'LsyDynFormResponsive' })
const props = withDefaults(
  defineProps<{
    /**
     * 根据dom宽度，计算每行能容纳的单元格数量【LsyContainerResponsiveWrapper组件配置】
     * 
     * e.g.
     * 
     * ```ts
      function demo(domOffsetWidth:number){
        if (domOffsetWidth <= 768) {
          return 1
        } else if (domOffsetWidth <= 992) {
          return 2
        } else if (domOffsetWidth <= 1300) {
          return 3
        } else {
          return 4
        }
      }
      ```
     */
    updateRowColCountFun: UpdateRowColCountFun
    /**
     * 响应式容器(LsyContainerResponsiveWrapper组件)的class【LsyContainerResponsiveWrapper组件配置】
     */
    containerResponsiveWrapperClass?: string | string[]
    /**
     * 是否需要显示toggle按钮(一般是展开/收缩按钮)(v-model)[由组件内部设置，外部只要根据实际值，做对应的逻辑即可]
     */
    needShowToggleBtn?: boolean
    /**
     * 是否展开. 默认:false【LsyContainerResponsiveWrapper组件配置】
     */
    expand?: boolean
    /**
     * 表单项配置
     */
    formItemArr?: LsyFormItemConfig[]
    /**
     * 表单数据对象.(v-model)
     * p.s. 必须通过v-model方式使用，否则会导致表单项值无法改变
     */
    formData?: LsyDynFormData
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
    /**
     * 表单项组件
     */
    formItemCompNameMap?: Map<string, VueComp>
  }>(),
  {
    formItemArr: () => [],
    formData: () => ({}),
    elFormProps: undefined,
    formItemLabelConvertFun: (str?: string) => (str ? str : ''),
    formItemPlaceholderConvertFun: (str?: string) => (str ? str : ''),
    formItemCompNameMap: undefined,
    containerResponsiveWrapperClass: '',
    expand: false,
  }
)
const { formItemCompNameMap } = props
const { formData } = toRefs(props)
const $emits = defineEmits<{
  'update:formData': [val: LsyDynFormData]
  'update:needShowToggleBtn': [val: boolean]
}>()
const {
  colCount,
  itemWidth,
  formWrapperRef,
  realCellCount,
  needShowToggleBtn: _needShowToggleBtn,
} = useResizeObserverHook(3, props.updateRowColCountFun)
const formDataComputed = computed<LsyDynFormData>({
  get() {
    return formData.value
  },
  set(val: LsyDynFormData) {
    $emits('update:formData', val)
  },
})
watch(
  _needShowToggleBtn,
  val => {
    $emits('update:needShowToggleBtn', val)
  },
  { immediate: true }
)
function loadFormItemComp(name: string) {
  if (!formItemCompNameMap) {
    throw new Error(`动态表单所需的[${name}]组件未找到或不存在!`)
  }
  const comp = formItemCompNameMap.get(name)
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
function buildElSelectEvents(formItem: LsyFormItemConfig) {
  return formItem.elSelectEvents ?? {}
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
const elFormInstance = ref<FormInstance>()
defineExpose({
  elFormInstance,
})
</script>

<template>
  <div ref="formWrapperRef" class="o-dyn-form-wrapper">
    <el-form
      ref="elFormInstance"
      v-bind="elFormProps"
      :model="formDataComputed"
    >
      <LsyContainerResponsiveWrapper
        v-model:realCellCount="realCellCount"
        :class="containerResponsiveWrapperClass"
        :col-count="colCount"
        :expand="expand"
      >
        <template v-for="formItem in formItemArr" :key="formItem.prop">
          <el-form-item
            v-if="formItemIsNeedShow(formItem, formDataComputed)"
            v-bind="formItem.elFormItemProps"
            :label="props.formItemLabelConvertFun(formItem.label as string)"
            :prop="formItem.prop"
            :rules="loadFormRules(formItem, formDataComputed)"
          >
            <el-select
              v-if="formItem.name === 'ElSelect'"
              v-model="formDataComputed[formItem.prop]"
              class="dyn-form-item-el-select"
              :disabled="formItemIsNeedDisable(formItem, formDataComputed)"
              :placeholder="formItemPlaceholderConvertFun(formItem.placeholder)"
              clearable
              v-on="buildElSelectEvents(formItem)"
            >
              <el-option
                v-for="optionItem in formItem.options"
                :key="`${optionItem.value}`"
                :label="optionItem.label"
                :value="optionItem.value"
              />
            </el-select>
            <el-input
              v-else-if="formItem.name === 'ElInput'"
              v-model="formDataComputed[formItem.prop]"
              :disabled="formItemIsNeedDisable(formItem, formDataComputed)"
              :placeholder="formItemPlaceholderConvertFun(formItem.placeholder)"
              clearable
            ></el-input>
            <component
              :is="loadFormItemComp(formItem.name)"
              v-else
              v-model="formDataComputed[formItem.prop]"
              :form-data="formDataComputed"
              :disabled="formItemIsNeedDisable(formItem, formDataComputed)"
              :placeholder="formItemPlaceholderConvertFun(formItem.placeholder)"
              :item-config="formItem"
              v-bind="buildCustomCompProps(formItem.customCompProps)"
            ></component>
          </el-form-item>
        </template>
        <slot name="extraElFormItems"></slot>
      </LsyContainerResponsiveWrapper>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.o-dyn-form-wrapper {
  ::v-deep(> form > .o-responsive-wrapper > div) {
    width: v-bind(itemWidth);
  }
}
</style>
