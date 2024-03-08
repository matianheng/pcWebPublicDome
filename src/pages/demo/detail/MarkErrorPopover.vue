<template>
  <el-popover
    :disabled="disabled"
    placement="top"
    title="标记有误"
    :width="300"
    trigger="click"
  >
    <template #reference>
      <div class="w-full">
        <slot :val="val">
          <LsyDynSingleRowEllipsis
            :content="val"
            :use-tooltips="true"
            :no-content-insert-blank="true"
          ></LsyDynSingleRowEllipsis>
        </slot>
      </div>
    </template>
    <div class="flex flex-col">
      <el-input
        v-model="writeableMarkError"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        :disabled="disableEditMarkError"
      ></el-input>
      <div class="flex flex-row justify-end pt-3">
        <template v-if="disableEditMarkError">
          <el-button
            type="primary"
            @click="() => onChangeMarkErrorDisableStatus(false)"
          >
            标记有误
          </el-button>
          <el-button :loading="clearingMarkError" @click="onClearMarkError">
            清除标记有误
          </el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            :loading="submittingMarkError"
            @click="onSaveMarkError"
          >
            保存
          </el-button>
          <el-button @click="onCancelMarkError">取消</el-button>
        </template>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { watch, toRefs } from 'vue'
import { ref } from 'vue'
import type { SaveMarkErrorCallback } from './typing'

defineOptions({ name: 'MarkErrorPopover' })

const props = withDefaults(
  defineProps<{
    /**
     * 表单项值
     */
    val?: string
    /**
     * 标记有误内容
     */
    markError?: string
    /**
     * 是否可用
     */
    disabled: boolean
  }>(),
  { val: undefined, markError: undefined }
)
const $emits = defineEmits<{
  onClearMarkError: [SaveMarkErrorCallback]
  onSaveMarkError: [msg: string, callback: SaveMarkErrorCallback]
}>()
const { markError } = toRefs(props)
const writeableMarkError = ref('')
watch(
  markError,
  newMarkError => {
    writeableMarkError.value = newMarkError ?? ''
  },
  { immediate: true }
)
const clearingMarkError = ref<boolean>(false)
function onClearMarkError() {
  clearingMarkError.value = true
  $emits('onClearMarkError', () => {
    onChangeMarkErrorDisableStatus(true)
    clearingMarkError.value = false
  })
}
const submittingMarkError = ref<boolean>(false)
function onSaveMarkError() {
  submittingMarkError.value = true
  $emits('onSaveMarkError', writeableMarkError.value, () => {
    onChangeMarkErrorDisableStatus(true)
    submittingMarkError.value = false
  })
}
function onCancelMarkError() {
  console.log('onCancelMarkError')
  writeableMarkError.value = markError.value ?? ''
  onChangeMarkErrorDisableStatus(true)
}
const disableEditMarkError = ref(true)

function onChangeMarkErrorDisableStatus(val: boolean) {
  disableEditMarkError.value = val
}
</script>

<style scoped></style>
