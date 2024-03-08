<template>
  <div ref="formWrapperRef">
    <el-form label-width="auto" :model="testData">
      <LsyContainerResponsiveWrapper
        v-model:realCellCount="realCellCount"
        :col-count="colCount"
        class="flex flex-row flex-wrap responsive-wrapper"
        :expand="expand"
      >
        <!-- 加个注释测试下 -->
        <el-form-item label="用户账号1" prop="a">
          <el-input v-model="testData.a"></el-input>
        </el-form-item>
        <el-form-item v-if="testData.a" label="用户账号2" prop="b">
          <el-input v-model="testData.b"></el-input>
        </el-form-item>
        <el-form-item v-if="testData.b" label="用户账号3" prop="c">
          <el-input v-model="testData.c"></el-input>
        </el-form-item>
        <el-form-item v-if="testData.c" label="用户账号4" prop="c">
          <el-input v-model="testData.d"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
          <el-link
            v-if="needShowToggleBtn"
            type="primary"
            class="ml-3"
            @click="onToggle"
          >
            {{ toggleText }}
          </el-link>
        </el-form-item>
      </LsyContainerResponsiveWrapper>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LsyContainerResponsiveWrapper from '@/components/lsy/container-responsive-wrapper/LsyContainerResponsiveWrapper'
import { useResizeObserverHook } from '@/components/lsy/container-responsive-wrapper/hooks/ResizeObserverHook'

defineOptions({ name: 'ContainerResponsiveWrapperDemo04' })
const expand = ref(false)
const toggleText = computed(() => (expand.value ? '收缩' : '展开'))
const {
  colCount,
  itemWidth,
  formWrapperRef,
  realCellCount,
  needShowToggleBtn,
} = useResizeObserverHook(3, domOffsetWidth => {
  if (domOffsetWidth <= 768) {
    return 1
  } else if (domOffsetWidth <= 992) {
    return 2
  } else if (domOffsetWidth <= 1300) {
    return 3
  } else {
    return 4
  }
})
function onToggle() {
  expand.value = !expand.value
}
interface TestData {
  a?: string
  b?: string
  c?: string
  d?: string
}
const testData = ref<TestData>({
  a: undefined,
  b: undefined,
  c: undefined,
  d: undefined,
})
</script>

<style scoped lang="scss">
.responsive-wrapper {
  ::v-deep(> div) {
    padding-right: 5px;
    padding-left: 5px;
    width: v-bind(itemWidth);

    // 当项div总数量少于colCount的时候，让最后一个保持右浮动
    &:last-child {
      margin-left: auto;
    }
  }
}
</style>
