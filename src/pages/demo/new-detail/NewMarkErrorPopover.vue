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
        <template v-if="editMode !== 'writable'">
          <LsyMutilLineTextToggle
            v-if="inputIsTextArea"
            :content="content"
          ></LsyMutilLineTextToggle>
          <el-avatar
            v-else-if="inputIsAvatar"
            :size="180"
            :src="
              isEmpty(content)
                ? 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                : content
            "
            class="avatar"
          />
          <LsyDynSingleRowEllipsis
            v-else
            :content="content"
            :use-tooltips="true"
            :no-content-insert-blank="true"
          ></LsyDynSingleRowEllipsis>
        </template>
        <slot :update-content="updateContent"> </slot>
      </div>
    </template>
    <div class="flex flex-col">
      <el-input
        v-model="writeableMarkError"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        resize="none"
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
import { useNewDetailStore } from './store/NewDetailStore'
import { EditMode } from './typing'
import { computed } from 'vue'
import { isNotNullAndNotUndefined } from '@/utils/TypeUtils'
import { isEmpty } from 'lodash-unified'

defineOptions({ name: 'NewMarkErrorPopover' })

const props = withDefaults(
  defineProps<{
    /**
     * 表单项值
     */
    val?: string | number | [string, string]
    /**
     * 标记有误数据的id
     */
    markErrorId?: string
    /**
     * 大类
     */
    section: string
    /**
     * 行号
     */
    row: number
    /**
     * 标记有误内容
     */
    markError?: string
    /**
     * 标记有误字段
     */
    field: string
    /**
     * 编辑模式
     */
    editMode: EditMode
    /**
     * 输入组件是否为多行文本输入框(如果为true,则只读和标记有误显示数据时,会以多行文本的方式显示)
     */
    inputIsTextArea?: boolean
    /**
     * 输入组件是否为头像上传组件(如果为true,则将结果显示为el-avatar)
     */
    inputIsAvatar?: boolean
  }>(),
  { val: undefined, markError: undefined, markErrorId: undefined }
)
const $emits = defineEmits<{
  saveMarkError: [row: number, field: string]
}>()

const { markError, section, row, field, markErrorId, editMode, val } =
  toRefs(props)
const disabled = computed(
  () => ['readonly', 'writable'].indexOf(editMode.value) >= 0
)
const newDetailStore = useNewDetailStore()
const { saveMarkError, clearMarkError } = newDetailStore
const writeableMarkError = ref('')
const content = ref('')
watch(
  val,
  newVal => {
    if (isNotNullAndNotUndefined(newVal)) {
      content.value = `${newVal}`
    } else {
      content.value = ''
    }
  },
  { immediate: true }
)
watch(
  markError,
  newMarkError => {
    writeableMarkError.value = newMarkError ?? ''
  },
  { immediate: true }
)
const clearingMarkError = ref<boolean>(false)

async function onClearMarkError() {
  clearingMarkError.value = true
  if (markErrorId.value) {
    await clearMarkError(
      row.value,
      section.value,
      markErrorId.value,
      field.value
    )
  }
  onChangeMarkErrorDisableStatus(true)
  clearingMarkError.value = false
}
const submittingMarkError = ref<boolean>(false)
function onSaveMarkError() {
  submittingMarkError.value = true
  saveMarkError({
    section: section.value,
    row: row.value,
    field: field.value,
    msg: writeableMarkError.value,
  })
    .then(() => {
      $emits('saveMarkError', row.value, field.value)
    })
    .finally(() => {
      submittingMarkError.value = false
    })
}
function onCancelMarkError() {
  writeableMarkError.value = markError.value ?? ''
  onChangeMarkErrorDisableStatus(true)
}
const disableEditMarkError = ref(true)

function onChangeMarkErrorDisableStatus(val: boolean) {
  disableEditMarkError.value = val
}
function updateContent(val: string) {
  content.value = val
}
</script>

<style scoped></style>
