<template>
  <OrgTree :tree-data="treeData"></OrgTree>
</template>

<script setup lang="ts">
import { OrgTreeNodeData } from '@/components/lsy/org-tree/typing'

const treeData: OrgTreeNodeData[] = [
  {
    key: '0',
    title: 'Parent',
    children: [
      {
        key: '1',
        title: '1.Child',
      },
      {
        key: '2',
        title: '2.Child',
        children: [
          {
            key: '2.1',
            title: '2.1.Grand Child',
            children: [
              {
                key: '2.1.1',
                title: '2.1.1.Grand Child',
              },
            ],
          },
          {
            key: '2.2',
            title: '2.2.Grand Child',
          },
          {
            key: '2.3',
            title: '2.3.Grand Child',
            children: [
              {
                key: '2.3.1',
                title: '2.3.1.Grand Child',
              },
              {
                key: '2.3.2',
                title: '2.3.2.Grand Child',
              },
              {
                key: '2.3.3',
                title: '2.3.3.Grand Child',
              },
              {
                key: '2.3.4',
                title: '2.3.4.Grand Child',
              },
              {
                key: '2.3.5',
                title: '2.3.5.Grand Child',
              },
              {
                key: '2.3.6',
                title: '2.3.6.Grand Child',
              },
            ],
          },
          {
            key: '2.4',
            title: '2.4.Grand Child',
          },
        ],
      },
      {
        key: '3',
        title: '3.Grand Child',
      },
      {
        key: '4',
        title: '4.Grand Child',
      },
    ],
  },
]
</script>

<style scoped></style>
