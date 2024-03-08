<template>
  <div class="flex flex-col h-56">
    <el-form ref="elFormRef" :model="editRowData" class="h-full">
      <LsyJsonPageTable
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :enable-pagination="false"
      >
        <!-- 姓名列 -->
        <template #name="{ scope }">
          <el-form-item
            v-if="scope.$index === editRowIndex"
            prop="name"
            :rules="fieldRulesMap.get('name')"
          >
            <el-input v-model="editRowData.name"></el-input>
          </el-form-item>
          <span v-else>{{ scope.row.name }}</span>
        </template>
        <!-- 年龄列 -->
        <template #age="{ scope }">
          <el-form-item
            v-if="scope.$index === editRowIndex"
            prop="age"
            :rules="fieldRulesMap.get('age')"
          >
            <el-input v-model="editRowData.age"></el-input>
          </el-form-item>
          <span v-else>{{ scope.row.age }}</span>
        </template>
        <!-- 性别列 -->
        <template #male="{ scope, column }">
          <el-form-item
            v-if="scope.$index === editRowIndex"
            prop="male"
            :rules="fieldRulesMap.get('male')"
          >
            <el-select v-model="editRowData.male">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
              <el-option label="未知" :value="3" />
            </el-select>
          </el-form-item>
          <span v-else>
            {{
              column.dictionaryConvert
                ? column.dictionaryConvert(scope.row)
                : scope.row.male
            }}
          </span>
        </template>
        <!-- 操作列 -->
        <template #operation="{ scope }">
          <el-button
            v-if="showEditBtn(scope.$index)"
            size="small"
            type="primary"
            @click="onEditRow(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <template v-else>
            <el-button size="small" type="primary" @click="onSave()">
              保存
            </el-button>
            <el-button size="small" @click="onCancel()"> 取消 </el-button>
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

defineOptions({ name: 'EditableRowTableDemo01' })

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
const tableData = ref<UserInfo[]>([
  { name: '张三', age: 12, male: 1 },
  { name: '里斯', age: 22, male: 2 },
  { name: '王五', age: 32, male: 3 },
])

const editRowIndex = ref<number>(-1)
function showEditBtn(rowIndex: number) {
  if (editRowIndex.value === -1) {
    return true
  }
  return editRowIndex.value !== rowIndex
}
const editRowData = ref<UserInfo>({
  name: '',
  age: 0,
  male: 3,
})
let backBeforeEditRowData: UserInfo
function onEditRow(rowIndex: number, rowData: UserInfo) {
  editRowIndex.value = rowIndex
  editRowData.value = rowData
  backBeforeEditRowData = { ...rowData }
}
const elFormRef = ref<FormInstance>()
function onSave() {
  elFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      tableData.value[editRowIndex.value] = editRowData.value
      editRowIndex.value = -1
    }
  })
}
function onCancel() {
  tableData.value[editRowIndex.value] = { ...backBeforeEditRowData }
  editRowIndex.value = -1
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
  },
])
</script>

<style scoped></style>
