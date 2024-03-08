<template>
  <el-card>
    <template #header>
      <NewSectionTitle
        title="基本信息"
        :show-cancel="showCancel"
        :show-edit="showEdit"
        :show-save="showSave"
        @edit="onEdit"
        @save="onSave"
        @cancel="onCancel"
      ></NewSectionTitle>
    </template>
    <div class="flex flex-col md:flex-row">
      <!-- 头像表单 -->
      <BasicDynForm
        ref="avatarFormRef"
        class="flex-shrink-0 md:w-56 flex flex-row justify-center items-center"
        :form-item-comp-name-map="formItemCompNameMap"
        :form-data="basicInfo"
        :field-mark-error-map="basicSectionFieldMarkErrorMap"
        section="basic"
        :form-item-arr="avatarFormItems"
      ></BasicDynForm>
      <div
        ref="otherBasicInfoWrapperRef"
        class="flex flex-col md:flex-1 md:w-0 md:flex-row o-basic-form-wrapper"
      >
        <!-- 头像外的其他基本信息表单 -->
        <BasicDynForm
          ref="dynFormRef"
          :el-form-props="{ inline: true, 'label-width': 'auto' }"
          :form-item-comp-name-map="formItemCompNameMap"
          :form-data="basicInfo"
          :field-mark-error-map="basicSectionFieldMarkErrorMap"
          section="basic"
          :form-item-arr="formItemArr"
        ></BasicDynForm>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { loadVueCompFromModules } from '@/components/lsy/dyn-form/LsyDynFormUtil'
import BasicDynForm from './BasicDynForm.vue'
import { LsyDynFormType, LsyFormItemConfig } from './typing'
import { ref } from 'vue'
import { BasicInfoType } from '../mock-api/ApiTyping'
import NewSectionTitle from './NewSectionTitle.vue'
import { useBasicInfoStore } from './store/NewBasicInfoStore'
import { ElMessage, FormValidationResult } from 'element-plus'
import { onMounted } from 'vue'
import { onBeforeMount } from 'vue'

const modules = import.meta.glob('./form-items/*.vue', {
  eager: true,
})
const formItemCompNameMap = loadVueCompFromModules(modules)

const dynFormRef = ref<LsyDynFormType>()
const avatarFormRef = ref<LsyDynFormType>()
const otherBasicInfoWrapperRef = ref<HTMLDivElement>()

const resizeObserver = new ResizeObserver(resizeObserverCallback)
function onMountedCallback() {
  const otherBasicInfoWrapper = otherBasicInfoWrapperRef.value
  if (!otherBasicInfoWrapper) return

  resizeObserver.observe(otherBasicInfoWrapper)
}

const formItemWidth = ref<string>('33.3333%')
function resizeObserverCallback() {
  const otherBasicInfoWrapper = otherBasicInfoWrapperRef.value
  if (!otherBasicInfoWrapper) return

  const offsetWidth = otherBasicInfoWrapper.offsetWidth
  if (offsetWidth >= 650) {
    formItemWidth.value = '33.3333%'
  } else {
    formItemWidth.value = '50%'
  }
}
function onBeforeMountCallback() {
  const otherBasicInfoWrapper = otherBasicInfoWrapperRef.value
  if (otherBasicInfoWrapper) {
    resizeObserver.unobserve(otherBasicInfoWrapper)
  }
  resizeObserver.disconnect()
}
onMounted(onMountedCallback)
onBeforeMount(onBeforeMountCallback)

const basicInfoStore = useBasicInfoStore()
const {
  saveBasicInfo,
  cancelBasicInfo,
  changeEditStatusAndSectionTitleBtnShowStatus,
} = basicInfoStore
const {
  status,
  basicInfo,
  basicSectionFieldMarkErrorMap,
  backBasicInfo,

  showCancel,
  showEdit,
  showSave,
  editAble,
} = storeToRefs(basicInfoStore)

function onEdit() {
  changeEditStatusAndSectionTitleBtnShowStatus(true)
}
function validateIsEdit() {
  if (editAble.value) {
    const msg = '基本信息-请先取消编辑或保存编辑结果'
    ElMessage.info(msg)
    return Promise.reject(msg)
  }
  return Promise.resolve()
}
/**
 * 执行表单验证
 *
 * P.S. 当验证不通过时, 会抛出异常, 调用时, 结合具体场景，看是否需要捕获异常做特殊处理.
 */
async function formValidate(validateEditStatus = true) {
  // Promise.allSettled 确保能拿到两个表单的执行结果
  if (validateEditStatus) {
    const retArr = await Promise.allSettled([
      avatarFormRef.value?.elFormInstance?.validate(),
      dynFormRef.value?.elFormInstance?.validate(),
      validateIsEdit(),
    ])
    const rejectedArr = retArr.filter(item => item.status === 'rejected')
    if (rejectedArr.length > 0) {
      throw rejectedArr
    }
  } else {
    const retArr = await Promise.allSettled([
      avatarFormRef.value?.elFormInstance?.validate(),
      dynFormRef.value?.elFormInstance?.validate(),
    ])
    const rejectedArr = retArr.filter(item => item.status === 'rejected')
    if (rejectedArr.length > 0) {
      throw rejectedArr
    }
  }
}
/**
 * 清除表单验证
 */
