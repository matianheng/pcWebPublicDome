<template>
  <LsyContentContainer
    :fit-all-content="fitAllContent"
    content-dom-cls="flex flex-col"
  >
    <div class="pb-3" :class="fitAllContent ? 'flex-shrink-0' : ''">
      <el-card
        class="o-top-card"
        shadow="never"
        :class="topCardCls"
        :body-class="topCardBodyCls"
      >
        <!-- 顶部内容 -->
        <slot name="top"></slot>
      </el-card>
    </div>
    <div class="pb-3" :class="fitAllContent ? 'flex-shrink-0' : ''">
      <el-card
        class="o-top-card"
        shadow="never"
        :body-class="middleCardBodyCls"
      >
        <!-- 中间内容 -->
        <slot name="middle"></slot>
      </el-card>
    </div>
    <el-card
      shadow="never"
      class="o-center-card"
      :class="fitAllContent ? 'flex-1 h-0' : ''"
      :body-class="`${mainCardBodyCls} u-full-screen-ele`"
    >
      <!-- 主体内容 -->
      <slot></slot>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
defineOptions({ name: 'LsyTopMiddleMainContentLayout' })

withDefaults(
  defineProps<{
    /**
     * 组件内容是否占满整个父容器高度. 默认:true
     *
     * 为true, 则是类似如下形式的布局结构
     * ```html
     * <div class='h-full flex flex-col'>
     *  <div class='flex-sharking-0'>顶部内容</div>
     *  <div class='flex-sharking-0'>中间内容</div>
     *  <div class='flex-1 h-0'>主体内容</div>
     * </div>
     * ```
     *
     * 为false, 则是类似如下形式的布局结构 (不会通过flex布局控制高度,也不会占满父容器的所有高度)
     * ```html
     * <div>
     *  <div>顶部内容</div>
     *  <div>中间内容</div>
     *  <div>主体内容</div>
     * </div>
     * ```
     */
    fitAllContent?: boolean
    topCardCls?: string
    topCardBodyCls?: string
    middleCardBodyCls?: string
    mainCardBodyCls?: string
    /**
     * 主体的el-card是否充满剩余空间. 默认:true
     */
    mainCardFitAll?: boolean
  }>(),
  {
    topCardCls: '',
    middleCardBodyCls: '',
    topCardBodyCls: '',
    mainCardBodyCls: '',
    mainCardFitAll: true,
  }
)
</script>

<style scoped></style>
