<template>
  <LsyTopMainContentLayout
    top-card-body-cls="!pb-0"
    :fit-all-content="isLongScreen"
    :main-card-body-cls="isLongScreen ? 'h-full' : ''"
  >
    <template #top>
      <!-- 查询表单 -->
      <LsyDynFormResponsive
        ref="dynFormRef"
        v-model:form-data="searchFormData"
        v-model:needShowToggleBtn="needShowToggleBtn"
        :update-row-col-count-fun="updateRowColCount"
        :form-item-arr="formItemArr"
        :form-item-comp-name-map="map"
        :expand="expand"
        :el-form-props="{ 'label-width': 'auto' }"
      >
        <template #extraElFormItems>
          <el-form-item class="ml-auto">
            <LsyLoadingButton
              type="primary"
              @click="onSearch"
            ></LsyLoadingButton>
            <el-button @click="onReset">重置</el-button>
            <el-link
              v-if="needShowToggleBtn"
              type="primary"
              class="ml-3"
              @click="onToggle"
            >
              {{ toggleText }}
            </el-link>
          </el-form-item>
        </template>
      </LsyDynFormResponsive>
    </template>
    <LsyToolbarJsonPageTable
      ref="toolbarJsonPageTableRef"
      v-model:columnArr="columnArr"
      v-model:selectedRows="selectedRows"
      :selection-column="true"
      :index-column="true"
      :search-page-data-method="searchPageData"
      :show-settings="true"
      :fit-all-content="isLsyToolbarJsonPageTableFitAllContent"
      :full-screen-callback="onFullScreenCallback"
      :el-table-props="elTableProps"
    >
      <!-- 自定义列开始 -->
      <template #operation="{ rowIndex, scope }">
        <el-link
          type="primary"
          @click="() => onShowRoleMemberDrawer(scope.row.id, scope.row.name)"
        >
          角色成员
        </el-link>
        <el-link type="primary" class="ml-2" @click="() => onEdit(rowIndex)">
          角色权限
        </el-link>
        <el-link
          type="primary"
          class="ml-2"
          @click="() => onEdit(scope.row.id)"
        >
          修改
        </el-link>
        <el-link
          type="danger"
          class="ml-2"
          @click="() => onDel(rowIndex, isFullScreen)"
        >
          删除
        </el-link>
      </template>
      <!-- 自定义列结束 -->
      <template #leftToolbarGroup>
        <!-- 表格左上角工具按钮 -->
        <el-button type="primary" class="mr-2" @click="onAdd"
          >添加角色</el-button
        >
        <LsyDropdownButton
          :dropdown-item-arr="dropdownItemArr"
          @click-dropdown-item="onClickDropdownItem"
        ></LsyDropdownButton>
      </template>
    </LsyToolbarJsonPageTable>
    <LsyDrawer
      v-model:visible="showRoleAddEditDrawer"
      :title="roleAddEditDrawerTitle"
    >
      <RoleAddEditForm
        :id="editRoleId"
        @submit-suc="onAddOrUpdateSuc"
      ></RoleAddEditForm>
    </LsyDrawer>
    <LsyDrawer v-model:visible="showRoleMemberDrawer" title="角色成员">
      <RoleMember
        :role-id="roleMemberDrawerRoleId"
        :role-name="roleMemberDrawerRoleName"
      ></RoleMember>
    </LsyDrawer>
  </LsyTopMainContentLayout>
</template>

<script setup lang="ts">
import { useLsyLayoutStore } from '@/store/LsyLayoutStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import {
  LsyPageParam,
  LsyPageResult,
  LsySortInfo,
  LsyTableColumn,
  LsyToolbarJsonPageTableInstance,
} from '../new-detail/table.typing'
import { roleListMockAPI } from '../mock-api/ListApi'
import { DropDownItem } from '@/components/lsy/typing'
import { confirmMessage } from '@/components/lsy/confirm-dialog/ConfirmDialogController'
import { LsyFormItemConfig } from '@/components/lsy/dyn-form/typing'
import { RoleInfoType, RoleSearchFormData } from './RoleMgr.typing'
import { ElTableProp } from '@/components/lsy/page-table/typing'
import RoleAddEditForm from './RoleAddEditForm.vue'
import RoleMember from './RoleMember.vue'

const lsyLayoutStore = useLsyLayoutStore()
const { isLongScreen } = storeToRefs(lsyLayoutStore)

const toolbarJsonPageTableRef = ref<LsyToolbarJsonPageTableInstance>()
const selectedRows = ref<any[]>([])
const elTableProps: ElTableProp = {
  // showOverflowTooltip: true,
  showOverflowTooltip: {
    'append-to': '#app',
  },
}

