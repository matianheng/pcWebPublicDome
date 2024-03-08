<template>
  <div class="flex flex-row justify-between">
    <div>
      <span v-if="required" class="text-red-400">*</span>{{ title
      }}<small class="text-red-400">{{ errorMsg }}</small>
    </div>
    <div>
      <el-button v-if="showEdit" size="small" type="primary" @click="onEdit">
        编辑
      </el-button>
      <el-button v-if="showSave" size="small" type="primary" @click="onSave">
        保存
      </el-button>
      <el-button v-if="showAdd" type="primary" size="small" @click="onAdd">
        新增
      </el-button>
      <el-button v-if="showCancel" size="small" @click="onCancel">
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'NewSectionTitle' })

defineProps<{
  title: string
  showEdit?: boolean
  showSave?: boolean
  showCancel?: boolean
  showAdd?: boolean
  /**
   * 是否必填
   */
  required?: boolean
  errorMsg?: string
}>()

const $emits = defineEmits<{
  edit: []
  save: []
  cancel: []
  add: []
}>()

function onEdit() {
  $emits('edit')
}
function onSave() {
  $emits('save')
}
function onCancel() {
  $emits('cancel')
}
function onAdd() {
  $emits('add')
}
</script>

<style scoped></style>
