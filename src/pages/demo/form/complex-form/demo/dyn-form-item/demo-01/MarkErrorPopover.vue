<template>
  <el-popover placement="top" title="标记有误" :width="300" trigger="click">
    <template #reference>
      <div class="w-full">
        <LsyDynSingleRowEllipsis
          :content="val"
          :use-tooltips="true"
        ></LsyDynSingleRowEllipsis>
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
          <el-button @click="onClearMarkError"> 清除标记有误 </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="onSaveMarkError">保存</el-button>
          <el-button @click="onCancelMarkError">取消</el-button>
        </template>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { watch, toRefs } from 'vue'
import { ref } from 'vue'

defineOptions({ name: 'MarkErrorPopover' })

const props = withDefaults(
  defineProps<{
    /**
     * 表单项填写内容
     */
    val?: string
    /**
     * 标记有误内容
     */
    markError?: string
  }>(),
  { val: undefined, markError: undefined }
)
const $emits = defineEmits<{
  onClearMarkError: [(ret: boolean) => void]
  onSaveMarkError: [string, (ret: boolean) => void]
}>()
const { markError } = toRefs(props)
const writeableMarkError = ref('')
watch(
  markError,
  newMarkError => {
    console.log('newMarkError', newMarkError)
    writeableMarkError.value = newMarkError ?? ''
  },
  { immediate: true }
)
function onClearMarkError() {
  $emits('onClearMarkError', () => {
    onChangeMarkErrorDisableStatus(true)
  })
}
function onSaveMarkError() {
  $emits('onSaveMarkError', writeableMarkError.value, () => {
    onChangeMarkErrorDisableStatus(true)
  })
}
function onCancelMarkError() {
  console.log('onCancelMarkError')
  writeableMarkError.value = markError.value ?? ''
}
const disableEditMarkError = ref(true)

function onChangeMarkErrorDisableStatus(val: boolean) {
  disableEditMarkError.value = val
}
</script>

<style scoped></style>
