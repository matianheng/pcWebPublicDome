import { FormInstance, ElFormItem, FormItemRule } from 'element-plus'
import LsyDynFormResponsive from './LsyDynFormResponsive.vue'
import LsyDynForm from './BasicDynForm.vue'

export { Component as VueComp } from 'vue'
export type ElFormItemInstance = InstanceType<typeof ElFormItem>
export type ElFormItemProps = ElFormItemInstance | Record<string, unknown>

export type StringParamStringReturnFun = (str?: string) => string
// 这里 LsyDynFormData 的值类型必须使用any，否则编译的时候会报错
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LsyDynFormData = Record<string, any>
export type LsyFormItemValidateFun = (
  formItem: LsyFormItemConfig,
  formData: LsyDynFormData
) => boolean

export type LsyFormItemRuleBuilder = (
  formItem: LsyFormItemConfig,
  formData: LsyDynFormData
) => FormItemRule[]
export interface OptionItem {
  label: string
  value: string | number | boolean
}
export type CustomCompPropsFactory = () => Record<string, unknown>
export interface LsyFormItemConfig {
  /**
   * 组件名
   */
  name: string
  label?: string
  placeholder?: string
  /**
   * el-form-item的prop
   */
  prop: string
  /**
   * 表单项数据验证规则
   */
  rules?: LsyFormItemRuleBuilder | FormItemRule[]
  /**
   * 支持el-form-item组件除prop,label之外的所有属性
   */
  elFormItemProps?: ElFormItemProps
  /**
   * 自定义组件的props
   */
  customCompProps?: Record<string, unknown> | CustomCompPropsFactory
  /**
   * 自定义组件的events
   */
  customCompEvents?: Record<string, unknown>
  /**
   * 是否显示. 默认: true
   */
  show?: boolean | LsyFormItemValidateFun
  /**
   * 是否禁用. 默认: false
   */
  disable?: boolean | LsyFormItemValidateFun
  /**
   * el-select组件的事件
   */
  elSelectEvents?: Record<string, any>
  /**
   * 编辑模式
   * writable: 可编辑/可写
   * readonly: 只读
   * markError: 可标记有误
   */
  editMode: EditMode | EditModeFactoryFun
  /**
   * 输入组件是否为多行文本输入框(如果为true,则只读和标记有误显示数据时,会以多行文本的方式显示)
   */
  inputIsTextArea?: boolean
  /**
   * 输入组件是否为头像上传组件(如果为true,则将结果显示为el-avatar)
   */
  inputIsAvatar?: boolean
}
export type ElFormProps = FormInstance | Record<string, unknown>

export type LsyDynFormResponsiveType = InstanceType<typeof LsyDynFormResponsive>
export type LsyDynFormType = InstanceType<typeof LsyDynForm>
/**
 * 编辑模式
 *
 * writable: 可编辑/可写
 *
 * readonly: 只读
 *
 * markError: 可标记有误
 */
export type EditMode = 'writable' | 'readonly' | 'markError'
export type EditModeFactoryFun = () => EditMode
