<template>
  <LsyContentContainer content-dom-cls="flex flex-col">
    <div class="pb-3">
      <NewBasicInfo
        ref="newBasicInfoRef"
        v-loading="personInfoLoading || savingBasicInfo"
      ></NewBasicInfo>
    </div>
    <div>
      <NewEduInfo
        v-if="stepRenderFlagArr[0]"
        ref="newEduInfoRef"
        v-loading="personInfoLoading"
      ></NewEduInfo>
    </div>
    <div class="pb-3">
      <el-card body-class="flex flex-row justify-center">
        <el-button
          v-if="showSubmitBtn"
          size="large"
          type="primary"
          :loading="submitting"
          @click="onSubmit"
        >
          提交
        </el-button>
        <template v-if="showApprovalBtn">
          <el-button
            size="large"
            type="primary"
            :loading="passing"
            @click="onPass"
          >
            通过
          </el-button>
          <el-button
            size="large"
            type="warning"
            :loading="rejecting"
            @click="onReject"
          >
            驳回
          </el-button>
        </template>
        <el-button size="large" @click="onClose">关闭</el-button>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import NewBasicInfo from './NewBasicInfo.vue'
import NewEduInfo from './NewEduInfo.vue'
import { useNewDetailStore } from './store/NewDetailStore'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { emitCloseCurAndToRoute } from '@/components/lsy/router-tabs/LsyRouterTabsKeepAliveWrapperEventUtil'
import { approval } from '../mock-api/ListApi'
import { useStepRenderHooks } from '@/utils/VueComponentRenderUtil'
import { onMounted } from 'vue'
import { useBasicInfoStore } from './store/NewBasicInfoStore'

const newDetailStore = useNewDetailStore()
const basicInfoStore = useBasicInfoStore()
const { getPersonInfo } = newDetailStore

const { status, personInfoLoading } = storeToRefs(newDetailStore)
const { savingBasicInfo } = storeToRefs(basicInfoStore)
const showSubmitBtn = computed(
  () => status.value === 'reject' || status.value === 'wait-fit'
)
const showApprovalBtn = computed(() => status.value === 'wait-pass')

interface ElFormWrapper {
  /**
   * 表单验证
   */
  formValidate: () => Promise<void>
  /**
   * 清除表单验证信息(清除错误提示信息)
   */
  formClearValidate: () => void
}
const newBasicInfoRef = ref<ElFormWrapper>()
const newEduInfoRef = ref<ElFormWrapper>()
const $route = useRoute()
async function formValidate() {
  // -important- 因为验证失败会抛出异常, 这里又必须保证两个验证方法都能被执行, 因此需要使用Promise.allSettled等待两个promise方法都有返回结果
  const retArr = await Promise.allSettled([
    newBasicInfoRef.value?.formValidate(),
    newEduInfoRef.value?.formValidate(),
  ])
  // 获取验证失败的结果
  const rejectedArr = retArr.filter(item => item.status === 'rejected')
  if (rejectedArr.length === 0) {
    return Promise.resolve()
  } else {
    return Promise.reject(rejectedArr)
  }
}
watch(
  $route,
  newRoute => {
    const account = newRoute.params.account as string
    if (account) {
      getPersonInfo(account).then(() => {
        console.log('status.value', status.value)
        nextTick(() => {
          if (
            status.value &&
            ['wait-pass', 'reject'].indexOf(status.value) >= 0
          ) {
            // 待审核和已拒绝必然有标记有误数据,因此需要在加载完数据之后,就执行一次表单验证,使错误提示信息可见
            formValidate()
          } else {
            // 由于可能是先访问了待审核或已驳回数据, 再通过修改url,访问已通过或已放弃数据,因此需要清除可能的标记有误数据(表单错误提示信息)
            newBasicInfoRef.value?.formClearValidate()
            newEduInfoRef.value?.formClearValidate()
          }
        })
      })
    }
  },
  { immediate: true }
)
function onClose() {
  emitCloseCurAndToRoute({ name: 'TabSearch' })
}
const submitting = ref<boolean>(false)
function onSubmit() {
  submitting.value = true
  formValidate()
    .then(async () => {
      await emitCloseCurAndToRoute({ name: 'TabSearch' })
      submitting.value = false
    })
    .catch(error => {
      console.log('error', error)
      submitting.value = false
    })
}
const passing = ref<boolean>(false)
function onPass() {
  formValidate()
    .then(async () => {
      passing.value = true
      try {
        await approval('pass')
        emitCloseCurAndToRoute({ name: 'TabSearch' })
      } finally {
        passing.value = false
      }
    })
    .catch(error => {
      console.log('error', error)
    })
}
const rejecting = ref<boolean>(false)
async function onReject() {
  rejecting.value = true
  try {
    await approval('reject')
    emitCloseCurAndToRoute({ name: 'TabSearch' })
  } finally {
    rejecting.value = false
  }
}
const { stepRender, stepRenderFlagArr } = useStepRenderHooks(1)
onMounted(() => {
  stepRender()
})
</script>

<style scoped lang="scss"></style>
