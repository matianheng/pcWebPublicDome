<template>
  <el-card class="mb-3">
    <template #header>
      <SectionTitle :title="`教育信息`"></SectionTitle>
    </template>
    <el-form ref="elFormRef" :model="tableData">
      <LsyJsonPageTable
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData.tableArr"
        :enable-pagination="false"
      >
        <!-- 教育类型 -->
        <template #type="{ scope }">
          <EditableInputMarkErrorTableCell
            :value="scope.row.type"
            :edit-row-index="editRowIndex"
            :row-index="scope.$index"
            field="type"
            :build-rules="buildRulesWrapper"
            :get-row-field-error-msg="getRowFieldErrorMsg"
            :disabled="true"
            @on-clear-mark-error="onClearMarkError"
            @on-save-mark-error="onSaveMarkError"
          >
            <template #default="{ updateShowText, renderDom }">
              <RemoteDicSelect
                v-model:value="scope.row.type"
                :render-dom="renderDom"
                dict-type="edu"
                :update-show-text="updateShowText"
              ></RemoteDicSelect>
            </template>
          </EditableInputMarkErrorTableCell>
        </template>
        <!-- 学校名称 -->
        <template #school="{ scope }">
          <EditableInputMarkErrorTableCell
            :value="scope.row.school"
            :edit-row-index="editRowIndex"
            :row-index="scope.$index"
            field="school"
            :build-rules="buildRulesWrapper"
            :get-row-field-error-msg="getRowFieldErrorMsg"
            :disabled="true"
            @on-clear-mark-error="onClearMarkError"
            @on-save-mark-error="onSaveMarkError"
          >
            <el-input v-model="scope.row.school"></el-input>
          </EditableInputMarkErrorTableCell>
        </template>
        <!-- 毕业证 -->
        <template #graduationCertificate="{ scope }">
          <el-form-item
            :prop="`tableArr.${scope.$index}.graduationCertificate`"
            :rules="buildRulesWrapper(scope.$index, 'graduationCertificate')"
          >
            <MarkErrorPopover
              :val="scope.row.graduationCertificate"
              :mark-error="
                getRowFieldErrorMsg(scope.$index, 'graduationCertificate')
              "
              :disabled="true"
            >
              <UploadLink
                v-model:imageUrl="scope.row.graduationCertificate"
                :disabled="editRowIndex !== scope.$index"
                @preview="onPreview"
              >
              </UploadLink>
            </MarkErrorPopover>
          </el-form-item>
        </template>
        <!-- 是否双学位 -->
        <template #doubleDegree="{ scope }">
          <EditableInputMarkErrorTableCell
            :value="scope.row.doubleDegree"
            :edit-row-index="editRowIndex"
            :row-index="scope.$index"
            field="doubleDegree"
            :build-rules="buildRulesWrapper"
            :get-row-field-error-msg="getRowFieldErrorMsg"
            :disabled="true"
            @on-clear-mark-error="onClearMarkError"
            @on-save-mark-error="onSaveMarkError"
          >
            <template #default="{ updateShowText, renderDom }">
              <RemoteDicSelect
                v-model:value="scope.row.doubleDegree"
                :render-dom="renderDom"
                dict-type="confirm"
                :update-show-text="updateShowText"
              ></RemoteDicSelect>
            </template>
          </EditableInputMarkErrorTableCell>
        </template>
        <!-- 学位证书 -->
        <template #graduateDegreeDiploma="{ scope }">
          <el-form-item
            :prop="`tableArr.${scope.$index}.graduateDegreeDiploma`"
            :rules="buildRulesWrapper(scope.$index, 'graduateDegreeDiploma')"
          >
            <GraduateDegreeDiplomaLink
              v-model:graduateDegreeDiploma="scope.row.graduateDegreeDiploma"
              :row-index="scope.$index"
              mode="preview"
              @open-preview-dialog="onOpenPreviewGraduateDegreeDiplomaDialog"
            ></GraduateDegreeDiplomaLink>
          </el-form-item>
        </template>
        <!-- 开始时间 -->
        <template #startDate="{ scope }">
          {{ scope.row.startDate }}
        </template>
        <!-- 结束时间 -->
        <template #endDate="{ scope }">
          {{ scope.row.endDate }}
        </template>
        <!-- 操作 -->
        <template #operation="{ scope }">
          <template v-if="showEditBtn(scope.$index)">
            <el-button
              size="small"
              type="primary"
              class="mb-3"
              @click="onEditRow(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              class="mb-3"
              @click="onValidate(scope.$index)"
            >
              行数据验证
            </el-button>
          </template>
          <template v-else>
            <el-button
              size="small"
              class="mb-3"
              type="primary"
              @click="onSave(scope.$index)"
            >
              保存
            </el-button>
            <el-button size="small" class="mb-3" @click="onCancel">
              取消
            </el-button>
          </template>
        </template>
      </LsyJsonPageTable>
    </el-form>
    <el-dialog
      v-model="picPreviewDialogVisible"
      title="预览"
      width="max-content"
    >
      <el-avatar shape="square" :size="260" fit="fill" :src="picPreviewUrl" />
    </el-dialog>
    <GraduateDegreeDiplomaDialog
      v-model="graduateDegreeDiplomaDialogVisible"
      :row-index="previewGraduateDegreeDiplomaRowIndex"
      :graduate-degree-diploma="previewGraduateDegreeDiploma"
      :mode="previewGraduateDegreeDiplomaMode"
      :get-row-field-error-msg="getRowFieldErrorMsg"
      :on-validate-mark-error="onValidateMarkError"
    ></GraduateDegreeDiplomaDialog>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, toRefs } from 'vue'
