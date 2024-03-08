import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MarkErrorInfoType, PersonStatus } from '../../mock-api/ApiTyping'
import {
  cancelMarkError,
  loadMarkError,
  loadPersonInfo,
  saveMarkError as doSaveMarkError,
} from '../../mock-api/ListApi'
import { ElMessage } from 'element-plus'
import { useBasicInfoStore } from './NewBasicInfoStore'
import { useEduStore } from './NewEduInfoStore'

export const useNewDetailStore = defineStore('new-detail-store', () => {
  const basicInfoStore = useBasicInfoStore()
  const eduStore = useEduStore()
  /**
   * 数据流转状态
   */
  const status = ref<PersonStatus>()
  const personInfoLoading = ref<boolean>(false)

  async function getPersonInfo(account: string) {
    personInfoLoading.value = true
    try {
      return await doGetPersonInfo(account)
    } finally {
      personInfoLoading.value = false
    }
  }

  async function doGetPersonInfo(account: string) {
    const ret = await loadPersonInfo(account)
    // -important- 根据业务逻辑或相关场景逻辑执行相关数据检查. 如:ret必须有值
    if (!ret) {
      ElMessage.error('未找到数据')
      return
    }
    // -important- 这里的 status 最好放到一个独立 store 中, 其他所有用到这个 status 的地方, 都改为使用独立store中的status, 然后这个独立 status 在每次调用 getPersonInfo 方法前, 先清空, 避免界面中依赖 status 的地方, 因为 getPersonInfo 缓慢, 而长时间出现, 不应该出现的东西(比如:某些操作按钮)
    status.value = ret.status
    // -important- 注意这里需要使用深度clone, 让新值与backPersonInfo脱离引用关系, 避免修改basicInfo或eduInfoArr,导致backPersonInfo也被修改(避免取消操作的数据恢复非预期)
    basicInfoStore.init({ personStatus: ret.status, val: ret.basic })
    eduStore.init({ personStatus: ret.status, eduInfoArr: ret.eduInfoArr })
    if (ret.status && ['reject', 'wait-pass'].indexOf(ret.status) >= 0) {
      await loadAndFitMarkErrorData(ret.status)
    } else {
      basicInfoStore.setBasicSectionFieldMarkErrorMap(new Map())
      eduStore.setEduSectionFieldMarkErrorMap(new Map())
    }
  }

  async function loadAndFitMarkErrorData(account: string) {
    const markErrorArr = await loadMarkError(account)
    basicInfoStore.setBasicSectionFieldMarkErrorMap(
      extractBasicMarkError(markErrorArr)
    )
    eduStore.setEduSectionFieldMarkErrorMap(extractEduMarkError(markErrorArr))
  }
  async function saveMarkError(markErrorInfo: MarkErrorInfoType) {
    // 保存到服务器
    const id = await doSaveMarkError(markErrorInfo)
    markErrorInfo.id = id
    if (markErrorInfo.section === 'basic') {
      basicInfoStore.saveMarkError(markErrorInfo)
    } else if (markErrorInfo.section === 'edu') {
      eduStore.saveMarkError(markErrorInfo)
    }
  }
  async function clearMarkError(
    row: number,
    section: string,
    id: string,
    field: string
  ) {
    await cancelMarkError(id)
    if (section === 'basic') {
      basicInfoStore.clearMarkError(id, field)
    } else if (section === 'edu') {
      eduStore.clearMarkError(row, field)
    }
  }
  return {
    status,
    personInfoLoading,

    getPersonInfo,
    saveMarkError,
    clearMarkError,
  }
})

function extractEduMarkError(markErrorArr: MarkErrorInfoType[]) {
  return markErrorArr
    .filter(item => item.section === 'edu')
    .reduce((prev, cur) => {
      let map = prev.get(cur.row)
      if (!map) {
        map = new Map<string, MarkErrorInfoType>()
        prev.set(cur.row, map)
      }
      map.set(cur.field, cur)
      return prev
    }, new Map<number, Map<string, MarkErrorInfoType>>())
}
function extractBasicMarkError(markErrorArr: MarkErrorInfoType[]) {
  return markErrorArr
    .filter(item => item.section === 'basic')
    .reduce((prev, cur) => {
      prev.set(cur.field, cur)
      return prev
    }, new Map<string, MarkErrorInfoType>())
}
