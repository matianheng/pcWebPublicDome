<template>
  <OrgTree
    :tree-data="treeData"
    :init-expand-level="1"
    :load-node="loadNode"
  ></OrgTree>
</template>

<script setup lang="ts">
import {
  OrgTreeNodeData,
  OrgTreeNodeDataInner,
} from '@/components/lsy/org-tree/typing'

const treeData: OrgTreeNodeData[] = [
  {
    key: '0',
    title: 'Parent',
    hasChildren: true,
  },
]

function loadNode(
  parentNode: OrgTreeNodeDataInner,
  resolveMethod: (children: OrgTreeNodeData[]) => void
) {
  if (!parentNode.children || parentNode.children.length === 0) {
    const ret: OrgTreeNodeData[] = []
    for (let i = 0; i < 5; i++) {
      const key = parentNode.key + `-${i}`
      ret.push({ title: `子节点:${key}`, key, hasChildren: key !== '0-0' })
    }
    setTimeout(() => {
      resolveMethod(ret)
    }, 1500)
  } else {
    resolveMethod([])
  }
}
</script>

<style scoped></style>
