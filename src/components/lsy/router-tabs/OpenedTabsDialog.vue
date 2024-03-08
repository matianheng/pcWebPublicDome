<template>
  <el-dialog
    v-model="dialogVisible"
    modal-class="o-lsy-dialog"
    title="已打开标签页"
    :destroy-on-close="true"
  >
    <div v-if="dialogVisible" class="h-72 overflow-auto">
      <VueDraggable
        v-model="openedTabArr"
        :animation="150"
        handle=".handle"
        class="flex flex-col gap-2 p-4 rounded"
      >
        <div
          v-for="item in openedTabArr"
          :key="item.index"
          class="h-50px bg-gray-500/10 rounded flex flex-row items-center justify-between py-3 select-none"
          :class="{ active: defaultActive === item.index }"
        >
          <div
            class="handle cursor-move px-5 border-r-2 border-solid border-r-gray-400 flex-shrink-0"
          >
            <el-icon><Sort /></el-icon>
          </div>
          <div class="flex-1 w-0 px-2">{{ item.name }}</div>
          <div
            class="cursor-pointer px-5 border-l-2 border-solid border-l-gray-400 flex-shrink-0"
            @click="() => toTabRoute(item)"
          >
            <el-icon><Position /></el-icon>
          </div>
        </div>
      </VueDraggable>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { LsyOpenedTabMetadata } from './typing'
import { toRefs } from 'vue'
import { Position, Sort } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    tabArr?: LsyOpenedTabMetadata[]
    visible?: boolean
    defaultActive?: string
  }>(),
  {
    tabArr: () => [],
    visible: false,
    defaultActive: '',
  }
)
const $emits = defineEmits<{
  'update:tabArr': [val: LsyOpenedTabMetadata[]]
  'update:visible': [val: boolean]
}>()
const { tabArr, visible } = toRefs(props)
const openedTabArr = computed<LsyOpenedTabMetadata[]>({
  get() {
    return tabArr.value
  },
  set(val: LsyOpenedTabMetadata[]) {
    $emits('update:tabArr', val)
  },
})
const dialogVisible = computed<boolean>({
  get() {
    return visible.value
  },
  set(val: boolean) {
    $emits('update:visible', val)
  },
})
const $router = useRouter()
function toTabRoute(tab: LsyOpenedTabMetadata) {
  tab.routePath && $router.push({ path: tab.routePath })
}
</script>

<style scoped lang="scss">
.active {
  color: var(--primaryColor);
  background-color: var(--primaryBgColor);

  > div {
    border-color: var(--primaryColor);
  }
}
</style>
