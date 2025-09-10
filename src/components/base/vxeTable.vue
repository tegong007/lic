<template>
  <div class="wh-full">
    <div class="h-100% w-full">
      <vxe-table
        ref="tableRef"
        class="mytable-style"
        :keep-source="true"
        height="auto"
        auto-resize
        reserve
        border
        :edit-config="editConfig"
        :row-class-name="rowClassName"
        :header-cell-class-name="headerCellClassName"
        :cell-class-name="cellClassName"
        :column-config="{ resizable: true }"
        :row-config="{ keyField: props.keyField, isHover: true }"
        :data="props.data"
        @checkbox-change="selectChangeEvent"
        @checkbox-all="selectAllChangeEvent"
      >
        <!-- 复选框 -->
        <vxe-column
          v-if="props.checkbox"
          type="checkbox"
          width="43"
          fixed="left"
        />
        <!-- 序号 -->
        <vxe-column
          v-if="props.seq"
          type="seq"
          width="60"
          align="center"
          fixed="left"
        />
        <vxe-column
          v-for="(item, index) in props.colums"
          :key="index"
          :field="item.field"
          :fixed="item.fixed"
          :title="item.title"
          :cell-render="item.imgUrlCellRender"
          :formatter="item.formatter"
          :width="item.width"
          show-header-overflow
          show-overflow="title"
          show-footer-overflow
          align="center"
        >
          <template
            v-if="
              item.field === 'taskID'
                && props.pageName === 'docList'
                && item.type === 'html'
            "
            #default="{ row }"
          >
            <a
              class="color-[#89F7FF]"
              @click="props.changeTaskIdOrBatchId(1, row.taskID)"
            >{{ row.taskID }}</a>
          </template>
        </vxe-column>
        <!-- 如果当前列的 field 是 batchID，则使用自定义模板 -->
        <!-- <template v-slot="{ row }" v-if="item.field === 'batchID'">
            <a class="my-link" @click="handleClick(row.batchID)">{{
              row.batchID
            }}</a>
          </template>
        </vxe-column> -->
        <!-- 可编辑 :edit-render="{
            name: item.options ? 'select' : 'input',
            options: item.options,
          }" -->

        <!-- 操作 -->
        <vxe-column
          v-if="props.pageName === 'AddTask'"
          field="action"
          title="操作"
          width="140"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex justify-around">
              <a class="color-[#89F7FF]" @click="showRow(row, 'edit')">编辑</a>
              <a class="color-red" @click="removeRow(row)">删除</a>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          v-if="props.pageName === 'TaskList'"
          field="action"
          title="操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-start gap-10">
              <!-- <a
                class="color-[#89F7FF]"
                @click="$goto('BatchDetail', { BatchId: row.batchID })"
                >详情</a
              > -->
              <a
                class="color-[#89F7FF]"
                @click="props.changeTaskIdOrBatchId(3, row.taskID)"
              >查看证本列表</a>
              <a
                v-if="row.status === 2 || row.status === 0"
                class="color-[#89F7FF]"
                @click="props.rowfun('stop', row.taskID)"
              >挂起</a>
              <a
                v-if="row.status === 3"
                class="color-[#89F7FF]"
                @click="props.rowfun('reset', row.taskID)"
              >重新生产</a>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          v-if="props.pageName === 'docList'"
          field="action"
          title="操作"
          width="240"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-start gap-10">
              <a class="color-[#89F7FF]" @click="props.setDetai(row)">查看更多</a>
              <a
                v-if="row.docStatus === 1 || row.docStatus === 0"
                class="color-[#89F7FF]"
                @click="props.rowfun(0, row.docSN)"
              >挂起</a>
              <a
                v-if="row.docStatus === 2"
                class="color-[#89F7FF]"
                @click="props.rowfun(1, row.docSN)"
              >重新生产</a>
              <a
                v-if="row.docStatus === 0 || row.docStatus === 4"
                class="color-[#89F7FF]"
                @click="props.rowfun(2, row.docSN)"
              >设为成功</a>
              <a
                v-if="row.docStatus === 0 || row.docStatus === 3"
                class="color-[#89F7FF]"
                @click="props.rowfun(3, row.docSN)"
              >设为失败</a>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          v-if="props.pageName === 'physicalList'"
          field="action"
          title="操作"
          width="240"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-start gap-10">
              <a class="color-[#89F7FF]" @click="props.setDetai(row)">查看更多</a>
              <a
                v-if="row.docStatus === 0 || row.docStatus === 4"
                class="color-[#89F7FF]"
                @click="props.rowfun(2, row.physicalID)"
              >设为成功</a>
              <a
                v-if="row.docStatus === 0 || row.docStatus === 3"
                class="color-[#89F7FF]"
                @click="props.rowfun(3, row.physicalID)"
              >设为失败</a>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VxeTablePropTypes } from 'vxe-table';
