<template>
  <LsyContentContainer
    title="可编辑行表格"
    desc="基于JsonPageTable组件,实现可编辑行表格"
    :enable-back-top-comp="true"
    :enable-toc="true"
  >
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">行编辑/行数据验证(方案一)</h3>
          <small>EditableRowTableDemo01</small>
          <small class="block">
            优点: 因为表单的el-form-item只是进入编辑模式的那一行,
            因此直接对整个表单校验即可, 因此校验实现方式简单
          </small>
          <small class="block">
            短板: 在不可编辑状态, 无法通过el-form对行数据进行校验
          </small>
        </template>
        <EditableRowTableDemo01></EditableRowTableDemo01>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">行编辑/行数据验证(方案二)</h3>
          <small>EditableRowTableDemo02</small>
          <small class="block">
            优点: 因为整个表格的单元格都是el-form的el-form-item,
            因此即使在不可编辑模式，也可以对行数据，以及整个表格数据进行验证
          </small>
          <small class="block">
            短板: 要单独进行行数据验证比较复杂,
            因为要预留一部分空间用来显示错误提示信息，因此这类单元格内的元素实际位置要高于普通的分页表格的单元格内位置，需要手动修正
          </small>
        </template>
        <EditableRowTableDemo02></EditableRowTableDemo02>
      </el-card>
    </div>
    <div class="pb-3">
      <el-card shadow="never">
        <template #header>
          <h3 class="font-bold">行编辑(基于方案二)与标记有误</h3>
          <small>EditableRowTableDemo03</small>
        </template>
        <EditableRowTableDemo03></EditableRowTableDemo03>
      </el-card>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import EditableRowTableDemo01 from './editable-row-table-demo/EditableRowTableDemo01.vue'
import EditableRowTableDemo02 from './editable-row-table-demo/EditableRowTableDemo02.vue'
import EditableRowTableDemo03 from './editable-row-table-demo/EditableRowTableDemo03.vue'

defineOptions({ name: 'EditableRowTableExample' })
</script>

<style scoped></style>
