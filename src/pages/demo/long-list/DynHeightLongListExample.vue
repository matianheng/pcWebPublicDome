<template>
  <LsyContentContainer
    title="不定高长列表示例"
    :enable-back-top-comp="true"
    :enable-toc="true"
    :features="[
      '本地开发时,vite-plugin-vue-devtools工具,会造成该界面示例滚动卡顿,关闭vite-plugin-vue-devtools插件,即可恢复正常',
    ]"
  >
    <div class="pb-3">
      <el-card shadow="never" body-class="h-80">
        <template #header>
          <h3 class="font-bold">自定义样式1</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <DynHeightLongList
          ref="dynHeightLongListRef1"
          :cache-count="30"
          :estimate-height="100"
          :load-data="loadData"
          :item-comp="Item"
          @vue:mounted="onVNodeMounted1"
        ></DynHeightLongList>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never" body-class="h-80">
        <template #header>
          <h3 class="font-bold">自定义样式2</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <DynHeightLongList
          ref="dynHeightLongListRef2"
          :cache-count="50"
          :estimate-height="100"
          :load-data="loadData"
          :item-comp="Item2"
          @vue:mounted="onVNodeMounted2"
        >
        </DynHeightLongList>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">通过数据id转到对应dom节点</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <div class="h-80">
          <DynHeightLongList
            ref="dynHeightLongListRef3"
            :cache-count="20"
            :estimate-height="100"
            :load-data="loadData"
            :item-comp="Item2"
            @vue:mounted="onVNodeMounted3"
          >
          </DynHeightLongList>
        </div>
        <el-button class="mt-3" type="primary" @click="onToDomById('45')">
          转到指定id对应dom位置
        </el-button>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">更新列表项数据属性值</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <div>点击标题看效果</div>
        <div class="h-80">
          <DynHeightLongList
            ref="dynHeightLongListRef4"
            :cache-count="20"
            :estimate-height="100"
            :load-data="loadData"
            :item-comp="Item3"
            @vue:mounted="onVNodeMounted4"
          >
          </DynHeightLongList>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">清空数据，重新加载</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <div class="h-80">
          <DynHeightLongList
            ref="dynHeightLongListRef5"
            :cache-count="20"
            :estimate-height="100"
            :load-data="loadData"
            :item-comp="Item3"
            @vue:mounted="onReInit"
          >
          </DynHeightLongList>
        </div>
        <div>
          <el-button type="primary" @click="onReInit">
            清空数据，重新加载
          </el-button>
        </div>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">滚动到顶部，继续向上滚动，则向头部追加数据</h3>
          <small>DynHeightLongListExample</small>
        </template>
        <div class="h-80">
          <DynHeightLongList2
            ref="dynHeightLongListRef6"
            :cache-count="20"
            :estimate-height="100"
            :load-data="loadData2"
            :item-comp="Item3"
            @vue:mounted="onVNodeMounted6"
          >
          </DynHeightLongList2>
        </div>
        <div>
          <el-button type="primary" @click="onReInit6">
            清空数据，重新加载
          </el-button>
        </div>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynHeightLongList from './dyn-height/DynHeightLongList.vue'
import DynHeightLongList2 from './dyn-height/DynHeightLongList2.vue'
import { ComponentExposed } from 'vue-component-type-helpers'
import {
  searchArticle,
  searchArticleBaseId,
} from '@/pages/demo/mock-api/ListApi.ts'
import Item from './Item.vue'
import Item2 from './Item2.vue'
import Item3 from './Item3.vue'

type DynHeightLongListExportType = ComponentExposed<typeof DynHeightLongList>

const dynHeightLongListRef1 = ref<DynHeightLongListExportType>()
const dynHeightLongListRef2 = ref<DynHeightLongListExportType>()
const dynHeightLongListRef3 = ref<DynHeightLongListExportType>()
const dynHeightLongListRef4 = ref<DynHeightLongListExportType>()
const dynHeightLongListRef5 = ref<DynHeightLongListExportType>()
const dynHeightLongListRef6 = ref<DynHeightLongListExportType>()

function onVNodeMounted1() {
  dynHeightLongListRef1.value?.init()
}
function onVNodeMounted2() {
  dynHeightLongListRef2.value?.init()
}
function onVNodeMounted3() {
  dynHeightLongListRef3.value?.init()
}
function onVNodeMounted4() {
  dynHeightLongListRef4.value?.init()
}

function loadData(pageNum: number) {
  return searchArticle(pageNum)
}
function loadData2(next: boolean, id?: number | string) {
  return searchArticleBaseId(next ? 'next' : 'prev', id as string)
}
function onVNodeMounted6() {
  dynHeightLongListRef6.value?.init()
}
function onToDomById(dataId: string) {
  dynHeightLongListRef3.value?.scrollToDataId(dataId)
}
function onReInit() {
  dynHeightLongListRef5.value?.init()
}
function onReInit6() {
  dynHeightLongListRef6.value?.init()
}
</script>

<style scoped></style>
