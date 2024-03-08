<template>
  <LsyContentContainer
    title="打印el-table"
    :features="[
      '如果需要在每页都显示表头,则需要在打印之前,在内容table中创建thead',
      '加水印时,要注意内容高度一定要能玩全撑开待打印根dom高度,因为水印的覆盖高度由待打印根dom高度决定',
    ]"
  >
    <el-card shadow="never">
      <div class="flex flex-col">
        <div class="mb-2">
          <el-button @click="onPrint">打印</el-button>
          <el-button @click="() => (fullCol = !fullCol)">
            显示/隐藏地址列
          </el-button>
          <el-switch
            v-model="watermarkActive"
            class="ml-3"
            active-text="水印开"
            inactive-text="水印关"
          />
        </div>
        <div ref="jsonPageTableWrapperRef" class="h-60">
          <JsonPageTable
            ref="jsonPageTableRef"
            :index-column="true"
            :column-arr="columnArr"
            :table-data="tableData"
            :enable-pagination="false"
            :el-table-props="{
              'show-overflow-tooltip': true,
            }"
          ></JsonPageTable>
        </div>
      </div>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import JsonPageTable from '@/components/lsy/page-table/LsyJsonPageTable.vue'
import { LsyTableColumn } from '@/components/lsy/page-table/typing'
import { DomPrintConfig, doPrint } from '@/components/lsy/print-dom'
import { ref } from 'vue'
import { LsyJsonPageTableInstance } from '../new-detail/table.typing'
import { computed } from 'vue'
import { drawWatermarkAsDivForPrintDom } from '@/components/lsy/watermark'
interface UserInfo {
  name: string
  age: number
  male: number
  addr: string
}
const watermarkActive = ref<boolean>(true)
const tableData = ref<UserInfo[]>(
  Array(50)
    .fill(true)
    .map(() => ({
      name: '张三',
      age: 12,
      male: 1,
      addr: '很长很长很长很长很长很长很长很长的地址很长很长很长很长很长很长很长很长的地址',
    }))
)
const fullCol = ref<boolean>(true)
const dynColCount = computed(() => (fullCol.value ? 5 : 4))
const columnArr = ref<LsyTableColumn[]>([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '很长很长很长很长的列名',
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
  {
    prop: 'addr',
    label: '地址',
    show: () => fullCol.value,
  },
])

const jsonPageTableWrapperRef = ref<HTMLElement>()
function onPrint() {
  const jsonPageTableWrapper = jsonPageTableWrapperRef.value
  if (!jsonPageTableWrapper) {
    return
  }
  const domPrintConfig: DomPrintConfig = {
    customTitle: '自定义页眉',
    htmlDomOrHtmlSelector: jsonPageTableWrapper,
    printCssArr: [
      `${
        import.meta.env.VITE_PUBLIC_BASEPATH
      }print-css/el-table-print/dist/ElTablePrintCss.css`,
    ],
    // 因为列可能是动态变化的, 所以这里的列宽平均分配的样式, 应该通过style属性传入
    style: `
colgroup col {
/* 让表格列平均分配. 不要想着做其他特殊处理(如:让某一列窄一点,其他都做平均分配,这在打印预览中可能存在不兼容的情景)*/
width: calc(100% / ${dynColCount.value}) !important;
}
`,
    customPrintBeforeCall: (printDom: HTMLElement) => {
      createThead(printDom)
      if (watermarkActive.value) {
        const newPrintDom = drawWatermarkAsDivForPrintDom(
          {
            text: '管理系统骨架',
            width: 200,
            height: 190,
            fontSize: 30,
            fontFamily: 'Microsoft Yahei',
            color: '#ffe7ba',
            angle: 30,
            zIndex: 999,
            position: 'absolute',
            textAlign: 'start',
            textBaseline: 'alphabetic',
            x: 20,
            y: 16,
          },
          printDom
        )
        return newPrintDom ?? printDom
      } else {
        return printDom
      }
    },
  }
  doPrint(domPrintConfig)
}

const jsonPageTableRef = ref<LsyJsonPageTableInstance>()
/**
 * 在待打印节点中插入thead, 作用是让打印纸的每页都有表头
 * @param printDom 待打印dom节点的克隆
 */
function createThead(printDom: HTMLElement) {
  const theadDom = printDom.querySelector(
    '.el-table__header thead'
  ) as HTMLTableCellElement
  if (!theadDom) return

  const tbodyWrapperDom = printDom.querySelector(
    '.el-table__body'
  ) as HTMLElement
  if (!tbodyWrapperDom) return

  const tbodyDom = tbodyWrapperDom.querySelector('tbody')
  if (!tbodyDom) return

  tbodyWrapperDom.insertBefore(theadDom, tbodyDom)
}
</script>

<style scoped lang="scss">
// 该css不会在打印预览生效
.el-table__body thead {
  display: none;
}
</style>
