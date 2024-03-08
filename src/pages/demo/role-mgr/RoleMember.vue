<template>
  <div ref="divRef" class="h-full flex flex-col">
    <div class="flex-shrink-0 pb-2">
      <el-input :value="roleName" disabled></el-input>
    </div>
    <div class="flex-shrink-0 flex flex-row pb-2">
      <div class="flex-1 w-0 pr-2">
        <el-input v-model="kw" placeholder="查询关键词..."></el-input>
      </div>
      <div class="flex-shrink-0">
        <LsyLoadingButton
          type="primary"
          :loading="loading"
          @click="onSearch"
        ></LsyLoadingButton>
      </div>
    </div>
    <div class="flex-shrink-0 pb-2">
      <el-button type="primary">添加成员</el-button>
      <el-button type="danger" @click="onBatchDel">批量删除</el-button>
    </div>
    <div class="flex-1 h-0 pb-2">
      <LsyJsonPageTable
        ref="toolbarJsonPageTableRef"
        :fit-all-content="true"
        :selection-column="true"
        :column-arr="columnArr"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="totalRecords"
        :loading="loading"
        :table-data="listData"
        :el-table-evt="elTableEvt"
        @page-size-change="onPageSizeChange"
        @current-page-change="onCurrentPageChange"
      >
        <template #operation="{ scope }">
          <LsyConfirmLink
            type="danger"
            class="ml-2"
            @confirm="() => onDel(scope.row.account)"
          >
            删除
          </LsyConfirmLink>
        </template>
      </LsyJsonPageTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'
import { toRefs } from 'vue'
import { useRequest } from 'vue-request'
import { tabListMockAPI } from '../mock-api/ListApi'
import { LsyToolbarJsonPageTableInstance } from '../new-detail/table.typing'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { UserInfo } from '../mock-api/ApiTyping'
import { ElMessage } from 'element-plus'
import { confirmMessage } from '@/components/lsy/confirm-dialog/ConfirmDialogController'

const props = withDefaults(
  defineProps<{
    roleId?: number
    roleName?: string
  }>(),
  { roleId: undefined, roleName: undefined }
)

const { roleId } = toRefs(props)

const kw = ref<string>('')
const pageNum = ref<number>(1)
const pageSize = ref<number>(20)
const totalRecords = ref<number>(0)
const listData = ref<UserInfo[]>([])
const selectedAccountArr = ref<string[]>([])

const elTableEvt = {
  'selection-change': (val: UserInfo[]) => {
    // val是选中项
    selectedAccountArr.value = val.map(item => item.account)
  },
}
async function searchData() {
  const { list, page, size, total } = await tabListMockAPI({
    pageParams: { page: pageNum.value, size: pageSize.value },
    // @ts-ignore
    searchParams: { kw: kw.value },
  })
  pageNum.value = page
  pageSize.value = size
  totalRecords.value = total
  listData.value = list
}
const { run, loading } = useRequest(searchData, { manual: true })
watch(
  roleId,
  val => {
    pageNum.value = 1
    console.log(val)
    run()
  },
  { immediate: true }
)
function onSearch() {
  run()
}
function onPageSizeChange(size: number) {
  pageNum.value = 1
  pageSize.value = size
  run()
}
function onCurrentPageChange(currentPage: number) {
  pageNum.value = currentPage
  run()
}
const toolbarJsonPageTableRef = ref<LsyToolbarJsonPageTableInstance>()
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'account',
    label: '账号',
  },
  {
    prop: 'name',
    label: '用户名',
  },
  {
    slotName: 'operation',
    label: '操作',
  },
])
function onDel(account: string) {
  console.log('删除:', roleId.value, account)
}
const divRef = ref<HTMLDivElement>()
function onBatchDel() {
  if (selectedAccountArr.value.length <= 0) {
    ElMessage({
      message: '请选择待删除数据.',
      type: 'warning',
    })
    return
  } else {
    if (!divRef.value) return

    confirmMessage('是否执行该操作?', divRef.value).then(() => {
      console.log('删除', selectedAccountArr.value)
      run().then(() => {
        selectedAccountArr.value = []
      })
    })
  }
}
</script>

<style scoped lang="scss"></style>
