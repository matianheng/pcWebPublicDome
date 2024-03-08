<template>
  <div class="flex flex-row flex-wrap">
    <div
      v-for="tabItem in tabItemArr"
      :key="tabItem.flag"
      class="text-center w-1/2 sm:h-16 bg-white o-dashboard-item cursor-pointer last:sm:ml-4 flex flex-col justify-center sm:u-dashboard-tab-w"
      :class="{ 'o-actived': clickedTabComputed === tabItem.flag }"
      @click="() => onClick(tabItem.flag)"
    >
      <h3
        class="sm:overflow-hidden sm:whitespace-nowrap sm:overflow-ellipsis pl-2 pr-2"
      >
        {{ tabItem.title }}
      </h3>
      <strong>
        {{ tabItem.count }}
      </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { computed } from 'vue'

export interface TabItemType {
  title: string
  count: number
  flag: string
}

defineOptions({ name: 'DashboardTab' })

const props = withDefaults(
  defineProps<{
    tabItemArr?: TabItemType[]
    /**
     * 选中的tab的flag (v-model)
     */
    clickedTab?: string
  }>(),
  { tabItemArr: () => [], clickedTab: undefined }
)
const $emits = defineEmits<{
  'update:clickedTab': [string | undefined]
}>()
const { tabItemArr, clickedTab } = toRefs(props)
const clickedTabComputed = computed<string | undefined>({
  get() {
    if (clickedTab.value) return clickedTab.value
    else if (tabItemArr.value && tabItemArr.value.length > 0) {
      return tabItemArr.value[0].flag
    }
    return undefined
  },
  set(flag: string | undefined) {
    $emits('update:clickedTab', flag)
  },
})
function onClick(flag: string) {
  $emits('update:clickedTab', flag)
}
</script>

<style scoped lang="scss">
.o-actived {
  --tw-bg-opacity: 1;

  background-color: rgb(186 230 253 / var(--tw-bg-opacity));
}

@media (any-hover: hover) {
  .o-dashboard-item:hover {
    --tw-bg-opacity: 1;

    background-color: rgb(186 230 253 / var(--tw-bg-opacity));
  }
}
</style>
