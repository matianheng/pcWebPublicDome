<template>
  <div class="flex flex-col">
    <div>
      <el-button type="primary" @click="onLoadingToggle">
        显示/隐藏loading
      </el-button>
    </div>
    <JsonPageTable
      :fit-all-content="false"
      :index-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :loading="loading"
    ></JsonPageTable>
    <JsonPageTable
      :fit-all-content="false"
      :index-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :loading="loading"
      element-loading-text="加载中..."
    ></JsonPageTable>
    <JsonPageTable
      :fit-all-content="false"
      :index-column="true"
      :column-arr="columnArr"
      :table-data="tableData"
      :total="3"
      :loading="loading"
      element-loading-text="加载中..."
      element-loading-background="red"
    ></JsonPageTable>
  </div>
</template>

<script setup lang="ts">
import JsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { ref } from 'vue'

defineOptions({ name: 'JsonTableDemo16' })
interface UserInfo {
  name: string
  age: number
  male: number
}
const loading = ref<boolean>(false)
function onLoadingToggle() {
  loading.value = !loading.value
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
