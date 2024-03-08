import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  EduInfoType,
  MarkErrorInfoType,
  PersonStatus,
} from '../../mock-api/ApiTyping'
import { cloneDeep } from 'lodash-unified'
import { addEduInfo, delEduInfo, updateEduInfo } from '../../mock-api/ListApi'
import { ElMessage } from 'element-plus'

export interface FormTableData<T> {
  tableArr: T[]
}

const init_data: FormTableData<EduInfoType> = {
  tableArr: [],
}
const single_edu_init_data: EduInfoType = {
  school: '',
  graduationCertificate: '',
  doubleDegree: 0,
  startDate: '',
  endDate: '',
}
export const useEduStore = defineStore('new-edu-store', () => {
  /**
   * 数据流转状态
   */
  const status = ref<PersonStatus>()
  const tableData = ref<FormTableData<EduInfoType>>(cloneDeep(init_data))
  const backTableData = ref<FormTableData<EduInfoType>>(cloneDeep(init_data))
  /**
   * 当前编辑行(默认:-1 表示没有行处于编辑状态)
   */
  const editRow = ref<number>(-1)
  /**
   * 是否正在对表格行数据执行: 保存,删除等后台相关操作操作
   */
  const operating = ref<boolean>(false)
  // 最外层map的key为行号, 里层map的key为字段名,value为标记有误信息
  const eduSectionFieldMarkErrorMap = ref<
    Map<number, Map<string, MarkErrorInfoType>>
  >(new Map())

  function init({
    personStatus,
    eduInfoArr,
  }: {
    personStatus?: PersonStatus
    eduInfoArr?: EduInfoType[]
  }) {
    const data: FormTableData<EduInfoType> = eduInfoArr
      ? { tableArr: eduInfoArr }
      : init_data
    data.tableArr = data.tableArr.map(item => {
      const dateRange: string[] = []
      if (item.startDate && item.endDate) {
        dateRange.push(item.startDate)
        dateRange.push(item.endDate)
      }
      return { ...item, dateRange } as EduInfoType
    })
    tableData.value = cloneDeep(data)
    backTableData.value = cloneDeep(data)
    eduSectionFieldMarkErrorMap.value = new Map()
    status.value = personStatus
    editRow.value = -1
  }

  function setEduSectionFieldMarkErrorMap(
    map: Map<number, Map<string, MarkErrorInfoType>>
  ) {
    eduSectionFieldMarkErrorMap.value = map
  }
  function updateRangeDate(rowIndex: number, val?: [string, string]) {
    const rowData = tableData.value.tableArr[rowIndex]
    if (rowData) {
      if (val && val.length === 2) {
        rowData.startDate = val[0]
        rowData.endDate = val[1]
      } else {
        rowData.startDate = undefined
        rowData.endDate = undefined
      }
    }
  }
  function updateRowFieldVal(rowIndex: number, field: string, val?: string) {
    const rowData = tableData.value.tableArr[rowIndex]
    if (rowData) {
      //@ts-ignore
      rowData[field] = val
    }
  }
  /**
   * 在界面添加一条空的教育信息
   */
  function addEmptyEduInfo() {
    console.log(operating.value, editRow.value)
    if (operating.value || editRow.value >= 0) {
      // 当前处于编辑状态或当前已插入新行,但尚未保存,则不再插入新行
      return
    }
    tableData.value.tableArr.push(cloneDeep(single_edu_init_data))
    editRow.value = tableData.value.tableArr.length - 1
  }
  /**
   * 将某行设置为可编辑
   *
   * -important- 这里的内在逻辑要求，addEmptyEduInfo 只能将最新行添加到表格的末尾，而不能添加到表格头部, 否则setRowEditAble中删除了行数据之后,传入的rowIndex就不能代表原来的行号了
   * @param rowIndex 行号
   */
  function setRowEditAble(rowIndex: number) {
    if (operating.value) {
      return
    }
    const oldEditRow = editRow.value
    if (oldEditRow >= 0) {
      return
      // // 存在可编辑行: 则先将老的可编辑行数据恢复成未编辑前的
      // const backRowData = backTableData.value.tableArr[oldEditRow]
      // if (backRowData) {
      //   // 备份数据存在，则恢复为备份数据
      //   tableData.value.tableArr.splice(rowIndex, 1, cloneDeep(backRowData))
      // } else {
      //   // 备份数据不存在，则将oldEditRow所指代的数据从tableData中删除
      //   tableData.value.tableArr.splice(rowIndex, 1)
      // }
    }
    editRow.value = rowIndex
  }
  async function saveEduInfo(rowIndex: number) {
    if (operating.value) {
      return
    }
    console.log(rowIndex, editRow.value, rowIndex !== editRow.value)
    if (rowIndex !== editRow.value) {
      return
    }
    const closeHandler = ElMessage.info({ message: '保存中...' })
    operating.value = true
    try {
      const eduInfo = tableData.value.tableArr[rowIndex]
      if (eduInfo) {
        if (eduInfo.id) {
          // 更新
          await updateEduInfo(eduInfo)
        } else {
          // 新增
          const id = await addEduInfo(eduInfo)
          eduInfo.id = id
        }
        // 更新备份数据
        backTableData.value = cloneDeep(tableData.value)
      }
      /*
      保存成功,则将当前行的标记有误数据,从前端删除,不然当前数据与备份数据已经一致了,
      在执行NewDetailExample.vue组件的`提交`,`审批`按钮时执行的表单验证,原本的标记有误字段又会验证不通过
       */
      eduSectionFieldMarkErrorMap.value.delete(editRow.value)
      editRow.value = -1
      ElMessage.success({ message: '保存成功!' })
    } finally {
      closeHandler.close()
      operating.value = false
    }
  }
  /**
   * 取消编辑指定行
   * @param rowIndex 当前编辑的行号
   */
  function cancelEditEduInfo(rowIndex: number) {
    if (operating.value) {
      return
    }
    const oldEduInfo = backTableData.value.tableArr[rowIndex]
    if (oldEduInfo) {
      // 存在旧数据，则删除当前数据，插入旧数据
      tableData.value.tableArr.splice(rowIndex, 1, cloneDeep(oldEduInfo))
    } else {
      // 不存在旧数据，则删除当前数据
      tableData.value.tableArr.splice(rowIndex, 1)
    }
    editRow.value = -1
  }
  /**
   * 删除教育信息
   * @param rowIndex 行号
   */
  async function removeEduInfo(rowIndex: number) {
    if (operating.value) {
      return
    }
    if (-1 !== editRow.value) {
      // 有编辑行则不允许删除
      return
    }
    operating.value = true
    try {
      const eduInfo = tableData.value.tableArr[rowIndex]
      if (eduInfo) {
        if (eduInfo.id) {
          // 删除服务器数据
          await delEduInfo(eduInfo.id)
        }
        // 删除前端数据
        tableData.value.tableArr.splice(rowIndex, 1)
        // 更新备份数据
        backTableData.value = cloneDeep(tableData.value)
      }
      editRow.value = -1
    } finally {
      operating.value = false
    }
  }
  async function saveMarkError(markErrorInfo: MarkErrorInfoType) {
    let rowErrorMap = eduSectionFieldMarkErrorMap.value.get(markErrorInfo.row)
    if (!rowErrorMap) {
      rowErrorMap = new Map<string, MarkErrorInfoType>()
      eduSectionFieldMarkErrorMap.value.set(markErrorInfo.row, rowErrorMap)
    }
    rowErrorMap.set(markErrorInfo.field, markErrorInfo)
  }
  async function clearMarkError(row: number, field: string) {
    const rowErrorMap = eduSectionFieldMarkErrorMap.value.get(row)
    if (rowErrorMap) {
      rowErrorMap.delete(field)
      if (rowErrorMap.size === 0) {
        eduSectionFieldMarkErrorMap.value.delete(row)
      }
    }
  }
  return {
    operating,
    status,
    editRow,
    tableData,
    backTableData,
    eduSectionFieldMarkErrorMap,

    init,
    setEduSectionFieldMarkErrorMap,
    addEmptyEduInfo,
    saveEduInfo,
    removeEduInfo,
    saveMarkError,
    clearMarkError,
    cancelEditEduInfo,
    setRowEditAble,
    updateRangeDate,
    updateRowFieldVal,
  }
})
