<template>
  <div class="flex flex-col o-wrapper-form h-52">
    <small class="mb-3 flex-shrink-0">
      此示例中的第一列checkbox，无实际意义，只是用于演示修正有el-form-item和没有el-form-item单元格内元素高度位置不统一问题
    </small>
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
            :rules="fieldRulesMap.get('name')"
          >
            <el-input
              v-if="rowIndex === editRowIndex"
              v-model="scope.row.name"
            ></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </el-form-item>
        </template>
        <!-- 年龄列 -->
        <template #age="{ scope, rowIndex }">
          <el-form-item
            :prop="`list.${rowIndex}.age`"
            :rules="fieldRulesMap.get('age')"
          >
            <el-input
              v-if="scope.$index === editRowIndex"
              v-model="scope.row.age"
            ></el-input>
            <span v-else>{{ scope.row.age }}</span>
          </el-form-item>
        </template>
        <!-- 性别列 -->
        <template #male="{ scope, rowIndex, column }">
          <el-form-item
            :prop="`list.${rowIndex}.male`"
            :rules="fieldRulesMap.get('male')"
          >
            <el-select
              v-if="scope.$index === editRowIndex"
              v-model="scope.row.male"
            >
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
              <el-option label="未知" :value="3" />
            </el-select>
            <span v-else>
              {{
                column.dictionaryConvert
                  ? column.dictionaryConvert(scope.row)
                  : scope.row.male
              }}
            </span>
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
            <el-button size="small" class="mb-3" @click="onCancel(rowIndex)">
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
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { FormItemRule, FormInstance } from 'element-plus'
import { ref } from 'vue'

defineOptions({ name: 'EditableRowTableDemo02' })

const fieldRulesMap = new Map<string, FormItemRule[]>()
fieldRulesMap.set('name', [{ required: true, message: '该项必填' }])
fieldRulesMap.set('age', [
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
])
fieldRulesMap.set('male', [
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
])

interface UserInfo {
  name: string
  age: number
  male: number
}
interface TableData<T> {
  list: T[]
}
const tableData = ref<TableData<UserInfo>>({
  list: [
    { name: '张三', age: 12, male: 1 },
    { name: '里斯', age: 22, male: 2 },
    { name: '王五', age: 32, male: 3 },
  ],
})

const editRowIndex = ref<number>(-1)
function showEditBtn(rowIndex: number) {
  if (editRowIndex.value === -1) {
    return true
  }
  return editRowIndex.value !== rowIndex
}
let backBeforeEditRowData: UserInfo
function onEditRow(rowIndex: number, rowData: UserInfo) {
  editRowIndex.value = rowIndex
  backBeforeEditRowData = { ...rowData }
}
const elFormRef = ref<FormInstance>()
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
    }
  })
}
function onCancel(rowIndex: number) {
  tableData.value.list[editRowIndex.value] = { ...backBeforeEditRowData }
  editRowIndex.value = -1
  const fieldArr = ['name', 'age', 'male', 'hobby'].map(
    fieldName => `list.${rowIndex}.${fieldName}`
  )
  elFormRef.value?.clearValidate(fieldArr)
}
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
