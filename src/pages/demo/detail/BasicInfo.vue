<template>
  <el-card v-loading="loading" class="mb-3">
    <template #header>
      <SectionTitle
        :title="`基本信息: ${status}`"
        :show-edit="showEditBtn"
        :show-save="showSaveBtn"
        :show-cancel="showCancelBtn"
        @edit="onEdit"
        @save="onSave"
        @cancel="onCancel"
      ></SectionTitle>
    </template>
    <div class="flex flex-col md:flex-row">
      <div
        class="md:flex-shrink-0 md:w-56 flex flex-row justify-center items-center"
      >
        <AvatarUpload
          v-model:image-url="pic"
          :disabled="disabledAvatarUpload"
        ></AvatarUpload>
      </div>
      <div class="flex flex-col md:flex-1 md:w-0 md:flex-row">
        <LsyDynForm
          ref="dynFormRef"
          v-model:form-data="dataComputed"
          class="dyn-el-form"
          :el-form-props="{ inline: true }"
          :form-item-arr="formItemArr"
          :form-item-comp-name-map="map"
        ></LsyDynForm>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import {
  LsyDynFormType,
  LsyFormItemConfig,
} from '@/components/lsy/dyn-form/typing'
import { ref } from 'vue'
import SectionTitle from './SectionTitle.vue'
import { computed } from 'vue'
import { loadVueCompFromModules } from '@/components/lsy/dyn-form/LsyDynFormUtil'
import { BasicInfoType } from '../mock-api/ApiTyping'
import AvatarUpload from './AvatarUpload.vue'
import { cloneDeep } from 'lodash-unified'
import { nextTick } from 'vue'
import { watch } from 'vue'

/**
 * 基本信息
 */
defineOptions({ name: 'BasicInfo' })

const modules = import.meta.glob('./form-items/*.vue', {
  eager: true,
})
const map = loadVueCompFromModules(modules)

const props = withDefaults(
  defineProps<{
    /**
     * 可用字段(可见或可编辑字段)
     */
    availableFieldArr?: string[]
    /**
     * 备份数据数据(用于取消操作，恢复数据)
     */
    backData?: BasicInfoType
    /**
     * 数据(v-model)
     */
    data?: BasicInfoType
    /**
     * 数据状态
     * wait-fit: 待填写
     * reject: 拒绝
     * wait-pass: 待审核
     * already-pass: 已通过
     * already-giveUp: 已放弃
     */
    status: string
    /**
     * 字段标记有误信息
     * key为字段名
     * value为错误提示信息
     */
    fieldMarkErrorMap?: Map<string, string>
    /**
     * 数据加载中或提交中
     */
    loading?: boolean
  }>(),
  {
    backData: undefined,
    data: undefined,
    availableFieldArr: () => [],
    fieldMarkErrorMap: () => new Map<string, string>(),
    loading: true,
  }
)

const $emits = defineEmits<{
  'update:data': [data?: BasicInfoType]
  saveMarkError: [
    prop: string,
    markError: string,
    callback: (ret: boolean) => void
  ]
  clearMarkError: [prop: string, callback: (ret: boolean) => void]
  save: [data: BasicInfoType, callback: (ret: boolean) => void]
}>()
const { status, availableFieldArr, data, fieldMarkErrorMap, backData } =
  toRefs(props)
const disabledAvatarUpload = computed(
  () => ['wait-fit', 'reject'].indexOf(status.value) < 0 || !editable.value
)

const dataComputed = computed({
  get() {
    return data.value
  },
  set(val?: BasicInfoType) {
    $emits('update:data', val)
  },
})

const pic = computed({
  get() {
    return dataComputed.value?.pic
  },
  set(val?: string) {
    if (dataComputed.value) {
      let tmp = cloneDeep(dataComputed.value)
      tmp.pic = val
      $emits('update:data', tmp)
    }
  },
})

const showEditBtn = ref<boolean>(false)
const showSaveBtn = ref<boolean>(false)
const showCancelBtn = ref<boolean>(false)
const dynFormRef = ref<LsyDynFormType>()
/**
 * 该字段用于保证初始化完成之后，仅执行一次标记有误验证
 */
