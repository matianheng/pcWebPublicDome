<template>
  <LsyContentContainer
    title="图片打印"
    :features="[
      '打印图片时,注意别让图片宽度超出打印纸的宽度,否则只能打印部分图片',
      '打印时,注意不要让图片换页,否则图片可能被分割打印在两张纸上',
      '加水印时,要注意内容高度一定要能玩全撑开待打印根dom高度,因为水印的覆盖高度由待打印根dom高度决定',
    ]"
  >
    <el-card>
      <div>
        <el-button @click="onPrint">打印</el-button>
        <el-switch
          v-model="watermarkActive"
          class="ml-3"
          active-text="水印开"
          inactive-text="水印关"
        />
      </div>
      <div ref="printDomRef">
        <h1>下面两张图是超大图</h1>
        <img src="@/assets/jpg/full-bg-02.jpg" alt="" />
        <img src="@/assets/jpg/full-bg-02.jpg" alt="" />
        <h1>下面两张图是小图</h1>
        <img src="@/assets/jpg/bg.png" alt="" />
        <img src="@/assets/jpg/bg.png" alt="" />
      </div>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { doPrint } from '@/components/lsy/print-dom'
import { drawWatermarkAsDivForPrintDom } from '@/components/lsy/watermark'

const printDomRef = ref<HTMLDivElement>()
const watermarkActive = ref<boolean>(true)
function onPrint() {
  const printDom = printDomRef.value
  if (!printDom) return

  doPrint({
    htmlDomOrHtmlSelector: printDom,
    printCssArr: [
      `${
        import.meta.env.VITE_PUBLIC_BASEPATH
      }print-css/pic-print/dist/PicPrintCss.css`,
    ],
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
