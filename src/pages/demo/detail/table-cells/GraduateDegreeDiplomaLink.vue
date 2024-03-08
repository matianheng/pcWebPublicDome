<template>
  <div>
    <el-link @click="onOpenPreviewDialog">
      {{ hasGraduateDegreeDiploma ? '查看' : '上传' }}
    </el-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toRefs } from 'vue'
import { GraduateDegreeDiploma } from '../../mock-api/ApiTyping'

/**
 * 学位证链接
 */
defineOptions({ name: 'GraduateDegreeDiplomaLink' })

const props = withDefaults(
  defineProps<{
    rowIndex: number
    /**
     * 学位证
     */
    graduateDegreeDiploma?: GraduateDegreeDiploma
    /**
     * 模式:
     * upload: 能上传
     * markError: 能标记有误
     * preview: 能预览
     */
    mode: 'upload' | 'markError' | 'preview'
  }>(),
  {
    graduateDegreeDiploma: undefined,
  }
)

const $emits = defineEmits<{
  'upload:graduateDegreeDiploma': [GraduateDegreeDiploma | undefined]
  openPreviewDialog: [
    rowIndex: number,
    mode: 'upload' | 'markError' | 'preview',
    graduateDegreeDiploma?: GraduateDegreeDiploma
  ]
}>()

const { graduateDegreeDiploma, rowIndex, mode } = toRefs(props)

const hasGraduateDegreeDiploma = computed(
  () =>
    graduateDegreeDiploma.value &&
    graduateDegreeDiploma.value.mainGraduateDegreeDiploma
)

function onOpenPreviewDialog() {
  $emits(
    'openPreviewDialog',
    rowIndex.value,
    mode.value,
    graduateDegreeDiploma.value
  )
}
</script>

<style scoped></style>
