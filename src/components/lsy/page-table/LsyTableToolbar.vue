<template>
  <div class="flex flex-row items-center o-table-toolbar">
    <div>
      <span>边框</span>
      <el-switch v-model="borderComputed" size="small" />
    </div>
    <div>
      <span>斑马线</span>
      <el-switch v-model="stripeComputed" size="small" />
    </div>
    <div>
      <!-- teleported设置为false的目的是防止全屏的时候dropdown不可见 -->
      <el-dropdown
        :teleported="false"
        trigger="click"
        @command="onChangeTableSize"
      >
        <span class="el-dropdown-link"> 密度 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="large">宽松</el-dropdown-item>
            <el-dropdown-item command="default">中等</el-dropdown-item>
            <el-dropdown-item command="small">紧凑</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <el-icon class="cursor-pointer" @click="onRefresh"><Refresh /></el-icon>
    </div>
    <div v-if="showSettings">
      <!-- teleported设置为false的目的是防止全屏的时候dropdown不可见 -->
      <el-popover
        trigger="click"
        :width="200"
        placement="bottom-start"
        :teleported="false"
        :persistent="false"
      >
        <template #reference>
          <el-icon class="cursor-pointer"><Setting /></el-icon>
        </template>
        <el-checkbox
          v-model="showAllColumns"
          :indeterminate="isIndeterminate"
          @change="onCheckAllPropChange"
        >
          展示列
        </el-checkbox>
        <el-checkbox-group
          v-model="checkedPropArr"
          @change="onCheckedPropChange"
        >
          <template v-for="column in columnArr" :key="column.prop">
            <el-checkbox :label="column.prop">
              <div class="flex flex-row justify-between w-40">
                <div class="flex-1 w-0">
                  {{ buildLabel(column.label) }}
                </div>
                <!--
                    // TODO: 待实现表格列，浮动到右边或左边
                -->
                <!-- <div class="flex-shrink-0">
                  <el-icon><ArrowLeftBold /></el-icon>
                  <el-icon><ArrowRightBold /></el-icon>
                </div> -->
              </div>
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </el-popover>
    </div>
    <div>
      <el-icon class="cursor-pointer" @click="onToggleFullScreen">
        <FullScreen />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LsyTableColumn } from './typing'
import { Refresh, Setting, FullScreen } from '@element-plus/icons-vue'
import { ElTableProp } from './typing'
import { computed, toRefs } from 'vue'
import { StringReturnFun } from './typing'
import { useSettings } from './LsyTableToolbarHook'
import { toggleFullscreen } from '@/utils/FullScreenUtil'
import { ElMessageBox } from 'element-plus'
import { markRaw } from 'vue'
import { Warning } from '@element-plus/icons-vue'

defineOptions({ name: 'LsyTableToolbar' })

const props = withDefaults(
  defineProps<{
    /**
     * 列配置(v-model)组件可修改列的排序和显示/隐藏
     */
    columnArr?: LsyTableColumn[]
    /**
     * el-table配置(v-model)
     */
    elTableProp?: ElTableProp
    /**
     * 待全屏元素
     */
    fullEle?: HTMLElement
    /**
     * 是否使用fullEle元素的父级元素进行全屏. 默认:false
     */
    fullscreenParent?: boolean
    /**
     * 是否显示 settings 工具. 默认: false
     *
     * -important- 如果启用了该功能，则外部不能有其他逻辑操作表格列的显示和隐藏, 否则会造成逻辑混乱，且 columnArr 中的 show 属性只能是 undefined 或 boolean 值，不能是函数，因为组件内部会随着用户的操作将 show 属性设置为true或false
     */
    showSettings?: boolean
    /**
     * 全屏/退出全屏前的回调函数
     *
     * @param flag true表示当前是从非全屏到全屏, 反之表示从全屏到非全屏
     */
    fullScreenCallback?: (flag: boolean) => void
  }>(),
  {
    columnArr: () => [],
    elTableProp: () => ({}),
    fullEle: undefined,
    fullscreenParent: false,
    fullScreenCallback: undefined,
  }
)
const $emits = defineEmits<{
  'update:columnArr': [LsyTableColumn[]]
  'update:elTableProp': [ElTableProp]
  refresh: []
}>()

const { columnArr, elTableProp, fullscreenParent } = toRefs(props)

const {
  onCheckedPropChange,
  onCheckAllPropChange,
  checkedPropArr,
  showAllColumns,
  isIndeterminate,
} = useSettings(columnArr, $emits)

const borderComputed = computed<boolean>({
  set(val: boolean) {
    const tmp = { ...elTableProp.value } as ElTableProp
    tmp.border = val
    $emits('update:elTableProp', tmp)
  },
  get() {
    return elTableProp.value.border as boolean
  },
})
const stripeComputed = computed<boolean>({
  set(val: boolean) {
    const tmp = { ...elTableProp.value } as ElTableProp
    tmp.stripe = val
    $emits('update:elTableProp', tmp)
  },
  get() {
    return elTableProp.value.stripe as boolean
  },
})

function onRefresh() {
  $emits('refresh')
}
const fullScreen = ref<boolean>(false)
function onToggleFullScreen() {
  fullScreen.value = !fullScreen.value
  props.fullEle &&
    toggleFullscreen(
      props.fullEle,
      fullscreenParent.value,
      props.fullScreenCallback
    ).catch(ret => {
      ElMessageBox.confirm(`${ret}`, '提示', {
        type: 'warning',
        icon: markRaw(Warning),
      })
    })
}
function buildLabel(label?: string | StringReturnFun) {
  if (label instanceof Function) {
    return label()
  } else {
    return label
  }
}
function onChangeTableSize(size: string) {
  const tmp = { ...elTableProp.value, size }
  $emits('update:elTableProp', tmp)
}
</script>

<style scoped lang="scss">
.o-table-toolbar {
  > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 0.4rem;

    > span {
      margin-right: 0.1rem;
    }
  }
}
</style>
