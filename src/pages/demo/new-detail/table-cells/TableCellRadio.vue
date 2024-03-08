<template>
  <el-radio-group
    v-if="editMode === 'writable'"
    v-model="valComputed"
    :loading="loading"
    clearable
    style="width: 100%"
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
import { toRefs } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { dicMockAPI } from '../../mock-api/ListApi'
import { EditMode, OptionItem } from '../typing'
import { computed } from 'vue'
import { isNotNullAndNotUndefined } from '@/utils/TypeUtils'

const props = withDefaults(
  defineProps<{
    dictType: string
    /**
     * v-model
     */
    modelValue?: string | number

    updateContent: (content: string) => void
    editMode: EditMode
  }>(),
  { modelValue: undefined }
)

const $emits = defineEmits<{
  'update:modelValue': [string | number | undefined]
}>()

const { dictType, modelValue } = toRefs(props)
const valComputed = computed({
  get() {
    return modelValue.value
  },
  set(val?: string | number) {
    $emits('update:modelValue', val)
  },
})
const loading = ref(true)
const optionItemArr = ref<OptionItem[]>([])
watch(
  dictType,
  newDictType => {
    dicMockAPI(newDictType)
      .then(arr => {
        if (arr && arr.length > 0) {
          optionItemArr.value = arr.map(item => ({
            label: item.text,
            value: item.value,
          }))
        }
      })
      .finally(() => {
        loading.value = false
      })
  },
  { immediate: true }
)
watch(
  [modelValue, optionItemArr],
  ([newValue, newOptionItemArr]) => {
    if (isNotNullAndNotUndefined(newValue)) {
      if (newOptionItemArr && newOptionItemArr.length > 0) {
        const item = newOptionItemArr.find(one => one.value === newValue)
        if (item) {
          props.updateContent(item.label)
          return
        }
      }
      props.updateContent(`${newValue}`)
    } else {
      props.updateContent('')
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