import { EduInfoType, GraduateDegreeDiploma } from '../mock-api/ApiTyping'
import { computed } from 'vue'
import { ref } from 'vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { FormInstance, FormItemRule } from 'element-plus'
import { FormItemRuleFactoryMethod } from '../table/editable-row-table-demo/useEditableRowTableDemo03'
import type { SaveMarkErrorCallback } from './typing'
import EditableInputMarkErrorTableCell from './table-cells/EditableInputMarkErrorTableCell.vue'
import SectionTitle from './SectionTitle.vue'
import { cloneDeep } from 'lodash-unified'
import { watch } from 'vue'
import RemoteDicSelect from './table-cells/RemoteDicSelect.vue'
import UploadLink from './table-cells/UploadLink.vue'
import MarkErrorPopover from './MarkErrorPopover.vue'
import GraduateDegreeDiplomaLink from './table-cells/GraduateDegreeDiplomaLink.vue'
import GraduateDegreeDiplomaDialog from './GraduateDegreeDiplomaDialog.vue'

interface FormTableData<T> {
  tableArr: T[]
}

/**
 * 教育信息
 */
defineOptions({ name: 'EduInfo' })

const props = withDefaults(
  defineProps<{
    /**
     * 可用字段(可见或可编辑字段)
     */
    availableFieldArr?: string[]
    /**
     * 备份数据数据(用于取消操作，恢复数据)
     */
    backData?: EduInfoType[]
    /**
     * 表格数据(v-model)
     */
    tableArr?: EduInfoType[]
    /**
     * 数据状态
     * wait-fit: 待填写
     * reject: 拒绝
     * wait-pass: 待审核
     * already-pass: 已通过
     * already-giveUp: 已放弃
     */
    status: string
    /**
     * 字段标记有误信息
     * 最外层map的key为行号, value为行字段的标记有误数据
     * 里层map的key为字段名，value为错误提示信息
     */
    rowsFieldMarkErrorMap?: Map<number, Map<string, string>>
  }>(),
  {
    backData: undefined,
    tableArr: () => [],
    availableFieldArr: () => [],
    rowsFieldMarkErrorMap: () => new Map(),
    loading: true,
  }
)

const $emits = defineEmits<{
  'update:tableArr': [val: EduInfoType[]]
}>()
const picPreviewDialogVisible = ref<boolean>(false)
const graduateDegreeDiplomaDialogVisible = ref<boolean>(false)
const previewGraduateDegreeDiploma = ref<GraduateDegreeDiploma | undefined>()
const previewGraduateDegreeDiplomaRowIndex = ref<number>(-1)
const previewGraduateDegreeDiplomaMode = ref<
  'upload' | 'markError' | 'preview'
