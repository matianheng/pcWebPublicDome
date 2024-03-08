<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <div class="mb-2">
        <el-button size="small" @click="onChangeScale(0.5)">放大</el-button>
        <el-button size="small" @click="onChangeScale(-0.5)">缩小</el-button>
      </div>
      <div>当前缩放比:{{ scale }}</div>
    </div>
    <div class="h-80 overflow-auto">
      <div ref="pdfPreviewRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UpdateScaleMethod,
  PdfCanvasInfoType,
} from '@/components/lsy/pdf-preview'
import { onMounted, ref } from 'vue'
import { loadPdfAndRender, drawWatermark } from '@/utils/PdfUtil'
import { downloadPdf } from '@/pages/demo/mock-api/ListApi'

const pdfPreviewRef = ref<HTMLDivElement>()
const scale = ref<number>(1)
const updateScaleMethod = ref<UpdateScaleMethod>()

async function pdfOperatorInit() {
  if (!pdfPreviewRef.value) return
  const res = await downloadPdf()

  const buffer = await res.blob.arrayBuffer()

  updateScaleMethod.value = await loadPdfAndRender({
    data: new Uint8Array(buffer),
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

function onChangeScale(scalePlusVal: number) {
  if (!updateScaleMethod.value) return
  scale.value += scalePlusVal
  scale.value = updateScaleMethod.value(scale.value)
}

onMounted(() => {
  pdfOperatorInit()
})
</script>

<style scoped></style>