const blankSearchFormData: RoleSearchFormData = {
  name: '',
}
const searchFormData = ref<RoleSearchFormData>({
  ...blankSearchFormData,
})
const needShowToggleBtn = ref<boolean>(true)
const map = new Map<string, DropDownItem>()
const expand = ref<boolean>(false)
function onSearch() {
  toolbarJsonPageTableRef.value?.runSearchMethod({ page: 1 })
}
function onReset() {
  searchFormData.value = { ...blankSearchFormData }
}
const toggleText = computed(() => (expand.value ? '收缩' : '展开'))
function onToggle() {
  expand.value = !expand.value
}
const showRoleAddEditDrawer = ref<boolean>(false)
const roleAddEditDrawerTitle = ref<string>('添加')
const editRoleId = ref<number | undefined>()
function onAdd() {
  editRoleId.value = undefined
  showRoleAddEditDrawer.value = true
  roleAddEditDrawerTitle.value = '添加'
}
function onEdit(roleId: number) {
  console.log(roleId)
  editRoleId.value = roleId
  showRoleAddEditDrawer.value = true
  roleAddEditDrawerTitle.value = '编辑'
}
function onAddOrUpdateSuc() {
  showRoleAddEditDrawer.value = false
  toolbarJsonPageTableRef.value.runSearchMethod()
}
const showRoleMemberDrawer = ref<boolean>(false)
const roleMemberDrawerRoleId = ref<number | undefined>()
const roleMemberDrawerRoleName = ref<string | undefined>()
function onShowRoleMemberDrawer(id: number, name: string) {
  showRoleMemberDrawer.value = true
  roleMemberDrawerRoleName.value = name
  roleMemberDrawerRoleId.value = id
}
function updateRowColCount(domOffsetWidth: number) {
  if (domOffsetWidth <= 768) {
    return 1
  } else if (domOffsetWidth <= 992) {
    return 2
  } else if (domOffsetWidth <= 1300) {
    return 3
  } else {
    return 4
  }
}
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'ElInput',
    label: '角色名',
    prop: 'account',
  },
])
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'name',
    label: '角色名',
  },
  {
    prop: 'desc',
    label: '说明',
    // elTableColumnProps: {
    //   width: '230',
    // },
  },
  {
    prop: 'createDate',
    label: '创建时间',
    sortable: 'custom',
    elTableColumnProps: {
      width: '170',
    },
  },
  {
    prop: 'enable',
    label: '启用',
    dictionaryConvert: (rowData: RoleInfoType) => {
      return rowData.enable === 1 ? '是' : '否'
    },
  },
  {
    prop: 'operation',
    label: '操作',
    slotName: 'operation',
    elTableColumnProps: {
      width: '230',
    },
  },
])
const isFullScreen = ref<boolean>(false)
const isLsyToolbarJsonPageTableFitAllContent = computed(() => {
  if (isFullScreen.value) {
    // 是全屏，则带工具条的表格需要充满整个容器高度
    return true
  } else {
    // 非全屏，则带工具条的表格是否充满整个容器高度, 由 isLongScreen 值决定
    return isLongScreen.value
  }
})
function onFullScreenCallback(flag: boolean) {
  setTimeout(() => {
    isFullScreen.value = flag
  }, 280)
}

function searchPageData(
  pageParam?: LsyPageParam,
  sortInfo?: LsySortInfo
): Promise<LsyPageResult<RoleInfoType>> {
  console.log('排序条件:', sortInfo)
  return roleListMockAPI({
    searchParams: searchFormData.value,
    pageParams: pageParam,
  })
}

const dropdownItemArr = computed<DropDownItem[]>(() => [
  {
    command: 'batchEnable',
    text: '批量启用',
    disabled: selectedRows.value.length <= 0,
  },
  {
    command: 'batchDisable',
    text: '批量禁用',
    disabled: selectedRows.value.length <= 0,
  },
  {
    command: 'batchDel',
    text: '批量删除',
    disabled: selectedRows.value.length <= 0,
  },
])
function onClickDropdownItem(command: string | number | object) {
  console.log(command)
  toolbarJsonPageTableRef.value.runSearchMethod()
}

function onDel(rowIndex: number, isFullScreen: boolean) {
  confirmMessage(
    `是否确认删除?`,
    isFullScreen ? toolbarJsonPageTableRef.value.$el : undefined
  ).then(() => {
    console.log(rowIndex)
    toolbarJsonPageTableRef.value.runSearchMethod()
  })
}
</script>

<style scoped lang="scss">
.o-dyn-form-wrapper {
  ::v-deep(> form > .o-responsive-wrapper) {
    display: flex;
    flex-flow: row wrap;

    > div {
      padding-right: 5px;
      padding-left: 5px;

      // 当项div总数量少于colCount的时候，让最后一个保持右浮动
      &:last-child {
        margin-left: auto;
      }
    }
  }
}
</style>
