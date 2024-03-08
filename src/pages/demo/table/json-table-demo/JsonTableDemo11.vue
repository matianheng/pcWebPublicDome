<template>
  <LsyJsonPageTable
    :index-column="true"
    :column-arr="columnArr"
    :table-data="tableData"
    :total="3"
    :fit-all-content="false"
  >
    <template #tableSearch>
      <el-input v-model="search" size="small" placeholder="搜索" />
    </template>
  </LsyJsonPageTable>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo11' })

const search = ref('')
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
    slotHeaderName: 'tableSearch',
  },
])
</script>

<style scoped></style>
