<template>
  <LsyContentContainer :fit-all-content="true">
    <el-card shadow="never">
      <el-table
        :data="tableData"
        :border="false"
        :span-method="arraySpanMethod"
        :default-expand-all="true"
        class="customOutterTable"
        row-class-name="relative"
      >
        <!-- 展开列 -->
        <el-table-column label="序号" width="65" type="expand">
          <template #default="props">
            <el-table
              :data="props.row.family"
              class="customInnerTable"
              :border="false"
            >
              <el-table-column type="index" width="60" />
              <el-table-column prop="name">
                <template #default="scope">
                  <div class="flex flex-col">
                    <div>
                      <el-image
                        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                        fit="fill"
                      />
                    </div>
                    <div>{{ scope.row.state }}</div>
                    <div>{{ scope.row.zip }}</div>
                    <div>{{ scope.row.address }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="state" />
              <el-table-column prop="zip" />
              <el-table-column>
                <template #default>
                  <div class="flex flex-col">
                    <el-link type="primary">操作A</el-link>
                    <el-link type="danger">操作B</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 以下是非展开列 -->
        <el-table-column label="订单号" prop="name">
          <template #default="scope">
            <!-- 这里的left-[-65px]是与序号列的width值一致 -->
            <div
              class="flex flex-row absolute left-[-65px] bg-gray-300 right-0"
            >
              <div>名称: {{ scope.row.name }}</div>
              <div>state: {{ scope.row.state }}</div>
              <div>城市: {{ scope.row.city }}</div>
              <div>地址: {{ scope.row.address }}</div>
              <div>邮件: {{ scope.row.zip }}</div>
            </div>
            <div>&nbsp;</div>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="state" />
        <el-table-column label="单价" prop="zip" />
        <el-table-column label="操作" />
      </el-table>
    </el-card>
  </LsyContentContainer>
</template>

<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'

interface SpanMethodProps {
  row: Record<string, unknown>
  column: TableColumnCtx<Record<string, unknown>>
  rowIndex: number
  columnIndex: number
}
const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex !== 0) {
    // 控制非第一列
    if (columnIndex === 1) {
      // 第二列占满除第一列之外的所有列
      return [1, 4]
    } else {
      // 其他列不占空间
      return [0, 0]
    }
  }
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114',
    family: [
      {
        name: 'Jerry',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Spike',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
      {
        name: 'Tyke',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.customInnerTable {
  ::v-deep(.el-table__cell) {
    border-right: var(--el-table-border);
  }

  ::v-deep(.el-table__header-wrapper) {
    display: none;
  }
}

.customOutterTable {
  // 隐藏最外层第一列的展开/收缩按钮
  ::v-deep(.el-table__row .el-table__expand-icon) {
    display: none;
  }
}
</style>
