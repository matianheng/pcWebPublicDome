<template>
  <div class="flex flex-col">
    <div class="mb-3">
      <LsyJsonPageTable
        :enable-pagination="false"
        :column-arr="columnArr1"
        :table-data="tableData"
        :el-table-props="elTableProps"
        :fit-all-content="false"
      ></LsyJsonPageTable>
    </div>
    <LsyJsonPageTable
      :enable-pagination="false"
      :column-arr="columnArr2"
      :table-data="tableData1"
      :el-table-props="elTableProps2"
      :fit-all-content="false"
    ></LsyJsonPageTable>
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { ElTableProp, LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo01' })
interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}
const load = (
  row: User,
  treeNode: unknown,
  resolve: (date: User[]) => void
) => {
  setTimeout(() => {
    resolve([
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
  }, 1000)
}
const elTableProps: ElTableProp = {
  'row-key': 'id',
  border: true,
  'default-expand-all': true,
}
const elTableProps2: ElTableProp = {
  'row-key': 'id',
  border: true,
  lazy: true,
  load,
  'tree-props': { children: 'children', hasChildren: 'hasChildren' },
}
const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const tableData1: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    hasChildren: true,
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const columnArr1 = ref<LsyTableColumn[]>([
  {
    prop: 'date',
    label: '日期',
    sortable: true,
  },
  {
    prop: 'name',
    label: '姓名',
    sortable: true,
  },
  {
    prop: 'address',
    label: '地址',
    sortable: true,
  },
])
const columnArr2 = ref<LsyTableColumn[]>([
  {
    prop: 'date',
    label: '日期',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'address',
    label: '地址',
  },
])
</script>

<style scoped></style>