import { defineExpose, defineProps } from 'vue';

const props = defineProps({
  colums: Array, // 表头
  data: Array, // 数据
  keyField: String, // 主键
  checkbox: Boolean, // 复选框
  seq: Boolean, // 序号
  pageName: String, // 行删除
  isEdit: Boolean, // 是否可以编辑
  showRow: Function,
  rowfun: Function,
  setIsAddNoTeam: Function,
  updateOldCheckedRow: Function,
  changeTaskIdOrBatchId: Function,
  setDetai: Function,
});

const tableRef = ref();
const oldRow = ref(); // 点击的行
const firstRow = ref(); // 第一行
function activeCellMethod({ row, column, columnIndex }) {
  console.log(row, column);
  if (row.isNoTeam) {
    if (columnIndex === 4) {
      return true;
    }
    return false;
  }
  return true;
}
// 编辑
const editConfig = reactive({
  trigger: 'click',
  mode: 'cell',
  // showStatus: true,
  enabled: props.isEdit,
  beforeEditMethod: activeCellMethod,
});
// 勾选点击
function selectChangeEvent({ checked, row }) {
  const $table = tableRef.value;
  if ($table) {
    if (!checked) {
      console.log('🚀 ~ selectChangeEvent ~ row:', row);
      props.updateOldCheckedRow(row);
    }
    const records = $table.getCheckboxRecords();
    console.log(checked ? '勾选事件' : '取消事件', records);
  }
}

function selectAllChangeEvent({ checked }) {
  const $table = tableRef.value;
  if ($table) {
    const records = $table.getCheckboxRecords();
    if (!checked) {
      // 删掉当页所有元素
      props.updateOldCheckedRow(props.data);
    }
    console.log(checked ? '所有勾选事件' : '所有取消事件', records);
  }
}

// 在前面添加
async function addEvent(record: object) {
  const $table = tableRef.value;
  if ($table) {
    const { row: newRow } = await $table.insert(record);
    $table.setEditRow(newRow);
    firstRow.value = newRow;
  }
}
// 在后面添加
async function pushEvent(record: object) {
  const $table = tableRef.value;
  if ($table) {
    const { row: newRow } = await $table.insertAt(record, -1);
    $table.setEditRow(newRow);
  }
}
// 删除单行
async function removeRow(row: any) {
  const $table = tableRef.value;
  if ($table) {
    $table.remove(row);
  }
}

// 回显
async function showRow(row: any) {
  // 传递
  await props.showRow(row);
  oldRow.value = row;
  // row.name = `Name_${new Date().getTime()}`
}
// 根据点击数据修改行
function updateRow(newRow: object) {
  oldRow.value.num = newRow.num;
  oldRow.value.urgentType = newRow.urgentType;
}
function updateFirstRow(num: number) {
  firstRow.value.num = num;
}

// 获取表格数据
function exportEvent() {
  const $table = tableRef.value;
  if ($table) {
    const insertRecords = $table.getInsertRecords();
    return insertRecords;
  }
}
// const sortConfig = ref<VxeTablePropTypes.SortConfig<RowVO>>({
//    multiple: true,
// });
const headerCellClassName: VxeTablePropTypes.HeaderCellClassName<any> = ({
  column,
}: any) => {
  column; // if (column.field === 'name') {
  return 'col-blue'; // }
  // return null;
};

const rowClassName: VxeTablePropTypes.RowClassName<any> = ({
  rowIndex,
}: any) => {
  rowIndex; // if ([0].includes(rowIndex)) {
  //    return 'row-style-first';
  // } else {
  return 'row-style'; // }
  // return null;
};
const cellClassName: VxeTablePropTypes.CellClassName<any> = ({
  row,
  $rowIndex,
  column,
}: any) => {
  row + $rowIndex + column; // console.log('🚀 ~ file: table.vue:67 ~ $rowIndex:', $rowIndex);
  // if ($rowIndex === pageVO.pageSize - 1) return 'row-last-cell-style';
  // else
  return 'cell-style';
};

