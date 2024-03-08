<template>
  <div class="flex flex-col">
    <div class="flex flex-col">
      <div class="mb10">
        <el-button size="small" :disabled="!hasPrevPage" @click="onFirstPage">
          首页
        </el-button>
        <el-button size="small" :disabled="!hasPrevPage" @click="onPrevPage">
          上一页
        </el-button>
        <el-button size="small" :disabled="!hasNextPage" @click="onNextPage">
          下一页
        </el-button>
        <el-button size="small" :disabled="!hasNextPage" @click="onLastPage">
          尾页
        </el-button>
      </div>
      <div>
        <el-button size="small" @click="onChangeScale(0.5)">放大</el-button>
        <el-button size="small" @click="onChangeScale(-0.5)">缩小</el-button>
      </div>
      <div>
        总页数 {{ pdfOperator?.totalPage }} 页, 当前为第 {{ goPageNum }} 页.
        当前缩放比:{{ scale }}
      </div>
      <div class="flex flex-row mb-3">
        <el-input
          v-model="goPageNum"
          size="small"
          placeholder="请输入页码. 页码从1开始"
        ></el-input>
        <el-button size="small" @click="onGoPage">跳转指定页</el-button>
      </div>
    </div>
    <div class="flex flex-col h-80 overflow-auto">
      <div ref="pdfPreviewRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  PdfOperateInfoType,
  PdfCanvasInfoType,
} from '@/components/lsy/pdf-preview'
import { computed, onMounted, ref } from 'vue'
import { baseUrl, loadPdfDocOperateInfo, drawWatermark } from '@/utils/PdfUtil'
import { ElMessage } from 'element-plus'

const pdfPreviewRef = ref<HTMLDivElement>()
const goPageNum = ref<string>('1')
const isNum = computed(() => goPageNum.value.match(/^[1-4]{1}$/))
const scale = ref<number>(1)
const pdfUrl = `${baseUrl}test.pdf`
const pdfOperator = ref<PdfOperateInfoType>()

async function pdfOperatorInit() {
  if (!pdfPreviewRef.value) return
  pdfOperator.value = await loadPdfDocOperateInfo({
    pdfUrl,
    scale: scale.value,
    pdfRenderContainerDom: pdfPreviewRef.value,
    pdfPageRenderCall: (pdfPageCanvasInfo: PdfCanvasInfoType) => {
      const ctx = pdfPageCanvasInfo.pdfPageCanvas.getContext('2d')
      if (!ctx) return
      const watermarkCanvas = drawWatermark()
      // 平铺水印
      let pattern = ctx.createPattern(
        watermarkCanvas as HTMLCanvasElement,
        'repeat'
      ) as CanvasPattern
      ctx.rect(0, 0, pdfPageCanvasInfo.width, pdfPageCanvasInfo.height)
      ctx.fillStyle = pattern
      ctx.fill()
    },
  })
}
function onGoPage() {
  if (!pdfOperator.value) return
  if (!isNum.value) {
    ElMessage({
      showClose: true,
      message: '请输入正确的页码',
      type: 'error',
    })
  } else {
    pdfOperator.value.renderPage(parseInt(goPageNum.value))
  }
}
function onNextPage() {
  if (!pdfOperator.value) return
  goPageNum.value = '' + pdfOperator.value.renderNextPage()
}
function onPrevPage() {
  if (!pdfOperator.value) return
  goPageNum.value = '' + pdfOperator.value.renderPrevPage()
}
function onFirstPage() {
  if (!pdfOperator.value) return
  goPageNum.value = '' + pdfOperator.value.renderPage(1)
}
function onLastPage() {
  if (!pdfOperator.value) return
  goPageNum.value =
    '' + pdfOperator.value.renderPage(pdfOperator.value.totalPage)
}
function onChangeScale(scalePlusVal: number) {
  if (!pdfOperator.value) return
  scale.value += scalePlusVal
  scale.value = pdfOperator.value.changeScale(scale.value)
}
// 是否还有下一页
const hasNextPage = computed(() => {
  if (!pdfOperator.value || !isNum.value) return false
  return parseInt(goPageNum.value) !== pdfOperator.value.totalPage
})
// 是否还有上一页
const hasPrevPage = computed(() => {
  if (!pdfOperator.value || !isNum.value) return false
  return parseInt(goPageNum.value) > 1
})

onMounted(() => {
  pdfOperatorInit()
})
</script>

<style lang="scss" scoped></style>