>('markError')
const picPreviewUrl = ref<string>('')
const elFormRef = ref<FormInstance>()
const { tableArr, rowsFieldMarkErrorMap, status, backData } = toRefs(props)
const editRowIndex = ref<number>(-1)
const backBeforeEditRowData = ref<EduInfoType | undefined>()
let executeOnceMarkErrorValidate = false
watch(
  [elFormRef, tableArr, status, rowsFieldMarkErrorMap],
  ([newElFormRef, newTableArr, newStatus, newRowsFieldMarkErrorMap]) => {
    if (
      !executeOnceMarkErrorValidate &&
      newElFormRef &&
      newStatus === 'reject' &&
      newTableArr &&
      newTableArr.length > 0 &&
      newRowsFieldMarkErrorMap.size > 0
    ) {
      // 如果当前状态是已拒绝，尚未执行过初始的标记有误验证，且界面和数据都已经加载完毕，且存在标记有误数据，则执行一次标记有误验证
      nextTick(() => {
        // 必须在nextTick执行验证，否则data可能还没填充上去，验证已经执行了，那就可能会导致非空验证的错误提示信息出现在填了数据的表单项上
        newElFormRef?.validate()
      })
      executeOnceMarkErrorValidate = false
    }
  }
)
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
      tableData.value.tableArr[oldEditRowIndex] = oldBackBeforeEditRowData
    }
  }
)
function convert(
  eduInfoArr: EduInfoType[],
  deleteGraduateDegreeDiploma?: boolean
): EduInfoType[] {
  let ret: EduInfoType[] = []
  if (eduInfoArr && eduInfoArr.length > 0) {
    ret = eduInfoArr.map(item => {
      let one: EduInfoType = {
        ...cloneDeep(item),
      }
      if (deleteGraduateDegreeDiploma) {
        delete item.graduateDegreeDiploma
      } else if (one.mainGraduateDegreeDiploma) {
        let graduateDegreeDiploma: GraduateDegreeDiploma = {
          mainGraduateDegreeDiploma: one.mainGraduateDegreeDiploma,
          secondGraduateDegreeDiploma: one.secondGraduateDegreeDiploma,
          doubleDegree: one.doubleDegree,
        }
        one.graduateDegreeDiploma = graduateDegreeDiploma
      }
      return one
    })
  }
  return ret
}
const tableData = computed<FormTableData<EduInfoType>>({
  get() {
    const arr = convert(tableArr.value)
    console.log('arr', arr)
    return {
      tableArr: arr,
    }
  },
  set(val: FormTableData<EduInfoType>) {
    $emits('update:tableArr', convert(val.tableArr, true))
  },
})
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'type',
    label: '教育类型',
    slotName: 'type',
  },
  {
    prop: 'school',
    label: '学校名称',
    slotName: 'school',
    elTableColumnProps: {
      width: '180',
    },
  },
  {
    prop: 'graduationCertificate',
    label: '毕业证',
    slotName: 'graduationCertificate',
  },
  {
    prop: 'doubleDegree',
    label: '是否双学位',
    slotName: 'doubleDegree',
    elTableColumnProps: {
      width: '110',
    },
  },
  {
    prop: 'graduateDegreeDiploma',
    label: '学位证书',
    slotName: 'graduateDegreeDiploma',
    elTableColumnProps: {
      width: '260',
    },
  },
  {
    prop: 'startDate',
    label: '开始时间',
    slotName: 'startDate',
    elTableColumnProps: {
      width: '110',
    },
  },
  {
    prop: 'endDate',
    label: '结束时间',
    slotName: 'endDate',
    elTableColumnProps: {
      width: '110',
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
function onValidateMarkError(
  rowIndex: number,
  field: string,
  callback: (error?: string | Error) => void
) {
  if (rowIndex < 0) {
    callback()
    return
  }
  // 获取字段的标记有误信息
  const fieldMarkErrorMap = rowsFieldMarkErrorMap.value.get(rowIndex)
  if (!fieldMarkErrorMap) {
    callback()
    return
  }
  let errorText = fieldMarkErrorMap.get(field)
  console.log('onValidateMarkError', field, rowIndex, errorText)
  if (field === 'graduateDegreeDiploma') {
    let tmp = fieldMarkErrorMap.get('mainGraduateDegreeDiploma')
    if (tmp) {
      errorText = tmp
    }
    tmp = fieldMarkErrorMap.get('secondGraduateDegreeDiploma')
    if (tmp) {
      if (errorText) {
        errorText += `, ${tmp}`
      } else {
        errorText = tmp
      }
    }
  }
  if (status.value === 'wait-pass') {
    errorText ? callback(errorText) : callback()
    return
  } else if (status.value === 'reject') {
    const bd = backData.value
    const ta = tableArr.value
    if (errorText && bd && bd.length > 0 && ta && ta.length > 0) {
      // 存在标记有误
      // @ts-ignore
      let oldFieldVal = bd[rowIndex] ? bd[rowIndex][field] : undefined
      // @ts-ignore
      let newFieldVal = ta[rowIndex] ? ta[rowIndex][field] : undefined
      if (oldFieldVal === newFieldVal) {
        // 存在标记有误，且新旧数据一致，则认为验证失败
        callback(errorText)
        return
      }
    }
  }
  callback()
}
const fieldRulesMap = new Map<
  string,
  FormItemRule[] | FormItemRuleFactoryMethod
>()
fieldRulesMap.set('graduationCertificate', (rowIndex: number) => [
  {
    validator: (_, v, callback) =>
      onValidateMarkError(rowIndex, 'graduationCertificate', callback),
  },
  {
    required: true,
    message: '该项必填',
  },
])
fieldRulesMap.set('graduateDegreeDiploma', (rowIndex: number) => [
  {
    validator: (_, v, callback) =>
      onValidateMarkError(rowIndex, 'graduateDegreeDiploma', callback),
  },
])
function buildRulesWrapper(rowIndex: number, field: string) {
  return buildRules(rowIndex, fieldRulesMap.get(field))
}
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
function getRowFieldErrorMsg(rowIndex: number, field: string) {
  const map = rowsFieldMarkErrorMap.value.get(rowIndex)
  if (map) {
    return map.get(field)
  } else {
    return ''
  }
}
function onClearMarkError(rowIndex: number, fieldName: string) {
  // const tmp = cloneDeep(rowsFieldMarkErrorMap.value)
  // const map = tmp.get(rowIndex)
  // if (map) {
  //   map.delete(fieldName)
  //   if (map.size === 0) {
  //     // 该行已经没有标记有误数据了，则将该行整个删除
  //     tmp.delete(rowIndex)
  //   }
  //   $emits('')
  // }
}
function onSaveMarkError(
  rowIndex: number,
  errorMsg: string,
  fieldName: string,
  callback: SaveMarkErrorCallback
) {
  // let map = rowsFieldErrorMap.value.get(rowIndex)
  // if (!map) {
  //   map = new Map()
  //   rowsFieldErrorMap.value.set(rowIndex, map)
  // }
  // map.set(fieldName, errorMsg)
  // callback(true)
  // onValidate(rowIndex)
}
function showEditBtn(rowIndex: number) {
  if (editRowIndex.value === -1) {
    return true
  }
  return editRowIndex.value !== rowIndex
}
function onEditRow(rowIndex: number, rowData: EduInfoType) {
  editRowIndex.value = rowIndex
  backBeforeEditRowData.value = cloneDeep(rowData)
}
const allFieldList = [
  'type',
  'school',
  'graduationCertificate',
  'doubleDegree',
  'mainGraduateDegreeDiploma',
  'secondGraduateDegreeSDiploma',
  'startDate',
  'endDate',
]
function onValidate(rowIndex: number) {
  const fieldArr = allFieldList.map(
    fieldName => `tableArr.${rowIndex}.${fieldName}`
  )
  elFormRef.value?.validateField(fieldArr)
}
function onSave(rowIndex: number) {
  // -important- 这里故意加了一个hobby字段, 就是为了测试如果有一个不存在prop, validateField 能否正常运行, 结果是可以的
  // 为什么要加这个不存在的hobby字段? 因为当前场景是动态表单, 字段可能是不确定的, 如果必须要和prop的一致，那无疑会增加代码复杂度，幸好无需如此，将所有字段写上去即可
  const fieldArr = allFieldList.map(
    fieldName => `tableArr.${rowIndex}.${fieldName}`
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
    tableData.value.tableArr[editRowIndex.value] = cloneDeep(
      backBeforeEditRowData.value
    )
    backBeforeEditRowData.value = undefined
  }
  editRowIndex.value = -1
}
function onPreview(imageUrl: string) {
  console.log(imageUrl)
  picPreviewUrl.value = imageUrl
  picPreviewDialogVisible.value = true
}
function onOpenPreviewGraduateDegreeDiplomaDialog(
  rowIndex: number,
  mode: 'upload' | 'markError' | 'preview',
  graduateDegreeDiploma?: GraduateDegreeDiploma
) {
  console.log('graduateDegreeDiploma', graduateDegreeDiploma)
  previewGraduateDegreeDiploma.value = graduateDegreeDiploma
  previewGraduateDegreeDiplomaRowIndex.value = rowIndex
  graduateDegreeDiplomaDialogVisible.value = true
}
</script>

<style scoped></style>
