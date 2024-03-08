<template>
  <OrgTree
    :tree-data="treeData"
    :init-expand-level="1"
    :load-node="loadNode"
    line-style="dashed 2px #ad8b00"
  >
    <template #default="{ toggleChildren, treeNodeData, loadChildrenData }">
      <div
        v-loading="loadingNodeKey === treeNodeData.key"
        class="border-solid border-2 border-blue-500 rounded p-1"
      >
        <div @click="() => onClickNodeTitle(treeNodeData)">
          {{ treeNodeData.title }}
        </div>
        <div
          v-if="treeNodeData.hasChildren"
          class="bg-red-100 text-center cursor-pointer"
          @click="evt => onClickPlus(evt, loadChildrenData, toggleChildren)"
        >
          +
        </div>
        <div v-else class="bg-green-200 text-center">叶子节点</div>
      </div>
    </template>
  </OrgTree>
</template>

<script setup lang="ts">
import {
  OrgTreeNodeData,
  OrgTreeNodeDataInner,
} from '@/components/lsy/org-tree/typing'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const treeData: OrgTreeNodeData[] = [
  {
    key: '0',
    title: 'Parent',
    hasChildren: true,
  },
]

const loadingNodeKey = ref<string | undefined>()

function loadNode(
  parentNode: OrgTreeNodeDataInner,
  resolveMethod: (children: OrgTreeNodeData[]) => void
) {
  if (!parentNode.children || parentNode.children.length === 0) {
    loadingNodeKey.value = parentNode.key
    const ret: OrgTreeNodeData[] = []
    for (let i = 0; i < 5; i++) {
      const key = parentNode.key + `-${i}`
      ret.push({ title: `子节点:${key}`, key, hasChildren: key !== '0-0' })
    }
    setTimeout(() => {
      resolveMethod(ret)
      loadingNodeKey.value = undefined
    }, 1500)
  } else {
    resolveMethod([])
  }
}
function onClickPlus(
  evt: MouseEvent,
  loadChildrenData: () => void,
  toggleChildren: () => void
) {
  evt.stopPropagation()
  loadChildrenData()
  toggleChildren()
  return false
}
function onClickNodeTitle(treeNodeData: OrgTreeNodeDataInner) {
  ElMessage.info({
    message: `点击了:${treeNodeData.title}`,
  })
}
</script>

<style scoped></style>
