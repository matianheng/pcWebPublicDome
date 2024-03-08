<script lang="ts" setup>
import { computed, toRefs } from 'vue'

export interface SvgIconProps {
  /**
   * 图标symbol id前缀, 要与vite.config.ts中配置的一致. 默认: icon
   */
  prefix?: string
  /**
   * 图标名称(src/assets/svg目录下的文件名 如:该目录下有个logo.svg文件, 使用该svg: <SvgIcon name="logo"></SvgIcon>, 如果 svg下的子文件夹[如:test]下存在photo.svg文件，则 SvgIcon 的name为 test-photo)
   */
  name: string
}

const props = withDefaults(defineProps<SvgIconProps>(), {
  prefix: 'icon',
})
const { prefix, name } = toRefs(props)
const symbolId = computed(() => `#${prefix.value}-${name.value}`)
</script>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  overflow: hidden;
  width: 1em;
  height: 1em;
  vertical-align: -0.1em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
