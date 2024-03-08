<template>
  <LsyJsonPageTable
    :index-column="true"
    :column-arr="columnArr"
    :table-data="tableData"
    :total="3"
    :fit-all-content="false"
  >
    <template #name="{ column, scope }">
      <el-tag>{{ `${column.prop}: ${scope.row.name}` }}</el-tag>
    </template>
    <template #operation="{ scope }">
      <el-button size="small" @click="onDel(scope.row, scope.index)"
        >删除</el-button
      >
    </template>
  </LsyJsonPageTable>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo09' })
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
function onDel(user: UserInfo, index: number) {
  ElMessage({
    message: `删除:${user.name}`,
    type: 'success',
  })
  tableData.value.splice(index, 1)
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
  },
  {
    prop: 'male',
    label: '性别',
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
