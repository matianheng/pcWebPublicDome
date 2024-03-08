<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <LsyJsonPageTable
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :total="3"
        :el-table-props="elTableProps"
        :fit-all-content="false"
      ></LsyJsonPageTable>
    </div>
    <LsyJsonPageTable
      :index-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :el-table-props="elTableProps2"
      :fit-all-content="false"
    ></LsyJsonPageTable>
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { ElTableProp, LsyTableColumn } from '@/components/lsy/page-table/typing'
import { TableColumnCtx } from 'element-plus'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo14' })

interface UserInfo {
  name: string
  age: number
  male: number
}
const elTableProps: ElTableProp = {
  'show-summary': true,
  border: true,
}
interface SummaryMethodProps<T = UserInfo> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
const elTableProps2: ElTableProp = {
  'show-summary': true,
  border: true,
  'summary-method': (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: string[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '总计'
        return
      }
      // @ts-ignore
      const values = data.map(item => Number(item[column.property]))
      if (!values.every(value => Number.isNaN(value))) {
        sums[index] = `$ ${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      } else {
        sums[index] = 'N/A'
      }
    })

    return sums
  },
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
</script>

<style scoped></style>
