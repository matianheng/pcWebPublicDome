<template>
  <el-card class="mb-3">
    <template #header>
      <NewSectionTitle
        title="教育信息"
        :show-add="showAdd"
        :show-cancel="showCancel"
        :show-edit="showEdit"
        required
        :error-msg="titleErrorMsg"
        @add="onAdd"
        @edit="onEdit"
        @cancel="onCancel"
      ></NewSectionTitle>
    </template>
    <el-form ref="elFormRef" :model="tableData">
      <BasicJsonPageTable
        :fit-all-content="false"
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData.tableArr"
        :enable-pagination="false"
        :row-field-mark-error-map="eduSectionFieldMarkErrorMap"
        section="edu"
        @image-link-click="onImageLinkClick"
        @validate-row-field="onValidateRowField"
      >
        <!-- 教育类型 -->
        <template #type="{ scope, updateContent, editMode }">
          <TableCellSelect
            v-model="scope.row.type"
            :update-content="updateContent"
            :edit-mode="editMode"
            dict-type="edu"
          ></TableCellSelect>
        </template>
        <!-- 学校 -->
        <template #school="{ scope, updateContent, editMode }">
          <TableCellInput
            v-model="scope.row.school"
            :update-content="updateContent"
            :edit-mode="editMode"
          ></TableCellInput>
        </template>
        <!-- 开始-结束日期 -->
        <template #dateRange="{ scope, updateContent, editMode }">
          <TableCellDateRange
            v-model="scope.row.dateRange"
            :update-content="updateContent"
            :edit-mode="editMode"
            dict-type="confirm"
            :row-index="scope.$index"
            @change="onDateRangeChange"
          ></TableCellDateRange>
        </template>
        <!-- 毕业证 -->
        <template #graduationCertificate="{ scope, editMode }">
          <TableCellLink
            v-model="scope.row.graduationCertificate"
            :edit-mode="editMode"
            :row-index="scope.$index"
            @click="
              (row, val) => onUploadOrWatch(row, 'graduationCertificate', val)
            "
          ></TableCellLink>
        </template>
        <!-- 双学位 -->
        <template #doubleDegree="{ scope, updateContent, editMode }">
          <TableCellRadio
            v-model="scope.row.doubleDegree"
            :update-content="updateContent"
            :edit-mode="editMode"
            dict-type="confirm"
          ></TableCellRadio>
        </template>
        <!-- 操作列 -->
        <template #operate="{ scope }">
          <TableCellOperate
            :row-index="scope.$index"
            :edit-row="editRow"
            :operating="operating"
            @save="onSaveRow"
            @del="onRemoveRow"
            @cancel="onCancelRow"
            @edit="setRowEditAble"
          ></TableCellOperate>
        </template>
      </BasicJsonPageTable>

      <!-- 毕业证上传/标记有误/取消标记有误弹窗 -->
      <SingleImageUploadDialog
        v-model:visible="singleImageUploadDialogVisible"
        :row-index="singleImageUploadDialogRowIndex"
        :field="singleImageUploadDialogField"
        :val="singleImageUploadDialogVal"
        title="毕业证"
        section="edu"
        :build-rules="buildSingleImageUploadDialogFormRules"
        :edit-mode="singleImageUploadDialogEditMode"
        :row-field-mark-error-map="eduSectionFieldMarkErrorMap"
        @change="onUploadImageChange"
      ></SingleImageUploadDialog>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEduStore } from './store/NewEduInfoStore'
import { LsyTableColumn } from './table.typing'
import { ref } from 'vue'
import BasicJsonPageTable from './BasicJsonPageTable.vue'
import { ElMessage, FormInstance, FormItemRule } from 'element-plus'
import TableCellSelect from './table-cells/TableCellSelect.vue'
import TableCellInput from './table-cells/TableCellInput.vue'
import TableCellRadio from './table-cells/TableCellRadio.vue'
import TableCellDateRange from './table-cells/TableCellDateRange.vue'
import TableCellLink from './table-cells/TableCellLink.vue'
import SingleImageUploadDialog from './SingleImageUploadDialog.vue'
import TableCellOperate from './table-cells/TableCellOperate.vue'
import NewSectionTitle from './NewSectionTitle.vue'
import { EditMode } from './typing'
import { computed } from 'vue'
import { watch } from 'vue'
import { PersonStatus } from '../mock-api/ApiTyping'

const eduStore = useEduStore()
const {
  addEmptyEduInfo,
  updateRangeDate,
  updateRowFieldVal,
  saveEduInfo,
  removeEduInfo,
  cancelEditEduInfo,
  setRowEditAble,
} = eduStore
const {
  status,
  tableData,
  eduSectionFieldMarkErrorMap,
  editRow,
  backTableData,
  operating,
} = storeToRefs(eduStore)
const titleErrorMsg = ref<string>('')
const elFormRef = ref<FormInstance>()
const singleImageUploadDialogVisible = ref<boolean>(false)
const singleImageUploadDialogField = ref<string>()
const singleImageUploadDialogVal = ref<string>()
const singleImageUploadDialogRowIndex = ref<number>()
const showAdd = ref<boolean>(false)
const showCancel = ref<boolean>(false)
const showEdit = ref<boolean>(false)
const showOperateCol = ref<boolean>(false)

