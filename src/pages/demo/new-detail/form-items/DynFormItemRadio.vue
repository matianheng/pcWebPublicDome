<template>
  <el-radio-group
    v-if="editMode === 'writable'"
    v-model="valComputed"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width: 100%"
    @change="onChange"
  >
    <el-radio
      v-for="optionItem in optionItemArr"
      :key="`${optionItem.value}`"
      :label="optionItem.value"
    >
      {{ optionItem.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import {
  EditMode,
  LsyDynFormData,
  LsyFormItemConfig,
  OptionItem,
} from '../typing'
import { watch } from 'vue'
import { ref, toRefs } from 'vue'
import { computed } from 'vue'
import { dicMockAPI } from '../../mock-api/ListApi'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    disabled?: boolean
    placeholder?: string
    formData: LsyDynFormData
    itemConfig: LsyFormItemConfig

    readonly?: boolean
    dictType: string
    /**
     * 该属性可用于在只读和标记有误模式下,更新 NewMarkErrorPopover 中的显示值
     */
    updateContent: (val: string) => void
    editMode: EditMode
  }>(),
  {
    modelValue: undefined,
    placeholder: undefined,
  }
)
const { modelValue, itemConfig, readonly, dictType, editMode } = toRefs(props)

const $emits = defineEmits<{
  'update:modelValue': [val?: number]
}>()
const valComputed = computed({
  get() {
    return modelValue?.value
  },
  set(val?: number) {
    $emits('update:modelValue', val)
  },
})

const optionItemArr = ref<OptionItem[]>([])
const modelValueText = computed(() => {
  const item = optionItemArr.value.find(item => item.value === modelValue.value)
  if (item) {
    return item.label
  } else if (modelValue?.value) {
    return `${modelValue.value}`
  } else {
    return ''
  }
})
watch(
  dictType,
  newDictType => {
    if (newDictType) {
      dicMockAPI(newDictType).then(arr => {
        if (arr && arr.length > 0) {
          optionItemArr.value = arr.map(item => ({
            label: item.text,
            value: item.value,
          }))
        }
      })
    }
  },
  { immediate: true }
)
watch([editMode, modelValueText], ([newEditMode, newModelValueText]) => {
  if (newEditMode !== 'writable') {
    props.updateContent(newModelValueText)
  }
})
function onChange(val: any) {
  if (
    itemConfig.value.customCompEvents?.change &&
    itemConfig.value.customCompEvents.change instanceof Function
  ) {
    itemConfig.value.customCompEvents.change(val)
  }
}
</script>

<style scoped></style>
