<script setup lang="ts">
import type { OrgTreeNodeData, OrgTreeNodeDataInner } from './typing.d'
import OrgTreeNode from './OrgTreeNode.vue'
import { ref } from 'vue'
import { watch, toRefs } from 'vue'
import { orgTreeNodeDataToInnerData } from './OrgTreeUtil'

const props = withDefaults(
  defineProps<{
    treeData?: OrgTreeNodeData[]
    /**
     * 竖向连接线与横向连接线之间的边框弧度. 默认:5px
     */
    borderRadius?: string
    /**
     * 层级的间隔距离. 默认:30
     */
    levelNodeMargin?: number
    /**
     * 连线风格
     */
    lineStyle?: string
    /**
     * 初始展开层级. 不传则展开所有层级
     */
    initExpandLevel?: number
    /**
     * 用于子节点数据懒加载
     */
    loadNode?: (
      nodeData: OrgTreeNodeDataInner,
      resolve: (treeData: OrgTreeNodeData[]) => void
    ) => void
  }>(),
  {
    treeData: () => [],
    borderRadius: '5px',
    levelNodeMargin: 30,
    initExpandLevel: undefined,
    lineStyle: '2px solid green',
    loadNode: undefined,
  }
)
defineSlots<{
  default(props: {
    /**
     * 节点信息
     */
    treeNodeData: OrgTreeNodeDataInner
    /**
     * 展开/收缩子节点
     */
    toggleChildren: () => void
    /**
     * 加载子节点的方法
     */
    loadChildrenData: () => void
  }): any
}>()
const { treeData, initExpandLevel } = toRefs(props)
const realTreeData = ref<OrgTreeNodeDataInner[]>([])

watch(
  [treeData, initExpandLevel],
  ([newTreeData, newInitExpandLevel]) => {
    realTreeData.value = orgTreeNodeDataToInnerData(
      newTreeData,
      0,
      newInitExpandLevel
    )
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="o-lsy-org-tree">
    <div
      v-if="realTreeData && realTreeData.length > 0"
      class="m-auto w-max p-2 pb-2"
    >
      <OrgTreeNode
        v-model="realTreeData"
        :border-radius="borderRadius"
        :level-node-margin="levelNodeMargin"
        :load-node="loadNode"
        :line-style="lineStyle"
      >
        <template #default="{ treeNodeData, toggleChildren, loadChildrenData }">
          <slot
            :tree-node-data="treeNodeData"
            :toggle-children="toggleChildren"
            :load-children-data="loadChildrenData"
          ></slot>
        </template>
      </OrgTreeNode>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-lsy-org-tree {
  overflow: auto;
}
</style>