function formClearValidate() {
  avatarFormRef.value?.elFormInstance?.clearValidate()
  dynFormRef.value?.elFormInstance?.clearValidate()
}
async function onSave() {
  // 对两个表单同时执行验证
  try {
    await formValidate(false)
    await saveBasicInfo(basicInfo.value)
    changeEditStatusAndSectionTitleBtnShowStatus(false)
  } catch (error) {
    console.warn('表单验证失败', error)
  }
}
async function onCancel() {
  cancelBasicInfo()
  changeEditStatusAndSectionTitleBtnShowStatus(false)
  if (status.value === 'wait-fit') {
    formClearValidate()
  } else {
    formValidate(false)
  }
}

function editModelFactory() {
  if (status.value) {
    if (status.value === 'already-giveUp') {
      return 'readonly'
    } else if (status.value === 'already-pass') {
      return 'readonly'
    } else if (status.value === 'reject') {
      return editAble.value ? 'writable' : 'readonly'
    } else if (status.value === 'wait-pass') {
      return editAble.value ? 'writable' : 'markError'
    } else if (status.value === 'wait-fit') {
      return editAble.value ? 'writable' : 'readonly'
    }
  }
  return 'readonly'
}
/**
 * 自定义表单验证规则:标记有误验证规则.
 *
 * 当存在标记有误数据，且新值与旧值一致, 则验证失败, 否则验证通过
 */
function onValidateMarkError(
  field: string,
  val: any,
  callback: (error?: string | Error) => void
) {
  // 获取字段的标记有误信息
  const errorText = basicSectionFieldMarkErrorMap.value.get(field)
  if (status.value === 'reject' || status.value === 'wait-pass') {
    if (errorText && backBasicInfo.value) {
      // 存在标记有误
      // @ts-ignore
      if (backBasicInfo.value[field] === val) {
        // 存在标记有误，且新旧数据一致，则认为验证失败
        callback(errorText.msg)
        return
      }
    }
  }
  callback()
}

const picProp = 'pic'
const avatarFormItems = ref<LsyFormItemConfig[]>([
  {
    prop: picProp,
    name: 'DynFormItemAvatarUpload',
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(picProp, v, callback),
      },
    ],
    editMode: () => editModelFactory(),
    inputIsAvatar: true,
  },
])
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
    name: 'DynFormItemInput',
    // show: () => availableFieldArr.value.indexOf(nameProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(nameProp, v, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({}),
    editMode: () => {
      const ret = editModelFactory()
      return ret
    },
  },
  {
    prop: isChinaProp,
    label: '是否中国籍',
    name: 'DynFormItemRadio',
    // show: () => availableFieldArr.value.indexOf(nameProp) >= 0,
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(isChinaProp, v, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      dictType: 'confirm',
    }),
    customCompEvents: {
      change(val: number) {
        if (val === 0) {
          dynFormRef.value?.elFormInstance?.validateField(aProp)
        }
      },
    },
    editMode: () => editModelFactory(),
  },
  {
    prop: relationProp,
    label: '党团关系',
    name: 'DynFormItemSelect',
    show: (_, _fd?: BasicInfoType) => {
      if (_fd?.isChina) {
        return true
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
          onValidateMarkError(relationProp, v, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    customCompProps: () => ({
      dictType: 'relation',
    }),
    editMode: () => editModelFactory(),
  },
  {
    prop: birthdayProp,
    label: '生日',
    name: 'DynFormItemDate',
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(birthdayProp, v, callback),
      },
      {
        required: true,
        message: '该项必填',
      },
    ],
    editMode: () => editModelFactory(),
  },
  {
    prop: aProp,
    label: '凑数字段a',
    name: 'DynFormItemInput',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(aProp, v, callback),
      },
    ],
    editMode: () => editModelFactory(),
  },
  {
    prop: bProp,
    label: '凑数字段b',
    name: 'DynFormItemInput',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(bProp, v, callback),
      },
    ],
    editMode: () => editModelFactory(),
  },
  {
    prop: cProp,
    label: '凑数字段c',
    name: 'DynFormItemInput',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(cProp, v, callback),
      },
    ],
    editMode: () => editModelFactory(),
  },
  {
    prop: dProp,
    label: '凑数字段d',
    name: 'DynFormItemInput',
    rules: [
      {
        validator: (_, v, callback) => onValidateMarkError(dProp, v, callback),
      },
    ],
    editMode: () => editModelFactory(),
  },
  {
    prop: addrProp,
    label: '居住地址',
    name: 'DynFormItemInput',
    rules: [
      {
        validator: (_, v, callback) =>
          onValidateMarkError(addrProp, v, callback),
      },
    ],
    customCompProps: () => ({
      type: 'textarea',
      rows: 3,
      resize: 'none',
    }),
    inputIsTextArea: true,
    editMode: () => editModelFactory(),
  },
])

defineExpose({
  formValidate,
  formClearValidate,
})
</script>

<style scoped lang="scss">
.o-basic-form-wrapper {
  ::v-deep(.el-form-item) {
    width: 100%;
  }

  ::v-deep(.dyn-form-item-addr) {
    width: 100%;
  }
}

@media screen and (width >= 768px) {
  .o-basic-form-wrapper {
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
  .o-basic-form-wrapper {
    ::v-deep(.el-form-item) {
      margin: 0;
      padding: 10px;
      width: v-bind(formItemWidth);
    }

    ::v-deep(.dyn-form-item-addr) {
      width: 100%;
    }
  }
}
</style>
