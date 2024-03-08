<template>
  <JsonPageTable
    :fit-all-content="false"
    :index-column="true"
    :column-arr="columnArr"
    :table-data="tableData"
    :total="3"
    :el-table-props="elTableProps"
  ></JsonPageTable>
</template>

<script setup lang="ts">
import JsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { ElTableProp, LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo03' })
interface UserInfo {
  name: string
  age: number
  male: number
}
const tableData = ref<UserInfo[]>([
  { name: '张三', age: 12, male: 1 },
  { name: '里斯', age: 22, male: 2 },
  { name: '王五', age: 32, male: 3 },
  { name: '黄飞鸿', age: 32, male: 3 },
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
  border: true,
}
</script>

<style scoped></style>
