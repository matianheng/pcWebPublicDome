<template>
  <!-- 详情 -->
  <LsyContentContainer content-dom-cls="flex flex-col">
    <template
      v-for="(sectionStructInfo, idx) in sectionStructInfoArr"
      :key="`${sectionStructInfo.flag}-${idx}`"
    >
      <!-- 基本信息 -->
      <BasicInfo
        v-if="canIUseSection('basic', sectionStructInfo)"
        ref="basicInfoRef"
        v-model:data="personInfo.basic"
        :back-data="backPersonInfo.basic"
        :status="account"
        :available-field-arr="sectionStructInfo.availableFieldArr"
        :field-mark-error-map="basicSectionFieldMarkErrorMap"
        :loading="basicSectionLoading"
        @save-mark-error="onSaveMarkError"
        @clear-mark-error="onClearMarkError"
        @save="onSave"
      ></BasicInfo>
      <!-- 教育信息 -->
      <EduInfo
        v-else-if="canIUseSection('edu', sectionStructInfo)"
        ref="eduInfoRef"
        v-model:tableArr="backPersonInfo.eduInfoArr"
        :back-data="backPersonInfo.eduInfoArr"
        :status="account"
        :rows-field-mark-error-map="eduSectionFieldMarkErrorMap"
      ></EduInfo>
      <!-- 其他信息 -->
      <OtherInfo
        v-else-if="canIUseSection('other', sectionStructInfo)"
        ref="otherInfoRef"
      ></OtherInfo>
    </template>

    <BottomButtonGroup
      v-if="account !== 'already-giveUp'"
      :status="account"
      @submit="onSubmit"
      @pass="onPass"
      @reject="onReject"
    ></BottomButtonGroup>
    {{ personInfo.eduInfoArr }}
  </LsyContentContainer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import BasicInfo from './BasicInfo.vue'
import EduInfo from './EduInfo.vue'
import OtherInfo from './OtherInfo.vue'
import { computed, ref } from 'vue'
import { SectionStructInfo, BasicInfoInstance } from './typing'
import BottomButtonGroup from './BottomButtonGroup.vue'
import { emitCloseCurAndToRoute } from '@/components/lsy/router-tabs/LsyRouterTabsKeepAliveWrapperEventUtil'
import {
  BasicInfoType,
  PersonInfo,
  MarkErrorInfoType,
} from '../mock-api/ApiTyping'
import {
  loadPersonInfo,
  saveBasic,
  saveMarkError,
  cancelMarkError,
  loadMarkError,
} from '../mock-api/ListApi'
import { cloneDeep } from 'lodash-unified'
/**
 * 详情页
 */
defineOptions({ name: 'DetailExample' })

const $route = useRoute()
const account = computed<string>(
  () => ($route.params.account as string) ?? 'wait-fit'
)
// 因为这个组件ref定义在了v-for中，所以，最终会收集为一个数组。详见：https://cn.vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for
const basicInfoRef = ref<BasicInfoInstance[]>([])
let backPersonInfo = ref<PersonInfo>({
  status: undefined,
  basic: {},
  eduInfoArr: [],
  other: {
    physicalExaminationReport: [],
  },
})
const personInfo = ref<PersonInfo>(cloneDeep(backPersonInfo.value))

function canIUseSection(
  sectionFlag: string,
  sectionStructInfo: SectionStructInfo
) {
  return sectionFlag === sectionStructInfo.flag && sectionStructInfo.show
}
/**
 * 基本信息的标记有误数据
 */
const basicSectionFieldMarkErrorMap = ref<Map<string, string>>(new Map())
const eduSectionFieldMarkErrorMap = ref<Map<number, Map<string, string>>>(
  new Map()
)
const basicSectionLoading = ref<boolean>(true)
const sectionStructInfoArr = computed<SectionStructInfo[]>(() => [
  {
    desc: '基本信息',
    flag: 'basic',
    show: true,
    availableFieldArr: [
      'name',
      'isChina',
      'relation',
      'birthday',
      'a',
      'b',
      'c',
      'd',
      'addr',
    ],
  },
  {
    desc: '教育信息',
    flag: 'edu',
    show: true,
    availableFieldArr: [],
  },
  {
    desc: '其他信息',
    flag: 'other',
    show: true,
    availableFieldArr: [],
  },
])

