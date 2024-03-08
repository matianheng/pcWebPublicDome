<template>
  <div class="flex flex-row justify-between">
    <div>{{ title }}</div>
    <div class="">
      <el-button v-if="showEdit" size="small" type="primary" @click="onEdit">
        编辑
      </el-button>
      <el-button v-if="showSave" size="small" type="primary" @click="onSave">
        保存
      </el-button>
      <el-button v-if="showCancel" size="small" @click="onCancel">
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SectionTitle' })

defineProps<{
  title: string
  showEdit?: boolean
  showSave?: boolean
  showCancel?: boolean
}>()

const $emits = defineEmits<{
  edit: []
  save: []
  cancel: []
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
</script>

<style scoped></style>
