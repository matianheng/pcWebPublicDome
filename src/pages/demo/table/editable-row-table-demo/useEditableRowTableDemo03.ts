import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { FormItemRule, FormInstance } from 'element-plus'
import { Ref, ref, watch } from 'vue'
import { SaveMarkErrorCallback } from './MarkErrorPopover.vue'

export interface BackendFieldErrorInfo {
  rowIndex: number
  fieldName: string
  errorMsg: string
}
export type FormItemRuleFactoryMethod = (rowIndex: number) => FormItemRule[]
export interface UserInfo {
  name?: string
  age?: number
  male: number
}
export interface TableData<T> {
  list: T[]
}

export function useFormItemRules(
  rowsFieldErrorMap: Ref<Map<number, Map<string, string>>>
) {
  function getRowFieldErrorMsg(rowIndex: number, field: string) {
    const map = rowsFieldErrorMap.value.get(rowIndex)
    if (map) {
      return map.get(field)
    } else {
      return ''
    }
  }

  function validateMarkError(
    rowIndex: number,
    fieldName: string,
    val: any,
    callback: (error?: string | Error) => void
  ) {
    const errorMsg = getRowFieldErrorMsg(rowIndex, fieldName)
    if (errorMsg) {
      callback(errorMsg)
    } else {
      callback()
    }
  }

  const fieldRulesMap = new Map<
    string,
    FormItemRule[] | FormItemRuleFactoryMethod
  >()

  fieldRulesMap.set('name', (rowIndex: number) => [
    { required: true, message: '该项必填' },
    {
      validator: (_, val, callback) =>
        validateMarkError(rowIndex, 'name', val, callback),
    },
  ])
  fieldRulesMap.set('age', (rowIndex: number) => [
    { required: true, message: '该项必填' },
    {
      validator: (rule, val, callback) => {
        if (val < 18) {
          callback('年龄必须大于18岁')
        } else {
          callback()
        }
      },
    },
    {
      validator: (_, val, callback) =>
        validateMarkError(rowIndex, 'age', val, callback),
    },
  ])
  fieldRulesMap.set('male', (rowIndex: number) => [
    { required: true, message: '该项必填' },
    {
      validator: (rule, val, callback) => {
        let tmp = 0
        try {
          tmp = parseInt(val)
          if ([1, 2, 3].indexOf(tmp) < 0) {
            callback('性别只能是:1,2,3')
          } else {
            callback()
          }
        } catch (error) {
          callback('性别只能是:1,2,3')
        }
      },
    },
    {
      validator: (_, val, callback) =>
        validateMarkError(rowIndex, 'male', val, callback),
    },
  ])

  function buildRules(
    rowIndex: number,
    rules?: FormItemRule[] | FormItemRuleFactoryMethod
  ) {
    if (rules instanceof Function) {
      return rules(rowIndex)
    } else {
      return rules
    }
  }

  return { fieldRulesMap, buildRules, getRowFieldErrorMsg }
}

export function useRowEditable(
  editRowIndex: Ref<number>,
  tableData: Ref<TableData<UserInfo>>,
  rowsFieldErrorMap: Ref<Map<number, Map<string, string>>>,
  backBeforeEditRowData: Ref<UserInfo | undefined>,
  elFormRef: Ref<FormInstance>
) {
  function showEditBtn(rowIndex: number) {
    if (editRowIndex.value === -1) {
      return true
    }
    return editRowIndex.value !== rowIndex
  }
  watch(
    [editRowIndex, backBeforeEditRowData],
    (
      [newEditRowIndex, newBackBeforeEditRowData],
      [oldEditRowIndex, oldBackBeforeEditRowData]
    ) => {
      if (
        newEditRowIndex >= 0 &&
        oldEditRowIndex >= 0 &&
        oldBackBeforeEditRowData
      ) {
        // 原本oldEditRowIndex为编辑状态，但用户直接点击newEditRowIndex行的编辑按钮，则恢复oldEditRowIndex行的旧数据
        tableData.value.list[oldEditRowIndex] = oldBackBeforeEditRowData
      }
    }
  )
  function onEditRow(rowIndex: number, rowData: UserInfo) {
    editRowIndex.value = rowIndex
    backBeforeEditRowData.value = { ...rowData }
  }
  function onValidate(rowIndex: number) {
    const fieldArr = ['name', 'age', 'male', 'hobby'].map(
      fieldName => `list.${rowIndex}.${fieldName}`
    )
    elFormRef.value?.validateField(fieldArr)
  }
  function onSave(rowIndex: number) {
    // -important- 这里故意加了一个hobby字段, 就是为了测试如果有一个不存在prop, validateField 能否正常运行, 结果是可以的
    // 为什么要加这个不存在的hobby字段? 因为当前场景是动态表单, 字段可能是不确定的, 如果必须要和prop的一致，那无疑会增加代码复杂度，幸好无需如此，将所有字段写上去即可
    const fieldArr = ['name', 'age', 'male', 'hobby'].map(
      fieldName => `list.${rowIndex}.${fieldName}`
    )
    elFormRef.value?.validateField(fieldArr, (isValid: boolean) => {
      if (isValid) {
        editRowIndex.value = -1
        backBeforeEditRowData.value = undefined
      }
    })
  }
  function onCancel() {
    if (backBeforeEditRowData.value) {
      tableData.value.list[editRowIndex.value] = {
        ...backBeforeEditRowData.value,
      }
      backBeforeEditRowData.value = undefined
    }
    editRowIndex.value = -1
  }
  function onClearMarkError(rowIndex: number, fieldName: string) {
    const map = rowsFieldErrorMap.value.get(rowIndex)
    if (map) {
      map.delete(fieldName)
      if (map.size === 0) {
        // 该行已经没有标记有误数据了，则将该行整个删除
        rowsFieldErrorMap.value.delete(rowIndex)
      }
    }
  }
  function onSaveMarkError(
    rowIndex: number,
    fieldName: string,
    errorMsg: string,
    callback: SaveMarkErrorCallback
  ) {
    let map = rowsFieldErrorMap.value.get(rowIndex)
    if (!map) {
      map = new Map()
      rowsFieldErrorMap.value.set(rowIndex, map)
    }
    map.set(fieldName, errorMsg)
    callback(true)
    onValidate(rowIndex)
  }
  return {
    showEditBtn,
    onEditRow,
    onValidate,
    onSave,
    onCancel,
    onClearMarkError,
    onSaveMarkError,
  }
}

