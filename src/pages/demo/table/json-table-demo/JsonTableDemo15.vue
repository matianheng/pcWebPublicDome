<template>
  <div class="flex flex-col content-start">
    <div class="mb-3">
      <LsyJsonPageTable
        :fit-all-content="false"
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :total="3"
        :el-table-props="elTableProps"
      ></LsyJsonPageTable>
    </div>
    <div class="mb-3">
      <LsyJsonPageTable
        :fit-all-content="false"
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :total="3"
        :el-table-props="elTableProps1"
      ></LsyJsonPageTable>
    </div>
    <div class="mb-3">
      <LsyJsonPageTable
        :fit-all-content="false"
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :total="3"
        :el-table-props="elTableProps2"
      ></LsyJsonPageTable>
    </div>
    <div class="mb-3">
      <LsyJsonPageTable
        :fit-all-content="false"
        :index-column="true"
        :column-arr="columnArr"
        :table-data="tableData"
        :enable-pagination="false"
      ></LsyJsonPageTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { ElTableProp, LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo15' })
interface UserInfo {
  name: string
  age: number
  male: number
}
const elTableProps: ElTableProp = {
  small: true,
}
const elTableProps1: ElTableProp = {
  small: true,
  background: true,
}
const elTableProps2: ElTableProp = {
  background: true,
  layout: 'prev,next',
  'prev-text': '上一页',
  'next-text': '下一页',
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
