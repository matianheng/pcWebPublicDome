import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  BasicInfoType,
  MarkErrorInfoType,
  PersonStatus,
} from '../../mock-api/ApiTyping'
import { saveBasic } from '../../mock-api/ListApi'
import { cloneDeep } from 'lodash-unified'

export const useBasicInfoStore = defineStore('new-basic-info-store', () => {
  /**
   * 基本信息
   */
  const backBasicInfo = ref<BasicInfoType>({})
  const basicInfo = ref<BasicInfoType>({})
  const showCancel = ref<boolean>(false)
  const showEdit = ref<boolean>(false)
  const showSave = ref<boolean>(false)
  /**
   * 是否可编辑
   */
  const editAble = ref<boolean>(false)
  /**
   * 数据流转状态
   */
  const status = ref<PersonStatus>()
  /**
   * 基本信息的标记有误数据
   */
  const basicSectionFieldMarkErrorMap = ref<Map<string, MarkErrorInfoType>>(
    new Map()
  )

  function init({
    personStatus,
    val,
  }: {
    personStatus?: PersonStatus
    val?: BasicInfoType
  }) {
    status.value = personStatus
    setBasicInfo(val)
    if (personStatus) {
      changeSectionTitleBtnShowStatus()
    }
  }

  function setBasicInfo(val?: BasicInfoType) {
    basicInfo.value = val ? cloneDeep(val) : {}
    backBasicInfo.value = val ? cloneDeep(val) : {}
  }
  function setBasicSectionFieldMarkErrorMap(
    val: Map<string, MarkErrorInfoType>
  ) {
    basicSectionFieldMarkErrorMap.value = val
  }
  function changeSectionTitleBtnShowStatus() {
    if (!status.value) {
      return
    }
    showSave.value = showCancel.value =
      ['wait-fit', 'wait-pass', 'reject'].indexOf(status.value) >= 0 &&
      editAble.value
    showEdit.value =
      ['wait-fit', 'wait-pass', 'reject'].indexOf(status.value) >= 0 &&
      !editAble.value
  }
  function changeEditStatusAndSectionTitleBtnShowStatus(edit: boolean) {
    editAble.value = edit
    changeSectionTitleBtnShowStatus()
  }
  /**
   * 是否正在保存基本信息
   */
  const savingBasicInfo = ref<boolean>(false)
  async function saveBasicInfo(val: BasicInfoType) {
    savingBasicInfo.value = true
    try {
      await saveBasic(val)
      backBasicInfo.value = cloneDeep(val)
      basicSectionFieldMarkErrorMap.value.clear()
    } finally {
      savingBasicInfo.value = false
    }
  }
  function cancelBasicInfo() {
    if (backBasicInfo.value) {
      basicInfo.value = cloneDeep(backBasicInfo.value)
    }
  }
  async function saveMarkError(markErrorInfo: MarkErrorInfoType) {
    // 保存到map中
    basicSectionFieldMarkErrorMap.value.set(markErrorInfo.field, {
      ...markErrorInfo,
    })
  }
  async function clearMarkError(id: string, field: string) {
    basicSectionFieldMarkErrorMap.value.delete(field)
  }
  return {
    status,
    editAble,
    basicInfo,
    backBasicInfo,
    savingBasicInfo,

    showCancel,
    showEdit,
    showSave,
    basicSectionFieldMarkErrorMap,

    init,
    setBasicInfo,
    setBasicSectionFieldMarkErrorMap,
    changeEditStatusAndSectionTitleBtnShowStatus,
    saveBasicInfo,
    cancelBasicInfo,
    saveMarkError,
    clearMarkError,
  }
})
