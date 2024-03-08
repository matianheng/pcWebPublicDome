<template>
  <ul>
    <li v-for="(treeNode, idx) in modelValue" :key="treeNode.key">
      <slot
        :tree-node-data="treeNode"
        :toggle-children="() => toggleChildren(treeNode)"
        :load-children-data="() => loadChildrenNode(treeNode, idx)"
      >
        <div class="o-lsy-org-tree-node" @click="onNodeClick(treeNode, idx)">
          <span>
            {{ treeNode.title }}
          </span>
          <span
            v-if="hasChildren(treeNode)"
            class="absolute bottom-0 left-1/2 o-lsy-node-plus text-white bg-blue-500 rounded-[100%] w-4 h-4 z-10"
          >
          </span>
        </div>
      </slot>
      <Transition>
        <OrgTreeNode
          v-if="
            treeNode.children &&
            treeNode.children.length > 0 &&
            treeNode.showChildren
          "
          v-model="treeNode.children"
          :border-radius="borderRadius"
          :level-node-margin="levelNodeMargin"
          :load-node="loadNode"
          :line-style="lineStyle"
        >
          <template
            v-if="$slots.default"
            #default="{
              treeNodeData,
              loadChildrenData: _loadChildrenData,
              toggleChildren: _toggleChildren,
            }"
          >
            <slot
              :tree-node-data="treeNodeData"
              :toggle-children="_toggleChildren"
              :load-children-data="_loadChildrenData"
            ></slot>
          </template>
        </OrgTreeNode>
      </Transition>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import OrgTreeNode from './OrgTreeNode.vue'
import { orgTreeNodeDataToInnerData } from './OrgTreeUtil'
import type { OrgTreeNodeData, OrgTreeNodeDataInner } from './typing.d'

const props = withDefaults(
  defineProps<{
    modelValue: OrgTreeNodeDataInner[]
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
     * 用于子节点数据懒加载
     */
    loadNode?: (
      nodeData: OrgTreeNodeDataInner,
      resolve: (treeData: OrgTreeNodeData[]) => void
    ) => void
  }>(),
  {
    borderRadius: '5px',
    levelNodeMargin: 30,
    lineStyle: '2px solid green',
    loadNode: undefined,
  }
)
const $emits = defineEmits<{
  'update:modelValue': [val: OrgTreeNodeDataInner[]]
}>()
defineSlots<{
  default(props: {
    treeNodeData: OrgTreeNodeDataInner
    toggleChildren: () => void
    loadChildrenData: () => void
  }): any
}>()

const $slots = useSlots()
function toggleChildren(treeNodeData: OrgTreeNodeDataInner) {
  treeNodeData.showChildren = !treeNodeData.showChildren
}
function hasChildren(treeNodeData: OrgTreeNodeDataInner) {
  return (
    (treeNodeData.children && treeNodeData.children.length > 0) ||
    treeNodeData.hasChildren
  )
}
function promiseResolve(
  parentNode: OrgTreeNodeDataInner,
  childrenNode: OrgTreeNodeData[],
  idx: number
) {
  const children = orgTreeNodeDataToInnerData(childrenNode, 0, 0)
  if (children && children.length > 0) {
    const tmpParent = { ...parentNode, children, showChildren: true }
    const arr = [...props.modelValue]
    arr.splice(idx, 1, tmpParent)
    $emits('update:modelValue', arr)
  }
}
function loadChildrenNode(treeNode: OrgTreeNodeDataInner, idx: number) {
  if (props.loadNode) {
    props.loadNode(treeNode, (childrenNode: OrgTreeNodeData[]) =>
      promiseResolve(treeNode, childrenNode, idx)
    )
  }
}
function onNodeClick(treeNode: OrgTreeNodeDataInner, idx: number) {
  loadChildrenNode(treeNode, idx)
  toggleChildren(treeNode)
}
</script>

<style scoped lang="scss">
// 动效class
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease-in;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}

.o-lsy-node-plus {
  transform: translate(-50%, 50%);
}

ul,
li {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul {
  position: relative;

  // 基于flex实现树的层级结构
  display: flex;
  margin-top: calc(v-bind(levelNodeMargin) * 1px);

  // 清除第一个ul的margin-top
  &:first-child {
    margin-top: 0;
  }

  // 节点正下方的竖向连线
  &::before {
    position: absolute;
    top: -30px; /* px-to-viewport-ignore */
    left: 50%;
    border-left: v-bind(lineStyle); /* px-to-viewport-ignore */
    height: 18px; /* px-to-viewport-ignore */
    content: '';
  }

  // 去除第一个ul的before伪元素
  &:first-child::before {
    display: none;
  }
}

li {
  position: relative;

  // 以下css实现li下的子元素水平居中的效果
  display: flex;
  align-items: center;
  padding: 3px; /* px-to-viewport-ignore */
  box-sizing: border-box;

  // 让内容将li撑开
  flex-shrink: 0;
  flex-direction: column;

  // 节点矩形样式
  > div.o-lsy-org-tree-node {
    position: relative;
    border: 1px solid red;
    border-radius: 3px; /* px-to-viewport-ignore */
    padding: 10px 15px; /* px-to-viewport-ignore */
    color: lightseagreen;
    cursor: pointer;
  }

  // 节点左上横竖连线
  &::before {
    position: absolute;
    top: -13px; /* px-to-viewport-ignore */
    left: 1px;
    border-top: v-bind(lineStyle); /* px-to-viewport-ignore */
    border-right: v-bind(lineStyle); /* px-to-viewport-ignore */
    width: calc(50% + 1px);
    height: 15px; /* px-to-viewport-ignore */
    content: '';
  }

  // 节点右上横竖连线
  &::after {
    position: absolute;
    top: -13px; /* px-to-viewport-ignore */
    right: -1px;
    border-top: v-bind(lineStyle); /* px-to-viewport-ignore */
    border-left: v-bind(lineStyle); /* px-to-viewport-ignore */
    width: calc(50% + 1px);
    height: 15px; /* px-to-viewport-ignore */
    content: '';
  }
}

// 去除所有ul下所有非第一个li的before伪元素的右边框(避免重复绘制竖线)
ul > li + li::before {
  border-right: none;
}

// 隐藏所有ul下第一个li的左上连线, 隐藏所有ul下最后一个li的右上连线
ul > li:first-child::before,
ul > li:last-child::after {
  display: none;
}

// 设置所有ul下第一个li的右上横竖连线，连线的圆角
ul > li:first-child {
  &::after {
    border-top-left-radius: v-bind(borderRadius);
  }
}

// 设置所有ul下最后一个li的左上横竖连线，连线的圆角
ul > li:last-child {
  &::before {
    border-top-right-radius: v-bind(borderRadius);

    // 因为 ul > li + li:before 选择器中将ul下的非第一个li的竖线都去除了，导致最后一个li无竖线,所以这里补全
    border-right: v-bind(lineStyle); /* px-to-viewport-ignore */
  }
}

/*
  该选择器表示找到ul下只有一个子节点的 li。属于:only-child的替换写法
  :only-child 详见: 
  https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-child
  
  https://blog.csdn.net/qiuqiu1894/article/details/107663181
   */
ul > li:first-child:last-child {
  &::after {
    position: absolute;
    top: -30px; /* px-to-viewport-ignore */
    left: 50%;
    display: block;
    border-top: none;
    height: 32px; /* px-to-viewport-ignore */
    border-top-left-radius: 0;
  }
}

ul:first-child > li:first-child {
  // 去除第一个ul下的第一个li的after伪元素
  &::after {
    display: none;
  }
}
</style>
