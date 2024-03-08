<!--
面包屑组件
@author: pan
@createDate: 2023-09-12 19:53
-->
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import {
  LsyBreadcrumbItem,
  LsyBreadcrumbItemFieldMapping,
  InnerLsyBreadcrumbItem,
} from './typing'
import { useRoute } from 'vue-router'

defineOptions({ name: 'LsyBreadcrumb' })

const props = withDefaults(
  defineProps<{
    /**
     * 分隔符
     */
    separator?: string
    fieldMapping?: LsyBreadcrumbItemFieldMapping
    /**
     * 面包屑元数据
     */
    dataArr?: LsyBreadcrumbItem[]
  }>(),
  {
    separator: '/',
    fieldMapping: undefined,
    dataArr: () => [],
  }
)
const { dataArr, fieldMapping } = toRefs(props)
const defaultFieldMapping: LsyBreadcrumbItemFieldMapping = {
  index: 'index',
  name: 'name',
  icon: 'icon',
  routePath: 'routePath',
  children: 'children',
  customDataMap: 'customDataMap',
}
const breadcrumbItemFieldMappingComputed = computed(() => {
  let mapping: LsyBreadcrumbItemFieldMapping = { ...defaultFieldMapping }
  if (fieldMapping?.value) {
    mapping = { ...defaultFieldMapping, ...fieldMapping?.value }
  }
  return mapping
})

const realBreadcrumbItemComputed = computed(() => {
  const breadcrumbItemIndexMap = new Map<string, InnerLsyBreadcrumbItem>()
  const realBreadcrumbItemArr = arrDataConvert(
    breadcrumbItemIndexMap,
    null,
    dataArr.value
  )
  return { realBreadcrumbItemArr, breadcrumbItemIndexMap }
})
const $route = useRoute()
const showDataArr = computed(() => {
  const { name } = $route
  const { breadcrumbItemIndexMap } = realBreadcrumbItemComputed.value
  const cur = breadcrumbItemIndexMap.get(name as string)
  if (!name || !cur) return []
  const breadcrumbItem = breadcrumbItemIndexMap.get(name as string)
  if (!breadcrumbItem) return []
  const ret = breadcrumbItem.ancestorIndexArr
    ? breadcrumbItem.ancestorIndexArr.map(item =>
        breadcrumbItemIndexMap.get(item)
      )
    : []
  ret.push(cur)
  return ret
})

function arrDataConvert(
  menuIndexMap: Map<string, InnerLsyBreadcrumbItem>,
  parentMenuItem: InnerLsyBreadcrumbItem | null,
  arr?: LsyBreadcrumbItem[]
): InnerLsyBreadcrumbItem[] {
  if (!arr || arr.length === 0) {
    return []
  }

  return arr.reduce<InnerLsyBreadcrumbItem[]>((prev, cur) => {
    const item = dataConvert(cur, parentMenuItem)
    menuIndexMap.set(item.index as string, item)
    prev.push(item)
    if (item.children) {
      item.children = arrDataConvert(menuIndexMap, item, item.children)
    }
    return prev
  }, [])
}

function dataConvert(
  cur: LsyBreadcrumbItem,
  parentItem: InnerLsyBreadcrumbItem | null
): InnerLsyBreadcrumbItem {
  const breadcrumbItemFieldMapping = breadcrumbItemFieldMappingComputed.value
  const index: string | undefined = cur[
    breadcrumbItemFieldMapping.index as string
  ]
    ? (cur[breadcrumbItemFieldMapping.index as string] as string)
    : undefined
  const name: string | undefined = cur[
    breadcrumbItemFieldMapping.name as string
  ]
    ? (cur[breadcrumbItemFieldMapping.name as string] as string)
    : undefined
  const icon: string | undefined = cur[
    breadcrumbItemFieldMapping.icon as string
  ]
    ? (cur[breadcrumbItemFieldMapping.icon as string] as string)
    : undefined
  const routePath: string | undefined = cur[
    breadcrumbItemFieldMapping.routePath as string
  ]
    ? (cur[breadcrumbItemFieldMapping.routePath as string] as string)
    : undefined
  const children = cur[breadcrumbItemFieldMapping.children as string]
    ? (cur[
        breadcrumbItemFieldMapping.children as string
      ] as LsyBreadcrumbItem[])
    : undefined
  const customDataMap = cur[breadcrumbItemFieldMapping.customDataMap as string]
    ? (cur[breadcrumbItemFieldMapping.customDataMap as string] as Map<
        string,
        unknown
      >)
    : undefined
  let parentIndex: string | undefined = undefined
  // 构建先辈节点index数组
  let ancestorIndexArr: string[] = []
  if (parentItem) {
    parentIndex = parentItem.index
    if (parentItem.ancestorIndexArr && parentItem.ancestorIndexArr.length > 0) {
      ancestorIndexArr = [
        ...parentItem.ancestorIndexArr,
        parentItem.index as string,
      ]
    } else {
      ancestorIndexArr = [parentItem.index as string]
    }
  }
  return {
    parentIndex,
    index,
    name,
    icon,
    routePath,
    children,
    customDataMap,
    ancestorIndexArr,
  }
}
</script>

<template>
  <el-breadcrumb :separator="separator">
    <el-breadcrumb-item
      v-for="item in showDataArr"
      :key="item?.index"
      :to="item?.routePath"
    >
      {{ item?.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
