<template>
  <div class="flex flex-col">
    <small class="mb-3">将布局切换为左上下布局,展开/收缩左菜单可看到效果</small>
    <LsyDynFormResponsive
      ref="dynFormRef"
      v-model:form-data="searchFormData"
      v-model:needShowToggleBtn="needShowToggleBtn"
      :update-row-col-count-fun="updateRowColCount"
      :form-item-arr="formItemArr"
      :form-item-comp-name-map="formItemCompNameMap"
      :expand="expand"
    >
      <template #extraElFormItems>
        <el-form-item class="ml-auto">
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { LsyFormItemConfig, VueComp } from '@/components/lsy/dyn-form/typing'
import { ref, computed } from 'vue'

defineOptions({ name: 'DynFormDemo11' })

defineProps<{
  /**
   * 表单项组件
   */
  formItemCompNameMap?: Map<string, VueComp>
}>()

interface SearchFormData {
  account?: string
  org?: string
  mobile?: string
  email?: string
  createDate?: string[]
}

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
const searchFormData = ref<SearchFormData>({
  account: undefined,
  org: undefined,
  mobile: undefined,
  email: undefined,
  createDate: undefined,
})

const formItemArr = ref<LsyFormItemConfig[]>([
  {
    name: 'ElInput',
    label: '用户账号',
    prop: 'account',
  },
  {
    name: 'ElInput',
    label: '组织机构',
    prop: 'org',
  },
  {
    name: 'ElInput',
    label: '手机号',
    prop: 'mobile',
  },
  //   {
  //     name: 'ElInput',
  //     label: '邮箱',
  //     prop: 'email',
  //   },
  //   {
  //     name: 'ElInput',
  //     label: '创建时间',
  //     prop: 'createDate',
  //   },
])
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
