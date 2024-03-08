import { Ref, ref, watch } from 'vue'
import { LsyTableColumn } from './typing'
import { CheckboxValueType } from 'element-plus'

type $EmitType = (name: string, params?: unknown | unknown[]) => void

export function useSettings(
  columnArr: Ref<LsyTableColumn[]>,
  $emits: $EmitType | any
) {
  const checkedPropArr = ref<string[]>([])
  watch(
    columnArr,
    newColumnArr => {
      checkedPropArr.value = []
      newColumnArr.forEach(item => {
        if (item.prop) {
          if (item.show === undefined || item.show === true) {
            // 将当前列设置到选中列中
            checkedPropArr.value.push(item.prop)
          } else {
            // 将当前列从选中列中删除
            const idx = checkedPropArr.value.findIndex(p => item.prop === p)
            if (idx >= 0) {
              checkedPropArr.value.splice(idx, 1)
            }
          }
        }
      })
    },
    { immediate: true }
  )

  function updateColumnArrHideVal(checkedPropArr: CheckboxValueType[]) {
    const tmpArr = [...columnArr.value]
    tmpArr.forEach(item => {
      if (item.prop) {
        if (checkedPropArr.indexOf(item.prop) >= 0) {
          item.show = true
        } else {
          item.show = false
        }
      }
    })
    $emits('update:columnArr', tmpArr)
  }
  // checkbox的选中状态
  const showAllColumns = ref(true)
  // checkbox是否使用不确定状态(半选状态)
  const isIndeterminate = ref(true)
  function onCheckAllPropChange(val: CheckboxValueType) {
    isIndeterminate.value = false
    const tmpArr = [...columnArr.value]
    if (val) {
      // 将所有字段设置为显示
      tmpArr.forEach(item => {
        if (item.prop) {
          item.show = true
        }
      })
    } else {
      // 将所有字段设置为隐藏
      tmpArr.forEach(item => {
        if (item.prop) {
          item.show = false
        }
      })
    }
    $emits('update:columnArr', tmpArr)
  }
  function onCheckedPropChange(checkedValues: CheckboxValueType[]) {
    const checkedCount = checkedValues.length
    const columnArrLen = columnArr.value.length
    showAllColumns.value = checkedCount === columnArrLen
    isIndeterminate.value = checkedCount > 0 && checkedCount < columnArrLen
    updateColumnArrHideVal(checkedValues)
  }
  return {
    onCheckedPropChange,
    onCheckAllPropChange,
    checkedPropArr,
    showAllColumns,
    isIndeterminate,
  }
}
