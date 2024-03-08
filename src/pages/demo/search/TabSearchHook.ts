import { loadVueCompFromModules } from '@/components/lsy/dyn-form/LsyDynFormUtil'
import { LsyFormItemConfig } from '@/components/lsy/dyn-form/typing'
import {
  LsyTableColumn,
  LsyToolbarJsonPageTableInstance,
} from '@/components/lsy/page-table/typing'
import { DropDownItem } from '@/components/lsy/typing'
import { ref, computed, watch, Ref, onActivated } from 'vue'
import { DicItemInfo, UserInfo } from '../mock-api/ApiTyping'
import { dicMockAPI } from '../mock-api/ListApi'

export interface SearchFormData {
  type?: string
  account?: string
  city?: string
  mobile?: string
  email?: string
  createDate?: string[]
}
export function useSearchForm(
  toolbarJsonPageTableRef: Ref<LsyToolbarJsonPageTableInstance>
) {
  const modules = import.meta.glob('./dyn-form-item/demo-01/*.vue', {
    eager: true,
  })
  const map = loadVueCompFromModules(modules)
  const needShowToggleBtn = ref<boolean>(true)
  const expand = ref<boolean>(false)
  const toggleText = computed(() => (expand.value ? '收缩' : '展开'))
  function onToggle() {
    expand.value = !expand.value
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
  const blankSearchFormData: SearchFormData = {
    type: undefined,
    account: undefined,
    city: undefined,
    mobile: undefined,
    email: undefined,
    createDate: undefined,
  }
  const searchFormData = ref<SearchFormData>({
    ...blankSearchFormData,
  })
  function onSearch() {
    toolbarJsonPageTableRef.value?.runSearchMethod({ page: 1 })
  }
  onActivated(() => {
    toolbarJsonPageTableRef.value?.runSearchMethod()
  })
  watch(
    () => searchFormData.value.type,
    newType => {
      searchFormData.value = { ...blankSearchFormData, type: newType }
      toolbarJsonPageTableRef.value?.runSearchMethod({ page: 1 })
    }
  )
  const formItemArr = ref<LsyFormItemConfig[]>([
    {
      name: 'ElInput',
      label: '用户账号',
      prop: 'account',
      show: () =>
        !searchFormData.value.type ||
        ['type-a'].indexOf(searchFormData.value.type) >= 0,
    },
    {
      name: 'ElInput',
      label: '城市',
      prop: 'city',
      show: () =>
        !searchFormData.value.type ||
        ['type-a', 'type-b'].indexOf(searchFormData.value.type) >= 0,
    },
    {
      name: 'ElInput',
      label: '手机号',
      prop: 'mobile',
      show: () =>
        !searchFormData.value.type ||
        ['type-a', 'type-b', 'type-c'].indexOf(searchFormData.value.type) >= 0,
    },
    {
      name: 'ElInput',
      label: '邮箱',
      prop: 'email',
      show: () =>
        !searchFormData.value.type ||
        ['type-a', 'type-b', 'type-d'].indexOf(searchFormData.value.type) >= 0,
    },
    {
      name: 'ElInput',
      label: '创建时间',
      prop: 'createDate',
      show: () => {
        if (
          !searchFormData.value.type ||
          ['type-a', 'type-c'].indexOf(searchFormData.value.type) >= 0
        ) {
          // 如果是type-a,type-c类型,则显示
          return true
        } else if (
          ['type-b'].indexOf(searchFormData.value.type) >= 0 &&
          searchFormData.value.mobile
        ) {
          // 如果是type-b类型, 且手机号有值, 则显示
          return true
        } else {
          // 其他都不显示
          return false
        }
      },
    },
  ])
  return {
    formItemArr,
    searchFormData,
    updateRowColCount,
    map,
    needShowToggleBtn,
    expand,
    toggleText,
    onToggle,
    onSearch,
  }
}

export function useJsonPageTable(
  searchFormData: Ref<SearchFormData>,
  sexDicItemList: Ref<DicItemInfo[]>,
  statusDicItemList: Ref<DicItemInfo[]>,
  selectedRows: Ref<UserInfo[]>,
  toolbarJsonPageTableRef: Ref<LsyToolbarJsonPageTableInstance>
) {
  const columnArr = ref<LsyTableColumn[]>([
    {
      prop: 'account',
      label: '用户账号',
      show: () => searchFormData.value.type === 'type-b',
    },
    {
      prop: 'name',
      label: '用户名',
      slotName: 'name',
    },
    {
      prop: 'city',
      label: '城市',
    },
    {
      prop: 'mobile',
      label: '手机号',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'male',
      label: '性别',
      dictionaryConvert: (rowData: UserInfo) => {
        const item = sexDicItemList.value.find(
          item => item.value === rowData.male
        )
        if (item) {
          return item.text
        } else {
          return `${rowData.male}`
        }
      },
    },
    {
      prop: 'createDate',
      label: '创建时间',
      sortable: 'custom',
      elTableColumnProps: {
        width: '120',
      },
    },
    {
      prop: 'state',
      label: '状态',
      dictionaryConvert: (rowData: UserInfo) => {
        const item = statusDicItemList.value.find(
          item => item.value === rowData.status
        )
        if (item) {
          return item.text
        } else {
          return `${rowData.status}`
        }
      },
    },
    {
      prop: 'operation',
      label: '操作',
      slotName: 'operation',
      elTableColumnProps: {
        width: '100',
      },
      show: () =>
        !(searchFormData.value && searchFormData.value.type === 'type-d'),
    },
  ])
  const dropdownItemArr = computed<DropDownItem[]>(() => [
    {
      command: 'batchDel',
      text: '批量删除',
      disabled: selectedRows.value.length <= 0,
    },
    {
      command: 'batchUpdate',
      text: '批量更新',
      disabled: selectedRows.value.length <= 0,
    },
  ])
  function onClickDropdownItem(command: string | number | object) {
    toolbarJsonPageTableRef.value.runSearchMethod({ page: 1 })
  }
  function onDel(rowIndex: number) {
    console.log(rowIndex)
    toolbarJsonPageTableRef.value.runSearchMethod({ page: 1 })
  }
  function onEdit(rowIndex: number) {
    console.log(rowIndex)
    toolbarJsonPageTableRef.value.runSearchMethod({ page: 1 })
  }
  return {
    columnArr,
    dropdownItemArr,
    onClickDropdownItem,
    onDel,
    onEdit,
  }
}

export function useData() {
  const sexDicItemList = ref<DicItemInfo[]>([])
  const statusDicItemList = ref<DicItemInfo[]>([])

  async function loadDicData() {
    const arr = await Promise.all([dicMockAPI('sex'), dicMockAPI('status')])
    sexDicItemList.value = arr[0]
    statusDicItemList.value = arr[1]
  }
  loadDicData()
  return { sexDicItemList, statusDicItemList }
}
