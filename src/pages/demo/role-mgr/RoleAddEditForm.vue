<template>
  <div v-loading="loading" class="flex flex-col h-full">
    <div class="flex-1 h-0">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="角色说明" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-shrink-0 flex flex-row">
      <div class="ml-auto mb-2">
        <LsyLoadingButton
          type="primary"
          :loading="submitting"
          @click="onSaveOrUpdate"
        >
          保存
        </LsyLoadingButton>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AddRoleInfoType } from './RoleMgr.typing'
import { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'
import { watch, toRefs } from 'vue'
import {
  roleDetailMockAPI,
  addRoleMockAPI,
  updateRoleMockAPI,
  cancelRoleDetailAPI,
} from '../mock-api/ListApi'
import { useRequest } from 'vue-request'

const props = withDefaults(
  defineProps<{
    id?: number
  }>(),
  { id: undefined }
)

const $emits = defineEmits<{
  submitSuc: []
}>()

const { id } = toRefs(props)

const blank_rule_form: AddRoleInfoType = {
  name: '',
  desc: '',
}
const ruleForm = ref<AddRoleInfoType>({
  ...blank_rule_form,
})

const { run, loading } = useRequest(roleDetailMockAPI, {
  manual: true,
})
watch(
  id,
  val => {
    if (val !== undefined) {
      run(val).then(ret => {
        if (ret) {
          ruleForm.value = ret
        }
      })
    } else {
      cancelRoleDetailAPI()
      ruleForm.value = {
        ...blank_rule_form,
      }
    }
  },
  { immediate: true }
)
const rules = reactive<FormRules<AddRoleInfoType>>({
  name: [
    { required: true, message: '该项必填', trigger: 'blur' },
    { min: 1, max: 100, message: '角色名字数在1-100之间', trigger: 'blur' },
  ],
  desc: [{ max: 200, message: '最多200字符', trigger: 'blur' }],
})
const ruleFormRef = ref<FormInstance>()

async function doSaveOrUpdate(formData: AddRoleInfoType) {
  if (formData.id !== undefined) {
    await updateRoleMockAPI(formData)
  } else {
    await addRoleMockAPI(formData)
  }
}

const { run: submitForm, loading: submitting } = useRequest(doSaveOrUpdate, {
  manual: true,
})
function onSaveOrUpdate() {
  if (submitting.value) return

  ruleFormRef.value?.validate(async valid => {
    if (valid) {
      // 提交数据
      console.log('验证通过')
      await submitForm(ruleForm.value)
      $emits('submitSuc')
    }
  })
}
</script>

<style scoped lang="scss"></style>
