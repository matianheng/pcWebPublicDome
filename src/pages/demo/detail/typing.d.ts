import BasicInfo from './BasicInfo.vue'

/**
 * 章节结构信息
 */
export interface SectionStructInfo {
  /**
   * 章节描述(实际无用，只是给开发者看的)
   */
  desc: string
  /**
   * 章节标识
   */
  flag: string
  /**
   * 是否需要显示
   */
  show: boolean
  /**
   * 章节内所有可显示和展示的字段
   */
  availableFieldArr: string[]
}
export type BasicInfoInstance = ComponentExposed<typeof BasicInfo>

export type SaveMarkErrorCallback = (ret: boolean) => void
