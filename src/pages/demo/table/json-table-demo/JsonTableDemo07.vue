<template>
  <div class="flex flex-col">
    <div class="mb-3">当前选中数据: {{ selectedRows }}</div>
    <LsyJsonPageTable
      :fit-all-content="false"
      :selection-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :el-table-props="elTableProps"
      :el-table-evt="elTableEvt"
    ></LsyJsonPageTable>
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { ElTableProp, LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo06' })
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
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'name',
    label: '姓名',
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
])
const elTableProps: ElTableProp = {
  'highlight-current-row': true,
}
const selectedRows = ref<UserInfo[]>([])
const elTableEvt = {
  'selection-change': (val: UserInfo[]) => {
    selectedRows.value = val
  },
}
</script>

<style scoped></style>
