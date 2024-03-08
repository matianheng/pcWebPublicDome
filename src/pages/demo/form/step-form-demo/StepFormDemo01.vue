<template>
  <div class="flex flex-col">
    <div>
      <el-steps :active="active" align-center>
        <el-step title="第一步" description="第一步的描述" />
        <el-step title="第二步" description="第二步的描述" />
        <el-step title="第三步" description="第三步的描述" />
      </el-steps>
    </div>
    <div>
      <!-- 要获取 component is 方式的动态 ref 必须使用函数形式，并且当组件切换时，会执行两次 ref 函数，第一次为null，第二次才是切换后组件的ref -->
      <component
        :is="curStepFormComp"
        :ref="setStepFormRef"
        :step-form-data="stepFormData"
      ></component>
    </div>
    <div class="flex flex-row justify-center mt-2">
      <el-button type="primary" :disabled="disabledPrevBtn" @click="onPrev">
        上一步
      </el-button>
      <el-button v-if="!hideNextBtn" type="primary" @click="onNext">
        下一步
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StepForm01 from './StepForm01.vue'
import StepForm02 from './StepForm02.vue'
import StepForm03 from './StepForm03.vue'
import { VueComp } from '@/components/lsy/dyn-form/typing'
import {
  StepForm01DataType,
  StepForm02DataType,
  StepFormComp,
  StepFormDataType,
} from './typing'
import { nextTick } from 'vue'

defineOptions({ name: 'StepFormDemo01' })

const stepFormCompMap = new Map<number, VueComp>()
stepFormCompMap.set(1, StepForm01)
stepFormCompMap.set(2, StepForm02)
stepFormCompMap.set(3, StepForm03)
const active = ref<number>(1)

const stepFormRef = ref<StepFormComp>()
function setStepFormRef(el: StepFormComp) {
  stepFormRef.value = el
}
const curStepFormComp = computed(() => stepFormCompMap.get(active.value))
const disabledPrevBtn = computed(() => active.value === 1)
const hideNextBtn = computed(() => active.value === 3)

const stepFormData = ref<StepFormDataType>({
  step01Data: undefined,
  step02Data: undefined,
})
function onNext() {
  const stepFormComp = stepFormRef.value
  if (!stepFormComp) return

  console.log(active.value)
  stepFormComp.elFormRef.validate((ret: boolean) => {
    if (ret) {
      const tmpFormData = stepFormComp.formData
      const tmpActive = active.value
      active.value = tmpActive + 1
      nextTick(() => {
        if (tmpActive === 1) {
          stepFormData.value.step01Data = tmpFormData as StepForm01DataType
        } else if (tmpActive === 2) {
          stepFormData.value.step02Data = tmpFormData as StepForm02DataType
        }
      })
    }
  })
}
function onPrev() {
  active.value -= 1
}
</script>

<style scoped></style>
