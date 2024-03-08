<template>
  <el-select
    v-if="renderDom"
    v-model="valComputed"
    :loading="loading"
    clearable
    style="width: 100%"
  >
    <el-option
      v-for="optionItem in optionItemArr"
      :key="`${optionItem.value}`"
      :label="optionItem.label"
      :value="optionItem.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { dicMockAPI } from '../../mock-api/ListApi'
import { OptionItem } from '@/components/lsy/dyn-form/typing'
import { computed } from 'vue'
import { isNotNullAndNotUndefined } from '@/utils/TypeUtils'

const props = withDefaults(
  defineProps<{
    dictType: string
    /**
     * v-model
     */
    value?: string | number

    updateShowText: (content: string) => void
    renderDom?: boolean
  }>(),
  { value: undefined }
)

const $emits = defineEmits<{
  'update:value': [string | number | undefined]
}>()

const { dictType, value } = toRefs(props)
const valComputed = computed({
  get() {
    return value.value
  },
  set(val?: string | number) {
    $emits('update:value', val)
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
  [value, optionItemArr],
  ([newValue, newOptionItemArr]) => {
    if (isNotNullAndNotUndefined(newValue)) {
      if (newOptionItemArr && newOptionItemArr.length > 0) {
        const item = newOptionItemArr.find(one => one.value === newValue)
        if (item) {
          props.updateShowText(item.label)
          return
        }
      }
      props.updateShowText(`${newValue}`)
    } else {
      props.updateShowText('')
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