export function useInit() {
  const columnArr = ref<LsyTableColumn[]>([
    {
      prop: 'name',
      label: '姓名',
      slotName: 'name',
    },
    {
      prop: 'age',
      label: '年龄',
      slotName: 'age',
    },
    {
      prop: 'male',
      label: '性别',
      slotName: 'male',
      dictionaryConvert: (rowData: UserInfo) => {
        if (rowData.male === 1) {
          return '男'
        } else if (rowData.male === 2) {
          return '女'
        } else {
          return '未知'
        }
      },
    },
    {
      prop: 'operation',
      label: '操作',
      slotName: 'operation',
      elTableColumnProps: {
        width: '170',
      },
    },
  ])
  // key为行号, value为改行代指对象的标记有误字段的错误提示信息
  const rowsFieldErrorMap = ref<Map<number, Map<string, string>>>(new Map())
  const tableData = ref<TableData<UserInfo>>({
    list: [],
  })
  const editRowIndex = ref<number>(-1)
  const elFormRef = ref<FormInstance>()
  const backBeforeEditRowData = ref<UserInfo | undefined>()
  async function init() {
    const arr = await mockTableData()
    tableData.value.list = arr
    const fieldErrors: BackendFieldErrorInfo[] =
      await mockLoadBackendFieldErrorData()
    rowsFieldErrorMap.value = backendFieldErrorInfoToArrMap(fieldErrors)
  }

  return {
    rowsFieldErrorMap,
    tableData,
    columnArr,
    editRowIndex,
    elFormRef,
    backBeforeEditRowData,
    init,
  }
}

function mockTableData(): Promise<UserInfo[]> {
  return Promise.resolve([
    { name: '张三', age: 12, male: 1 },
    { name: '里斯', age: 3, male: 2 },
    { name: undefined, age: 32, male: 3 },
  ])
}

function mockLoadBackendFieldErrorData(): Promise<BackendFieldErrorInfo[]> {
  const fieldErrors: BackendFieldErrorInfo[] = [
    { rowIndex: 0, fieldName: 'name', errorMsg: '你不叫张三，你叫张山' },
    { rowIndex: 0, fieldName: 'age', errorMsg: '这人不是12岁' },
    { rowIndex: 2, fieldName: 'age', errorMsg: '这人是42岁吧' },
    { rowIndex: 2, fieldName: 'male', errorMsg: '性别未知?是女的吧' },
  ]
  return Promise.resolve(fieldErrors)
}

function backendFieldErrorInfoToArrMap(
  fieldErrors: BackendFieldErrorInfo[]
): Map<number, Map<string, string>> {
  const ret: Map<number, Map<string, string>> = new Map()
  fieldErrors.forEach(item => {
    if (!ret.get(item.rowIndex)) {
      ret.set(item.rowIndex, new Map<string, string>())
    }
    const rowFieldErrorMap = ret.get(item.rowIndex) as Map<string, string>
    rowFieldErrorMap.set(item.fieldName, item.errorMsg)
  })
  return ret
}
