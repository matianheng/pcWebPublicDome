<template>
  <div class="flex flex-col o-wrapper-form h-150">
    <div class="flex-shrink-0">
      <small class="mb-3">
        此示例中的第一列checkbox，无实际意义，只是用于演示修正有el-form-item和没有el-form-item单元格内元素高度位置不统一问题
      </small>
      <small class="mb-3">标记有误数据: {{ rowsFieldErrorMap }}</small>
      <small
        >如果字段的rules值与初始的不同，则会自动执行。这话体现在哪里？</small
      >
      <small>
        1.
        第二行的年龄，以及第三行的姓名，在所有数据加载完毕之后，并未触发rules验证
      </small>
      <small>
        2. 第一行的姓名和年龄，以及第三行的年龄和性别，由于 rowsFieldErrorMap
        中包含了他们的标记有误数据，会让el-form认为，这些单元格的rules与初始rules不一致，因此会使用新rules对对应单元格执行一次规则验证
      </small>
      <small class="mb-3">
        3.
        因为年龄存在两个验证规则，一个是验证是否至少18岁，一个验证是否有标记有误，又因为默认情况下某个el-form-item如果绑定了多个验证规则，会按顺序执行，并且该el-form-item的验证规则，会在第一个验证失败的时候，停止执行该el-form-item的后续验证规则
      </small>
    </div>
    <el-form ref="elFormRef" :model="tableData" class="flex-1 h-0">
      <LsyJsonPageTable
        :index-column="true"
        :selection-column="true"
        :column-arr="columnArr"
        :table-data="tableData.list"
        :enable-pagination="false"
      >
        <!-- 姓名列 -->
        <template #name="{ scope, rowIndex }">
          <el-form-item
            :prop="`list.${rowIndex}.name`"
            :rules="buildRules(rowIndex, fieldRulesMap.get('name'))"
          >
            <el-input
              v-if="rowIndex === editRowIndex"
              v-model="scope.row.name"
            ></el-input>
            <MarkErrorPopover
              v-else
              :val="scope.row.name"
              :mark-error="getRowFieldErrorMsg(rowIndex, 'name')"
              @on-clear-mark-error="() => onClearMarkError(rowIndex, 'name')"
              @on-save-mark-error="
                (errorMsg:string, callback:SaveMarkErrorCallback) =>
                  onSaveMarkError(rowIndex, 'name', errorMsg, callback)
              "
            ></MarkErrorPopover>
          </el-form-item>
        </template>
        <!-- 年龄列 -->
        <template #age="{ scope, rowIndex }">
          <el-form-item
            :prop="`list.${rowIndex}.age`"
            :rules="buildRules(rowIndex, fieldRulesMap.get('age'))"
          >
            <el-input
              v-if="scope.$index === editRowIndex"
              v-model="scope.row.age"
            ></el-input>
            <MarkErrorPopover
              v-else
              :val="scope.row.age"
              :mark-error="getRowFieldErrorMsg(rowIndex, 'age')"
              @on-clear-mark-error="() => onClearMarkError(rowIndex, 'age')"
              @on-save-mark-error="
                (errorMsg:string, callback:SaveMarkErrorCallback) =>
                  onSaveMarkError(rowIndex, 'age', errorMsg, callback)
              "
            ></MarkErrorPopover>
          </el-form-item>
        </template>
        <!-- 性别列 -->
        <template #male="{ scope, rowIndex, column }">
          <el-form-item
            :prop="`list.${rowIndex}.male`"
            :rules="buildRules(rowIndex, fieldRulesMap.get('male'))"
          >
            <!-- 
              // -important- 这里v-model的值，不能通过 tableData.list[rowIndex].male 方式获取，因为在渲染的这段代码的时候, tableData.list[rowIndex] 这里可能会拿到 undefined 值, 从undefined取数据会语法报错
            -->
            <el-select
              v-if="scope.$index === editRowIndex"
              v-model="scope.row.male"
            >
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
              <el-option label="未知" :value="3" />
            </el-select>
            <MarkErrorPopover
              v-else
              :val="
                column.dictionaryConvert
                  ? column.dictionaryConvert(scope.row)
                  : scope.row.male
              "
              :mark-error="getRowFieldErrorMsg(rowIndex, 'male')"
              @on-clear-mark-error="() => onClearMarkError(rowIndex, 'male')"
              @on-save-mark-error="
                (errorMsg:string, callback:SaveMarkErrorCallback) =>
                  onSaveMarkError(rowIndex, 'male', errorMsg, callback)
              "
            ></MarkErrorPopover>
          </el-form-item>
        </template>
        <!-- 操作列 -->
        <template #operation="{ scope, rowIndex }">
          <template v-if="showEditBtn(rowIndex)">
            <el-button
              size="small"
              type="primary"
              class="mb-3"
              @click="onEditRow(rowIndex, scope.row)"
            >
              编辑
            </el-button>
            <el-button size="small" class="mb-3" @click="onValidate(rowIndex)">
              行数据验证
            </el-button>
          </template>
          <template v-else>
            <el-button
              size="small"
              class="mb-3"
              type="primary"
              @click="onSave(rowIndex)"
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
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'

import MarkErrorPopover, { SaveMarkErrorCallback } from './MarkErrorPopover.vue'

import {
  useFormItemRules,
  useRowEditable,
  useInit,
} from './useEditableRowTableDemo03'

defineOptions({ name: 'EditableRowTableDemo03' })

const {
  columnArr,
  rowsFieldErrorMap,
  tableData,
  editRowIndex,
  elFormRef,
  backBeforeEditRowData,
  init,
} = useInit()
const { fieldRulesMap, buildRules, getRowFieldErrorMsg } =
  useFormItemRules(rowsFieldErrorMap)
const {
  showEditBtn,
  onEditRow,
  onValidate,
  onSave,
  onCancel,
  onClearMarkError,
  onSaveMarkError,
} = useRowEditable(
  editRowIndex,
  tableData,
  rowsFieldErrorMap,
  backBeforeEditRowData,
  // @ts-ignore
  elFormRef
)

init()
</script>

<style scoped lang="scss">
// 修正包含el-form-item与不包含el-form-item的单元格内元素的高度位置不统一问题
.o-wrapper-form {
  ::v-deep(.el-table .el-table__cell) {
    padding-bottom: 0;
    padding-top: 15px;
  }
  ::v-deep(.el-form-item) {
    margin-bottom: 15px;
  }
  ::v-deep(.o-index-cell) {
    margin-bottom: 0.75rem;
  }
  ::v-deep(.el-table__body .el-table__row td:first-child) {
    padding-bottom: 0.75rem;
  }
  ::v-deep(.el-table__header thead th.el-table__cell) {
    padding-bottom: 0.7rem;
  }
}
</style>
