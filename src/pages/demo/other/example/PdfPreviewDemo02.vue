<template>
  <div class="flex flex-col">
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
import { baseUrl, loadPdfAndRender, drawWatermark } from '@/utils/PdfUtil'

const pdfPreviewRef = ref<HTMLDivElement>()
const pdfUrl = `${baseUrl}test.pdf`
const updateScaleMethod = ref<UpdateScaleMethod>()

async function pdfOperatorInit() {
  if (!pdfPreviewRef.value) return
  updateScaleMethod.value = await loadPdfAndRender({
    pdfUrl,
    width: 500,
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

onMounted(() => {
  pdfOperatorInit()
})
</script>

<style scoped></style>
