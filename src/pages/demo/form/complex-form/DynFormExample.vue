<template>
  <LsyContentContainer
    title="动态表单"
    desc="你还在苦思冥想如何开发一个灵活的动态表单组件来实现业务的需求吗? 来看看如下示例吧"
    :features="[
      '通过json对象配置表单项，将逻辑控制与ui实现分离，能更容易/直观的实现对表单项的控制，也更利于后期维护，更符合高内聚低耦合的代码风格标准',
      '对于表单项粒度，需自行根据实际情况把控，通用的表单项组件会导致代码复杂度提高，但过于细化的实现表单项组件，又可能导致表单项组件数量巨增',
      '通过自定义 LsyDynForm.vue, LsyDynFormResponsive.vue 组件实现, LsyDynForm.vue 为纯动态表单组件, 而 LsyDynFormResponsive.vue 内部整合了 LsyContainerResponsiveWrapper.tsx 组件, 因此也可以实现基于dom节点大小监听的响应式控制',
    ]"
    :enable-back-top-comp="true"
    :enable-toc="true"
    :lazy-render-content="true"
  >
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[0]" shadow="never">
        <template #header>
          <h3 class="font-bold">根据容器宽度，进行列数响应的动态表单</h3>
          <small>DynFormDemo11</small>
        </template>
        <DynFormDemo11 :form-item-comp-name-map="map"></DynFormDemo11>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[1]" shadow="never">
        <template #header>
          <h3 class="font-bold">A表单项值填写情况，控制B表单项的显示/隐藏</h3>
          <small>DynFormDemo01</small>
        </template>
        <DynFormDemo01 :form-item-comp-name-map="map"></DynFormDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[2]" shadow="never">
        <template #header>
          <h3 class="font-bold">A表单项值填写情况，控制B表单项是否可编辑</h3>
          <small>DynFormDemo02</small>
        </template>
        <DynFormDemo02 :form-item-comp-name-map="map"></DynFormDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[3]" shadow="never">
        <template #header>
          <h3 class="font-bold">表单项自定义验证</h3>
          <small>DynFormDemo03</small>
        </template>
        <DynFormDemo03 :form-item-comp-name-map="map"></DynFormDemo03>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[4]" shadow="never">
        <template #header>
          <h3 class="font-bold">由后端接口，控制表单显示的表单项</h3>
          <small>DynFormDemo04</small>
        </template>
        <DynFormDemo04 :form-item-comp-name-map="map"></DynFormDemo04>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[5]" shadow="never">
        <template #header>
          <h3 class="font-bold">由后端接口，控制表单项的必填验证</h3>
          <small>DynFormDemo05</small>
        </template>
        <DynFormDemo05 :form-item-comp-name-map="map"></DynFormDemo05>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[6]" shadow="never">
        <template #header>
          <h3 class="font-bold">
            在表单项上，显示后端返回的错误提示信息，并在表单提交时，再次验证该表单项是否有修改为新值
          </h3>
          <small>DynFormDemo06</small>
        </template>
        <DynFormDemo06 :form-item-comp-name-map="map"></DynFormDemo06>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[7]" shadow="never">
        <template #header>
          <h3 class="font-bold">字段关联验证</h3>
          <small>DynFormDemo07</small>
        </template>
        <DynFormDemo07 :form-item-comp-name-map="map"></DynFormDemo07>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[8]" shadow="never">
        <template #header>
          <h3 class="font-bold">自定义表单项组件</h3>
          <small>DynFormDemo08</small>
        </template>
        <DynFormDemo08 :form-item-comp-name-map="map"></DynFormDemo08>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[9]" shadow="never">
        <template #header>
          <h3 class="font-bold">表单整体状态切换(只读与可编辑相互切换)</h3>
          <small>DynFormDemo09</small>
        </template>
        <DynFormDemo09 :form-item-comp-name-map="map"></DynFormDemo09>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card v-if="stepRenderFlagArr[10]" shadow="never">
        <template #header>
          <h3 class="font-bold">实现表单项的标记有误</h3>
          <small>DynFormDemo10</small>
        </template>
        <DynFormDemo10 :form-item-comp-name-map="map"></DynFormDemo10>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { loadVueCompFromModules } from '@/components/lsy/dyn-form/LsyDynFormUtil'
import DynFormDemo01 from './demo/DynFormDemo01.vue'
import DynFormDemo02 from './demo/DynFormDemo02.vue'
import DynFormDemo03 from './demo/DynFormDemo03.vue'
import DynFormDemo04 from './demo/DynFormDemo04.vue'
import DynFormDemo05 from './demo/DynFormDemo05.vue'
import DynFormDemo06 from './demo/DynFormDemo06.vue'
import DynFormDemo07 from './demo/DynFormDemo07.vue'
import DynFormDemo08 from './demo/DynFormDemo08.vue'
import DynFormDemo09 from './demo/DynFormDemo09.vue'
import DynFormDemo10 from './demo/DynFormDemo10.vue'
import DynFormDemo11 from './demo/DynFormDemo11.vue'
import { markRaw } from 'vue'
import { useStepRenderHooks } from '@/utils/VueComponentRenderUtil'
import { onMounted } from 'vue'
import { emitRerenderToc } from '@/components/lsy/toc/TocEmitter'

defineOptions({ name: 'DynFormExample' })

const modules = import.meta.glob('./demo/dyn-form-item/**/*.vue', {
  eager: true,
})
const map = markRaw(loadVueCompFromModules(modules))

const { stepRender, stepRenderFlagArr } = useStepRenderHooks(11, () => {
  emitRerenderToc()
})
onMounted(() => {
  stepRender()
})
</script>

<style scoped></style>
