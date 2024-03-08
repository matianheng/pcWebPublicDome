<template>
  <el-dialog
    v-model="modelValueComputed"
    title="学位证书"
    :width="340"
    class="o-graduate-degree-diploma-dialog"
  >
    <el-form ref="validateFormRef" :model="graduateDegreeDiploma">
      <el-carousel :autoplay="false" arrow="always" height="325px">
        <el-carousel-item
          v-if="graduateDegreeDiploma?.mainGraduateDegreeDiploma"
        >
          <el-form-item
            prop="graduateDegreeDiploma"
            :rules="mainGraduateDegreeDiplomaRule"
          >
            <MarkErrorPopover
              :disabled="mode !== 'markError'"
              :mark-error="
                getRowFieldErrorMsg(rowIndex, 'mainGraduateDegreeDiploma')
              "
              @on-clear-mark-error="
                callback =>
                  onClearMarkError('mainGraduateDegreeDiploma', callback)
              "
              @on-save-mark-error="
                (msg, callback) =>
                  onSaveMarkError('mainGraduateDegreeDiploma', msg, callback)
              "
            >
              <el-avatar
                shape="square"
                :size="300"
                fit="fill"
                :src="graduateDegreeDiploma.mainGraduateDegreeDiploma"
              />
            </MarkErrorPopover>
          </el-form-item>
        </el-carousel-item>
        <el-carousel-item
          v-if="
            graduateDegreeDiploma?.doubleDegree === 1 &&
            graduateDegreeDiploma?.secondGraduateDegreeDiploma
          "
        >
          <el-form-item
            prop="secondGraduateDegreeDiploma"
            :rules="secondGraduateDegreeDiplomaRule"
          >
            <MarkErrorPopover
              :disabled="mode !== 'markError'"
              :mark-error="
                getRowFieldErrorMsg(rowIndex, 'secondGraduateDegreeDiploma')
              "
              @on-clear-mark-error="
                callback =>
                  onClearMarkError('secondGraduateDegreeDiploma', callback)
              "
              @on-save-mark-error="
                (msg, callback) =>
                  onSaveMarkError('secondGraduateDegreeDiploma', msg, callback)
              "
            >
              <el-avatar
                shape="square"
                :size="300"
                fit="fill"
                :src="graduateDegreeDiploma.secondGraduateDegreeDiploma"
              />
            </MarkErrorPopover>
          </el-form-item>
        </el-carousel-item>
      </el-carousel>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, toRefs } from 'vue'
import { computed } from 'vue'
import { GraduateDegreeDiploma } from '../mock-api/ApiTyping'
import MarkErrorPopover from './MarkErrorPopover.vue'
import { FormInstance, FormItemRule } from 'element-plus'
import { watch, ref } from 'vue'
import { SaveMarkErrorCallback } from './typing'

defineOptions({ name: 'GraduateDegreeDiplomaDialog' })

const props = defineProps<{
  modelValue: boolean
  rowIndex: number
  graduateDegreeDiploma?: GraduateDegreeDiploma
  mode: 'upload' | 'markError' | 'preview'
  getRowFieldErrorMsg: (rowIndex: number, field: string) => string | undefined
  onValidateMarkError: (
    rowIndex: number,
    field: string,
    callback: (error?: string | Error) => void
  ) => void
}>()

const $emits = defineEmits<{
  'update:modelValue': [boolean]
  onClearMarkError: [
    rowIndex: number,
    field: string,
    callback: SaveMarkErrorCallback
  ]
  onSaveMarkError: [
    rowIndex: number,
    field: string,
    errorMsg: string,
    callback: SaveMarkErrorCallback
  ]
}>()

const { modelValue, rowIndex, graduateDegreeDiploma, mode } = toRefs(props)

const modelValueComputed = computed({
  get() {
    return modelValue.value
  },
  set(val: boolean) {
    $emits('update:modelValue', val)
  },
})

const mainGraduateDegreeDiplomaRule: FormItemRule = {
  validator: (_, v, callback) =>
    props.onValidateMarkError(
      rowIndex.value,
      'mainGraduateDegreeDiploma',
      callback
    ),
}
const secondGraduateDegreeDiplomaRule: FormItemRule = {
  validator: (_, v, callback) =>
    props.onValidateMarkError(
      rowIndex.value,
      'secondGraduateDegreeDiploma',
      callback
    ),
}

const validateFormRef = ref<FormInstance>()
watch(
  [modelValue, rowIndex, mode, graduateDegreeDiploma],
  ([newModelValue, newRowIndex, newMode]) => {
    if (
      null != newModelValue &&
      undefined != newModelValue &&
      // @ts-ignore
      newRowIndex >= 0
    ) {
      nextTick(() => {
        validateFormRef.value?.validate()
      })
    }
  }
)
function onClearMarkError(field: string, callback: SaveMarkErrorCallback) {
  $emits('onClearMarkError', rowIndex.value, field, callback)
}
function onSaveMarkError(
  field: string,
  errorMsg: string,
  callback: SaveMarkErrorCallback
) {
  $emits('onSaveMarkError', rowIndex.value, field, errorMsg, callback)
}
</script>

<style scoped lang="scss"></style>
