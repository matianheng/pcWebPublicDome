<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <div>
        <el-button type="primary" @click="resetAgeFilter">
          重置年龄筛选条件
        </el-button>
      </div>
      <div class="ml-3">
        <el-button @click="resetFilter"> 重置所有筛选条件 </el-button>
      </div>
    </div>
    <LsyJsonPageTable
      ref="jsonPageTableRef"
      :index-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :fit-all-content="false"
    ></LsyJsonPageTable>
  </div>
</template>

<script setup lang="ts">
import LsyJsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import {
  LsyJsonPageTableInstance,
  LsyTableColumn,
} from '@/components/lsy/page-table/typing'
import { TableColumnCtx } from 'element-plus'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo10' })
interface UserInfo {
  name: string
  age: number
  male: number
}
const jsonPageTableRef = ref<LsyJsonPageTableInstance>()
const tableData = ref<UserInfo[]>([
  { name: '张三', age: 12, male: 1 },
  { name: '里斯', age: 22, male: 2 },
  { name: '王五', age: 32, male: 3 },
  { name: '赵六', age: 32, male: 3 },
])
function resetAgeFilter() {
  const elTableRef = jsonPageTableRef.value?.getElTableRef()
  elTableRef?.clearFilter(['age'])
}
function resetFilter() {
  const elTableRef = jsonPageTableRef.value?.getElTableRef()
  elTableRef?.clearFilter()
}
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
    sortable: true,
    elTableColumnProps: {
      'column-key': 'age',
      filters: [
        { text: '12岁', value: 12 },
        { text: '22岁', value: 22 },
        { text: '32岁', value: 32 },
      ],
      'filter-method': (
        value: string,
        row: UserInfo,
        column: TableColumnCtx<UserInfo>
      ) => {
        const property = column['property']
        // @ts-ignore
        return row[property] === value
      },
    },
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
    elTableColumnProps: {
      'column-key': 'male',
      filters: [
        { text: '男', value: 1 },
        { text: '女', value: 2 },
        { text: '未知', value: 3 },
      ],
      'filter-method': (
        value: string,
        row: UserInfo,
        column: TableColumnCtx<UserInfo>
      ) => {
        const property = column['property']
        // @ts-ignore
        return row[property] === value
      },
    },
  },
])
</script>

<style scoped></style>
