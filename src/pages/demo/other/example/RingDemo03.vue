<script setup lang="ts">
defineProps<{
  text?: string
}>()
/**
 * 计算圆相关属性
 *
 * @param   {number}  r              圆半径
 * @param   {number}  strokePercent  有色边框长度占圆周长的百分比(是个小数0-1表示0%-100%)
 */
function calc(r: number, strokePercent: number, strokeWidth: number) {
  /**
   *  圆周长
   */
  const C = 2 * Math.PI * r
  /**
   * 圆实线边框的长度. 这里设置为周长的80%
   */
  const stroke = C * strokePercent
  /**
   * 空白边框的长度。这里表示 周长-实现边框的长度剩下的长度都是空白边框
   */
  const blankLen = C - stroke
  /**
   * 计算stroke的偏移量，使的环的缺口在正下方
   */
  const offset = -C / 4 - blankLen / 2 - strokeWidth / 2 / 2 + 1
  return { stroke, blankLen, offset }
}
/**
 * 圆半径
 */
const r = 40
/**
 * 圆边框粗细
 */
const strokeWidth = 10
const { stroke, blankLen, offset } = calc(r, 0.65, strokeWidth)

const r2 = 40
const strokeWidth2 = 5
const { stroke: stroke2, blankLen: blankLen2 } = calc(r2, 0.5, strokeWidth2)
let offset2 = offset
</script>

<template>
  <!-- viewBox指定svg的视口从左顶点位置以及视口的宽高，
        在这个视口内的元素都会被平铺满整个svg容器，指定了viewBox属性之后，
        svg元素默认会充满整个容器 -->
  <!-- 当前的viewBox设置表示，视口的左上点0，0开始，视口的宽高都为100个单位 -->
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 设置一个红黄渐变 -->
      <linearGradient id="gradient">
        <stop offset="0%" style="stop-color: red" />
        <stop offset="100%" style="stop-color: yellow" />
      </linearGradient>
    </defs>
    <!-- circle画圆，cx，xy指定圆心的x，y坐标。r指定圆的半径， 
        stroke指定边框颜色为绿色, stroke-width指定边框的宽度为2个单位，
        fill指定圆的填充色为黑色 -->
    <!-- 这里cx,cy为50，因为viewBox的宽高为100，所以这里实际是将圆心设置在了视口的正中心 -->
    <!-- 将svg元素想象成一个矩形的话，那么圆心距离上下左右边的距离都是50，
        这将r设置为48实际表示圆的半径为48，因为stroke-width为2，所以，还有2个单位的边框，
        因此48+2就让这个圆内容和边框占满了svg元素的视口 -->
    <!-- 因为设置了viewBox之后，svg元素默认充满所在html元素的剩余空间，
            且viewBox会将视口内的内容平铺满svg元素，
            所以就实现了圆自适应div大小的效果 -->

    <!-- circle画圆，cx，xy指定圆心的x，y坐标。r指定圆的半径， 
        stroke指定边框颜色为绿色,stroke-width指定边框的宽度为2个单位，
        fill设置为none表示不填充任何颜色 -->

    <!-- stroke-dasharray 有两个参数时，
        表示先绘制第一个参数单位的非空白边框，
        再绘制第二个参数的空白边框，然后如此循环往复，
        直至绘制完整个圆的边框 -->
    <!-- 因为当前 stroke-dasharray 的第一个参数和第二个参数是根据圆的周长计算出来的，
        因此体现出的效果就是圆的边框分为了两部分，
        一部分是有填充颜色的，一部分是没有填充颜色的，
        也就是半环的效果 -->
    <!-- 因为stroke起始位置为右侧中间，因此从右侧中间开始顺时针方向画有填充颜色的边框，
        再画无填充颜色的边框，直至填充完整个圆的周长 -->
    <!-- stroke-dashoffset表示stroke的偏移量，负数表示顺时针偏移，正数则逆时针偏移，0表示不偏移 -->
    <!-- stroke-linecap表示边框的风格，这里表示圆角边框，圆角的半径由stroke-width控制 -->

    <!-- 应用红黄渐变'url(#gradient)' -->
    <circle
      cx="50"
      cy="50"
      :r="r"
      :stroke-dasharray="`${stroke} ${blankLen}`"
      stroke="gray"
      :stroke-width="strokeWidth"
      fill="none"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
    />
    <circle
      cx="50"
      cy="50"
      :r="r2"
      :stroke-dasharray="`${stroke2} ${blankLen2}`"
      :stroke="'url(#gradient)'"
      :stroke-width="strokeWidth2"
      fill="none"
      :stroke-dashoffset="offset2"
      stroke-linecap="round"
    />
    <text
      v-if="text"
      class="text-xs"
      y="60"
      x="50"
      fill="black"
      text-anchor="middle"
    >
      {{ text }}
    </text>
  </svg>
</template>

<style lang="scss" scoped></style>
