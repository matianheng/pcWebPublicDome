<template>
  <LsyContentContainer
    title="打印canvas"
    :features="[
      '不要直接打印canvas,否则打印预览会出不来或要很久才能出来,正确做法应该是将canvas转先换为img后再打印',
    ]"
  >
    <el-card>
      <div class="flex flex-col">
        <div>
          <el-button @click="onPrint">打印</el-button>
          <el-switch
            v-model="watermarkActive"
            class="ml-3"
            active-text="水印开"
            inactive-text="水印关"
          />
        </div>
        <div ref="printDomWrapperRef"><DataEcharts></DataEcharts></div>
      </div>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataEcharts from './example/DataEcharts.vue'
import { doPrint } from '@/components/lsy/print-dom'
import { drawWatermarkAsDivForPrintDom } from '@/components/lsy/watermark'

const printDomWrapperRef = ref<HTMLElement>()
const watermarkActive = ref<boolean>(true)
function onPrint() {
  const printDomWrapper = printDomWrapperRef.value
  if (!printDomWrapper) return

  doPrint({
    htmlDomOrHtmlSelector: printDomWrapper,
    printCssArr: [],
    customEleConvert: (cloneElement, originEle) => {
      if (originEle instanceof HTMLCanvasElement) {
        // 将canvas转为图片，避免直接打印canvas
        var dataURL = originEle.toDataURL('image/png')
        const img = document.createElement('img')
        img.src = dataURL
        img.style.width = '100%'
        return img
      } else {
        return cloneElement
      }
    },
    customPrintBeforeCall: (printDom: HTMLElement) => {
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
  })
}
</script>

<style scoped></style>