/**
 * 判断图片上传弹窗可编辑条件之一: 当操作列可见,且当前编辑行和弹窗指向的行是同一行时, 可编辑
 */
function imageUploadDialogCanWritable() {
  return (
    showOperateCol.value &&
    singleImageUploadDialogRowIndex.value === editRow.value
  )
}
const singleImageUploadDialogEditMode = computed<EditMode>(() => {
  if (!status.value) {
    return 'readonly'
  } else {
    const statusStr = status.value
    if (statusStr === 'wait-fit') {
      return imageUploadDialogCanWritable() ? 'writable' : 'readonly'
    } else if (statusStr === 'wait-pass') {
      return 'markError'
    } else if (statusStr === 'reject') {
      return imageUploadDialogCanWritable() ? 'writable' : 'readonly'
    } else if (statusStr === 'already-pass') {
      return 'readonly'
    } else if (statusStr === 'already-giveUp') {
      return 'readonly'
    }
    return 'readonly'
  }
})

watch(
  status,
  newStatus => {
    if (!newStatus) {
      return
    }
    showOperateCol.value = false
    if (['wait-fit', 'reject', 'wait-pass'].indexOf(newStatus) >= 0) {
      showEdit.value = true
    } else {
      showEdit.value = false
    }
    showAdd.value = false
    showCancel.value = false
  },
  { immediate: true }
)
function commEditModel(row: number): EditMode {
  if (!status.value) {
    return 'readonly'
  } else {
    switch (status.value) {
      case 'wait-fit': {
        return editRow.value === row ? 'writable' : 'readonly'
      }
      case 'reject': {
        return editRow.value === row ? 'writable' : 'readonly'
      }
      case 'wait-pass': {
        return editRow.value === row ? 'writable' : 'markError'
      }
      case 'already-pass': {
        return 'readonly'
      }
      case 'already-giveUp': {
        return 'readonly'
      }
      default: {
        return 'readonly'
      }
    }
  }
}
const fieldArr = [
  'type',
  'school',
  'graduationCertificate',
  'doubleDegree',
  'mainGraduateDegreeDiploma',
  'secondGraduateDegreeDiploma',
  'graduateDegreeDiploma',
  'startDate',
  'endDate',
  'dateRange',
]
function validateRow(rowIndex: number, callback?: () => void) {
  const validateArr = fieldArr.map(item => `tableArr.${rowIndex}.${item}`)
  elFormRef.value?.validateField(validateArr, valid => {
    if (valid) {
      callback && callback()
    }
  })
}
function onSaveRow(rowIndex: number) {
  validateRow(rowIndex, () => {
    saveEduInfo(rowIndex)
  })
}
function onRemoveRow(row: number) {
  removeEduInfo(row).then(() => {
    validateEduCount()
  })
}
function onCancelRow(row: number) {
  cancelEditEduInfo(row)
  validateRow(row)
}
function onImageLinkClick(row: number, field: string, link?: string) {
  console.log(row, field, link)
}
function onDateRangeChange(rowIndex: number, val: [string, string]) {
  updateRangeDate(rowIndex, val)
}
function onUploadOrWatch(rowIndex: number, field: string, val?: string) {
  singleImageUploadDialogVisible.value = true
  singleImageUploadDialogRowIndex.value = rowIndex
  singleImageUploadDialogField.value = field
  singleImageUploadDialogVal.value = val
}
function onUploadImageChange(rowIndex: number, field: string, val?: string) {
  updateRowFieldVal(rowIndex, field, val)
  if (rowIndex >= 0 && field) {
    elFormRef.value?.validateField(`tableArr.${rowIndex}.${field}`)
  }
}
/**
 * 自定义表单验证规则:标记有误验证规则.
 *
 * 当存在标记有误数据，且新值与旧值一致, 则验证失败, 否则验证通过
 */
function onValidateMarkError(
  row: number,
  field: string,
  val: any,
  callback: (error?: string | Error) => void
) {
  // 获取字段的标记有误信息
  const markErrorMap = eduSectionFieldMarkErrorMap.value.get(row)
  if (!markErrorMap) {
    callback()
    return
  }
  const errorText = markErrorMap.get(field)
  if (status.value === 'reject' || status.value === 'wait-pass') {
    if (
      errorText &&
      backTableData.value &&
      backTableData.value.tableArr &&
      backTableData.value.tableArr.length > 0
    ) {
      // 存在标记有误
      // @ts-ignore
      if (backTableData.value.tableArr[row][field] === val) {
        // 存在标记有误，且新旧数据一致，则认为验证失败
        callback(errorText.msg)
        return
      } else if (
        val instanceof Array ||
        // @ts-ignore
        backTableData.value.tableArr[row][field] instanceof Array
      ) {
        if (
          JSON.stringify(val) ===
          // @ts-ignore
          JSON.stringify(backTableData.value.tableArr[row][field])
        ) {
          callback(errorText.msg)
          return
        }
      }
    }
  }
  callback()
}

