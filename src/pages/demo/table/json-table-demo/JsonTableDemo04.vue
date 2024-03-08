<template>
  <JsonPageTable
    :fit-all-content="false"
    class="o-json-page-table"
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

defineOptions({ name: 'JsonTableDemo04' })
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
  'row-class-name': ({
    row,
    rowIndex,
  }: {
    row: UserInfo
    rowIndex: number
  }) => {
    if (rowIndex === 1) {
      return 'warning-row'
    } else if (rowIndex === 3) {
      return 'success-row'
    }
    return ''
  },
}
</script>

<style scoped lang="scss">
.o-json-page-table {
  ::v-deep(.el-table) {
    .warning-row {
      --el-table-tr-bg-color: var(--el-color-warning-light-9);
    }
    .success-row {
      --el-table-tr-bg-color: var(--el-color-success-light-9);
    }
  }
}
</style>