let executeOnceMarkErrorValidate = false
watch(
  [dynFormRef, status, data, fieldMarkErrorMap],
  ([newDynFormRef, newStatus, newData, newFieldMarkErrorMap]) => {
    if (
      !executeOnceMarkErrorValidate &&
      newDynFormRef &&
      newStatus === 'reject' &&
      newData &&
      newFieldMarkErrorMap.size > 0
    ) {
      // 如果当前状态是已拒绝，尚未执行过初始的标记有误验证，且界面和数据都已经加载完毕，且存在标记有误数据，则执行一次标记有误验证
      nextTick(() => {
        // 必须在nextTick执行验证，否则data可能还没填充上去，验证已经执行了，那就可能会导致非空验证的错误提示信息出现在填了数据的表单项上
        newDynFormRef.elFormInstance?.validate()
      })
      executeOnceMarkErrorValidate = false
    }
  }
)
const editable = ref<boolean>(false)
const enableMarkError = ref<boolean>(false)
const markErrorEvent = {
  onSaveMarkError(
    prop: string,
    markError: string,
    callback: (ret: boolean) => void
  ) {
    $emits('saveMarkError', prop, markError, ret => {
      callback(ret)
      if (ret) {
        dynFormRef.value?.elFormInstance?.validateField(prop)
      }
    })
  },
  onClearMarkError(prop: string, callback: (ret: boolean) => void) {
    $emits('clearMarkError', prop, ret => {
      callback(ret)
      if (ret) {
        dynFormRef.value?.elFormInstance?.clearValidate(prop)
      }
    })
  },
}
function onValidateMarkError(
  field: string,
  callback: (error?: string | Error) => void
) {
  // 获取字段的标记有误信息
  const errorText = fieldMarkErrorMap.value.get(field)
  if (status.value === 'wait-pass') {
    errorText ? callback(errorText) : callback()
    return
  } else if (status.value === 'reject') {
    if (errorText && backData.value && data.value) {
      // 存在标记有误
      // @ts-ignore
      if (backData.value[field] === data.value[field]) {
        // 存在标记有误，且新旧数据一致，则认为验证失败
        callback(errorText)
        return
      }
    }
  }
  callback()
}
const nameProp = 'name'
const isChinaProp = 'isChina'
const relationProp = 'relation'
const birthdayProp = 'birthday'
const aProp = 'a'
const bProp = 'b'
const cProp = 'c'
const dProp = 'd'
const addrProp = 'addr'
const formItemArr = ref<LsyFormItemConfig[]>([
  {
    prop: nameProp,
    label: '姓名',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(nameProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(nameProp, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(nameProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: isChinaProp,
    label: '是否中国籍',
    name: 'EditableRadioMarkError',
    show: () => availableFieldArr.value.indexOf(isChinaProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(isChinaProp, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(isChinaProp),
      enableMarkError: enableMarkError.value,
      dictType: 'confirm',
    }),
    customCompEvents: {
      ...markErrorEvent,
      change(val: number) {
        if (val === 0) {
          dynFormRef.value?.elFormInstance?.validateField(aProp)
        }
      },
    },
  },
  {
    prop: relationProp,
    label: '党团关系',
    name: 'EditableSelectMarkError',
    show: (_, _fd?: BasicInfoType) => {
      if (_fd?.isChina) {
        return availableFieldArr.value.indexOf(relationProp) >= 0
      } else {
        if (_fd) {
          _fd.relation = undefined
        }
        return false
      }
    },
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(relationProp, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(relationProp),
      enableMarkError: enableMarkError.value,
      dictType: 'relation',
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: birthdayProp,
    label: '生日',
    name: 'EditableDateMarkError',
    show: () => availableFieldArr.value.indexOf(birthdayProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(birthdayProp, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(birthdayProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: aProp,
    label: '凑数字段a',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(aProp) >= 0,
    rules: (fi, fd: BasicInfoType) => [
      {
        validator: (_, v, callback) => onValidateMarkError(aProp, callback),
      },
      {
        required: fd.isChina === 1,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(aProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: bProp,
    label: '凑数字段b',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(bProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(bProp, callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(bProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: cProp,
    label: '凑数字段c',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(cProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(cProp, callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(cProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: dProp,
    label: '凑数字段d',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(dProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(dProp, callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(dProp),
      enableMarkError: enableMarkError.value,
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
  {
    prop: addrProp,
    label: '居住地址',
    name: 'EditableInputMarkError',
    show: () => availableFieldArr.value.indexOf(addrProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(addrProp, callback),
      },
    ],
    customCompProps: () => ({
      readonly: !editable.value,
      markError: fieldMarkErrorMap.value.get(addrProp),
      enableMarkError: enableMarkError.value,
      type: 'textarea',
      rows: 3,
      resize: 'none',
    }),
    customCompEvents: {
      ...markErrorEvent,
    },
  },
])

function onEdit() {
  showEditBtn.value = false
  showSaveBtn.value = true
  showCancelBtn.value = true

  editable.value = true
}
function onSave() {
  dynFormRef.value?.elFormInstance?.validate(ret => {
    console.log(ret)
    if (ret) {
      if (data.value) {
        $emits('save', data.value, result => {
          if (result) {
            showEditBtn.value = true
            showSaveBtn.value = false
            showCancelBtn.value = false

            editable.value = false
          }
        })
      }
    }
  })
}
function onCancel() {
  $emits('update:data', cloneDeep(backData.value))
  showEditBtn.value = true
  showSaveBtn.value = false
  showCancelBtn.value = false

  editable.value = false

  nextTick(() => {
    dynFormRef.value?.elFormInstance?.validate()
  })
}

function init() {
  showEditBtn.value = ['wait-fit', 'reject'].indexOf(status.value) >= 0
  enableMarkError.value = status.value === 'wait-pass'
}

init()

/**
 * 表单验证: 该方法仅供外部调用
 */
async function formValidate() {
  await dynFormRef.value?.elFormInstance?.validate()
}
defineExpose({
  formValidate,
})
</script>

<style scoped lang="scss">
.dyn-el-form {
  ::v-deep(.el-form-item) {
    width: 100%;
  }
}

@media screen and (width >= 768px) {
  .dyn-el-form {
    ::v-deep(.el-form-item) {
      margin: 0;
      padding: 10px;
      width: 50%;
    }

    ::v-deep(.dyn-form-item-addr) {
      width: 100%;
    }
  }
}

@media screen and (width >= 1024px) {
  .dyn-el-form {
    ::v-deep(.el-form-item) {
      margin: 0;
      padding: 10px;
      width: 33.333%;
    }

    ::v-deep(.dyn-form-item-addr) {
      width: 100%;
    }
  }
}
</style>