function buildSingleImageUploadDialogFormRules(
  row: number,
  field: string
): FormItemRule[] {
  return [
    {
      validator: (_, val, callback) => {
        onValidateMarkError(row, field, val, callback)
      },
    },
  ]
}
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'type',
    label: '教育类型',
    slotName: 'type',
    isFormItem: true,
    elTableColumnProps: {
      width: 180,
    },
    editMode: (row: number) => commEditModel(row),
    rules: (row: number, field: string) => [
      {
        required: true,
        message: '该项必填',
      },
      {
        validator: (_, val, callback) =>
          onValidateMarkError(row, field, val, callback),
      },
    ],
  },
  {
    prop: 'school',
    label: '学校',
    slotName: 'school',
    isFormItem: true,
    editMode: (row: number) => commEditModel(row),
    rules: (row: number, field: string) => [
      {
        required: true,
        message: '该项必填',
      },
      {
        validator: (_, val, callback) =>
          onValidateMarkError(row, field, val, callback),
      },
    ],
    elTableColumnProps: {
      width: 260,
    },
  },
  {
    prop: 'doubleDegree',
    label: '双学位',
    slotName: 'doubleDegree',
    isFormItem: true,
    elTableColumnProps: {
      width: 160,
    },
    editMode: (row: number) => commEditModel(row),
    rules: (row: number, field: string) => [
      {
        required: true,
        message: '该项必填',
      },
      {
        validator: (_, val, callback) =>
          onValidateMarkError(row, field, val, callback),
      },
    ],
  },
  {
    prop: 'dateRange',
    label: '开始-结束日期',
    slotName: 'dateRange',
    isFormItem: true,
    elTableColumnProps: {
      width: 280,
    },
    editMode: (row: number) => commEditModel(row),
    rules: (row: number, field: string) => [
      {
        required: true,
        message: '该项必填',
      },
      {
        validator: (_, val, callback) =>
          onValidateMarkError(row, field, val, callback),
      },
    ],
  },
  {
    prop: 'graduationCertificate',
    label: '毕业证',
    slotName: 'graduationCertificate',
    isFormItem: true,
    elTableColumnProps: {
      width: 180,
    },
    // 毕业证列,比较特殊,在table中,只有可写状态, 因为真正的可写,可标记有误,只读控制都在 SingleImageUploadDialog 中
    editMode: 'writable',
    rules: (row: number, field: string) => [
      {
        required: true,
        message: '该项必填',
      },
      {
        validator: (_, val, callback) =>
          onValidateMarkError(row, field, val, callback),
      },
    ],
  },
  {
    label: '操作',
    slotName: 'operate',
    show: () => showOperateCol.value,
    elTableColumnProps: {
      width: 140,
    },
  },
])
function onAdd() {
  addEmptyEduInfo()
}
function onEdit() {
  if (operating.value) {
    return
  }
  showAdd.value = true
  showCancel.value = true
  showEdit.value = false
  showOperateCol.value = true
}
function onCancel() {
  validateEduCount()
  if (editRow.value >= 0) {
    ElMessage.info({
      message: '请先保存或取消编辑中的行',
      showClose: true,
    })
    return
  }
  if (operating.value) {
    return
  }
  showAdd.value = false
  showCancel.value = false
  showEdit.value = true
  showOperateCol.value = false
}
function validateEduCount() {
  if (!tableData.value || tableData.value.tableArr.length <= 0) {
    titleErrorMsg.value = '必填'
    return Promise.reject('必填')
  }
  titleErrorMsg.value = ''
  return Promise.resolve()
}
/**
 * 验证当前界面是否处于编辑状态
 */
function validateIsEdit() {
  if (showOperateCol.value) {
    const msg = '教育信息-请先取消编辑或保存编辑结果'
    ElMessage.info(msg)
    return Promise.reject(msg)
  }
  return Promise.resolve()
}
function onValidateRowField(row: number, field: string) {
  elFormRef.value?.validateField(`tableArr.${row}.${field}`)
}
async function formValidate() {
  const validateRetArr = await Promise.allSettled([
    validateEduCount(),
    elFormRef.value?.validate(),
    validateIsEdit(),
  ])
  const rejectedArr = validateRetArr.filter(item => item.status === 'rejected')
  if (rejectedArr.length > 0) {
    throw rejectedArr
  }
}
function formClearValidate() {
  titleErrorMsg.value = ''
  elFormRef.value?.clearValidate()
}
defineExpose({
  formValidate,
  formClearValidate,
})
</script>

<style scoped></style>