// const loading = ref(false);
// const tableData = ref<RowVO[]>();
function setSelectRow(rows, checked) {
  const $table = tableRef.value;
  if ($table) {
    $table.setCheckboxRow(rows, checked);
  }
}
function getSelectEvent() {
  const $table = tableRef.value;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    return selectRecords;
    // fun(selectRecords); // VxeUI.modal.alert(`${selectRecords.length}条数据`);
  }
}

defineExpose({
  pushEvent,
  exportEvent,
  addEvent,
  updateRow,
  getSelectEvent,
  updateFirstRow,
  removeRow,
  setSelectRow,
});
</script>

<style scoped lang="scss">
::v-deep(.mytable-style) {
  // max-width: 400px;
  font-size: 16px;
  box-sizing: border-box;
  //   font-family: siyuan;
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 11px;
    height: 11px;
    // border-left: 3px solid #7ff3fd;
  }
  ::-webkit-scrollbar-thumb {
    // background-color: #ffffff38;
    background-color: #ffffff69;
    border-radius: 2px;
  }
  ::-webkit-scrollbar-track {
    // background-image: linear-gradient(
    //   to bottom,
    //   rgba(0, 140, 255, 0.329) 0%,
    //   rgba(255, 255, 255, 0.205) 100%
    // );
  }
  thead {
    background: transparent;
  }
}

/* 表格样式 */
::v-deep(.vxe-table--render-wrapper) {
  background-color: transparent;
}
::v-deep(.vxe-table--render-default .vxe-table--body-wrapper) {
  //   background-color: rgba(255, 255, 255, 0.12);
  background-color: rgba(255, 255, 255, 0);
  //   font-family: siyuan;
}

/* 行样式 */
::v-deep(.mytable-style.vxe-table .vxe-body--row.row-style-first),
::v-deep(.mytable-style.vxe-table .vxe-body--row.row-style) {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}

/* 表头样式 */
::v-deep(.vxe-table--render-default.border--full .vxe-table--header-wrapper) {
  background-color: transparent;
}
::v-deep(.vxe-cell--title) {
  font-weight: 400;
}
::v-deep(.mytable-style.vxe-table .vxe-header--column.col-blue) {
  //   background: linear-gradient(
  //     246deg,
  //     rgba(144, 236, 255, 0.65) 3%,
  //     rgba(0, 106, 245, 0.06) 50%
  //   );
  background: rgba(255, 255, 255, 0.2);
  border-right: 3px solid #7ff3fd;
  color: #fff;
}

/* 单元格样式 */
::v-deep(.mytable-style.vxe-table .vxe-body--column.cell-style) {
  border: 3px solid #7ff3fd;
  border-top: none;
  border-left: none;
  color: #fff;
  box-sizing: border-box;
  background: #ffffff17;
}

/* 固定列样式 */
::v-deep(.mytable-style .vxe-table--fixed-right-wrapper td),
::v-deep(.mytable-style .vxe-table--fixed-right-wrapper th),
::v-deep(.mytable-style .vxe-table--fixed-left-wrapper td),
::v-deep(.mytable-style .vxe-table--fixed-left-wrapper th) {
  background-color: #4d7ca4 !important;
}
::v-deep(.mytable-style .vxe-table--fixed-right-wrapper td) {
  border-right: none !important;
}

/* 边框样式 */
::v-deep(.vxe-table--render-default.border--full .vxe-body--column) {
  background-image: none;
}
::v-deep(.vxe-table .vxe-cell--sort) {
  position: absolute;
  right: 10px;
}

/* 固定列背景样式 */
::v-deep(.vxe-table--render-default .vxe-table--fixed-right-wrapper),
::v-deep(.vxe-table--render-default .vxe-table--fixed-left-wrapper) {
  background-color: unset;
}
//最后一个小方块
::v-deep(.mytable-style [class~='col--last'][class~='col--fixed']) {
  border-right: 0 !important;
  background: #ffffff;
}
::v-deep(.mytable-style .col--gutter) {
  background: rgba(255, 255, 255, 0.2);
}
</style>
