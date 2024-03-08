<template>
  <LsyJsonPageTable
    :index-column="true"
    :column-arr="columnArr"
    :table-data="tableData"
    :total="3"
    :fit-all-content="false"
  ></LsyJsonPageTable>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo05' })
interface UserInfo {
  name: string
  age: number
  male: number
  addr?: string
}
const tableData = ref<UserInfo[]>([
  { name: '张三', age: 12, male: 1 },
  { name: '里斯', age: 22, male: 2 },
  {
    name: '王五',
    age: 32,
    male: 3,
    addr: '发动机垃圾地方垃圾啊收到了放假啊来得及飞洒地方了解了发动机垃圾地方垃圾啊收到了放假啊来得及飞洒地方了解了',
  },
])
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'name',
    label: '姓名',
    fixed: true,
    elTableColumnProps: {
      width: 100,
    },
  },
  {
    prop: 'age',
    label: '年龄',
    elTableColumnProps: {
      width: 80,
    },
  },
  {
    prop: 'male',
    label: '性别',
    elTableColumnProps: {
      width: 80,
    },
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
    prop: 'addr',
    label: '地址',
    elTableColumnProps: {
      width: 700,
    },
  },
])
</script>

<style scoped></style>