function onSubmit() {
  emitCloseCurAndToRoute({ name: 'TabSearch' })
}
async function onPass() {
  const refComp = basicInfoRef.value ? basicInfoRef.value[0] : undefined
  if (refComp) {
    await refComp.formValidate()
  }
  emitCloseCurAndToRoute({ name: 'TabSearch' })
}
function onReject() {
  emitCloseCurAndToRoute({ name: 'TabSearch' })
}
async function onSaveMarkError(
  prop: string,
  markError: string,
  callback: (ret: boolean) => void
) {
  console.log('onSaveMarkError', prop, markError)
  // await saveMarkError('basic', account.value, 0, prop, markError)
  basicSectionFieldMarkErrorMap.value.set(prop, markError)
  callback(true)
}
async function onClearMarkError(
  prop: string,
  callback: (ret: boolean) => void
) {
  // await cancelMarkError('basic', account.value, 0, prop)
  basicSectionFieldMarkErrorMap.value.delete(prop)
  callback(true)
}
async function onSave(basic: BasicInfoType, callback: (ret: boolean) => void) {
  try {
    basicSectionLoading.value = true
    await saveBasic(basic)
    backPersonInfo.value = cloneDeep(personInfo.value)
    callback(true)
  } finally {
    basicSectionLoading.value = false
  }
}
async function init(account: string) {
  try {
    basicSectionLoading.value = true
    await initData(account)
  } finally {
    basicSectionLoading.value = false
  }
}

init(account.value)

async function initData(account: string) {
  const _personInfo = await loadPersonInfo(account)
  const { status, basic, eduInfoArr, other } = _personInfo
  personInfo.value.basic = basic ?? {}
  personInfo.value.eduInfoArr = eduInfoArr ?? []
  personInfo.value.other = other ?? { physicalExaminationReport: [] }
  personInfo.value.status = status
  backPersonInfo.value = cloneDeep(personInfo.value)
  if (status === 'wait-fit') {
    // 待填写
  } else if (status === 'reject') {
    // 已驳回
    // 加载标记有误数据，让用户(员工)知道哪些地方要改
    await loadAndFitMarkErrorData(account)
  } else if (status === 'wait-pass') {
    // 待审核数据
    // 加载标记有误数据，让用户(HR)知道哪些地方要取消标记有误
    await loadAndFitMarkErrorData(account)
  } else if (status === 'already-pass') {
    // 已审核数据
  } else if (status === 'already-giveUp') {
    // 已放弃
  }
}
async function loadAndFitMarkErrorData(account: string) {
  const markErrorArr = await loadMarkError(account)
  basicSectionFieldMarkErrorMap.value = extractBasicMarkError(markErrorArr)
  eduSectionFieldMarkErrorMap.value = extractEduMarkError(markErrorArr)
  console.log(
    'eduSectionFieldMarkErrorMap.value',
    eduSectionFieldMarkErrorMap.value
  )
}
function extractEduMarkError(markErrorArr: MarkErrorInfoType[]) {
  return markErrorArr
    .filter(item => item.section === 'edu')
    .reduce((prev, cur) => {
      let map = prev.get(cur.row)
      if (!map) {
        map = new Map<string, string>()
        prev.set(cur.row, map)
      }
      map.set(cur.field, cur.msg)
      return prev
    }, new Map<number, Map<string, string>>())
}
function extractBasicMarkError(markErrorArr: MarkErrorInfoType[]) {
  return markErrorArr
    .filter(item => item.section === 'basic')
    .reduce((prev, cur) => {
      prev.set(cur.field, cur.msg)
      return prev
    }, new Map<string, string>())
}
</script>

<style scoped></style>
