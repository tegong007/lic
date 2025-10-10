<template>
  <div class="bg h-100vh flex flex-col items-center text-[18px] text-white">
    <bigScreenHeader title="证本详情" />
    <div
      class="absolute top-70 box-border h-85vh w90% flex flex-col items-center gap-20 p-2em p-b-0"
    >
      <DocInfo />
      <div class="relative w-full">
        <docForm :set-search-form="setSearchForm" />
        <a-space :size="20" class="absolute right-10 top-[20px]">
          <a-button
            type="primary"
            class="btn flex items-center"
            @click="getDataPage"
          >
            <img
              src="@/assets/image/bigScreen/btn/huifu.svg"
              class="mr7 w12px"
            >
            刷新
          </a-button>
          <a-button
            type="primary"
            class="btn flex items-center"
            @click="rowAction('reset')"
          >
            <RollbackOutlined />
            恢复生产
          </a-button>
          <a-button
            type="primary"
            class="btn flex items-center"
            @click="rowAction('stop')"
          >
            <img
              src="@/assets/image/bigScreen/btn/guaqi.svg"
              class="m-r-7 w12px"
            >
            挂起
          </a-button>
        </a-space>
      </div>

      <main class="box-border h70% w-full">
        <MyTable
          ref="tableRef"
          :colums="colums"
          :checkbox="true"
          :data="tableData"
          :rowfun="rowAction"
          :update-old-checked-row="updateOldCheckedRow"
          key-field="recID"
          page-name="docList"
        />
      </main>
      <vxe-pager
        v-model:current-page="pageVO.currentPage"
        v-model:page-size="pageVO.pageSize"
        class="z-99 w-full"
        :total="pageVO.total"
        :layouts="[
          'Home',
          'PrevPage',
          'Jump',
          'PageCount',
          'NextPage',
          'End',
          'Sizes',
          'Total',
        ]"
        @page-change="pageChange"
      />
    </div>
    <!-- 下边按钮 -->
    <TheModal
      :open="open"
      :handle-ok="() => operate()"
      :warn-icon="true"
      :handle-cancel="() => setOpen(false)"
      :title="modal"
    />
    <div
      class="groupBtn absolute bottom-0 h8em w-full flex items-center justify-center gap-20"
    >
      <!-- <div class="flex">
          <TheButton title="批次查询" />
        </div> -->
      <!-- <span class="h-50% w-2px bg-[#8BB2FF]" /> -->
      <div class="flex gap-20">
        <TheButton title="返回首页" @click="$goto('BigScreen')" />
      </div>
    </div>
    <contextHolder />
  </div>
</template>

<script lang="ts" setup>
import { RollbackOutlined } from '@ant-design/icons-vue';
import { physicalModule } from '@/apis/proApi';
import TheButton from '@/components/base/TheButton.vue';
import { contextHolder, openNotify } from '@/components/base/useNotification';
import MyTable from '@/components/base/vxeTable.vue';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import TheModal from '@/components/modal/TheModal.vue';
// import { getWorkstationName } from '@/utils/workstationDefinitions';
import { findLabelByValue } from '@/pages/bigScreen/batch/option.ts';
import { useAppStore } from '@/store/index';
import docForm from './doc-form.vue';
import DocInfo from './docInfo.vue';

const pageVO = reactive({
  total: 20,
  currentPage: 1,
  pageSize: 20,
});
const checkedRow = ref();
const oldCheckedRow = ref([]);
const tableRef = ref(null);
const searchForm = ref({});
const open = ref<boolean>(false);
const modal = ref('');
const isReset = ref(0);
const tableData = ref([]);
const imgShow = {
  name: 'VxeImage',
  props: {
    width: 80,
    height: 80,
    maskClosable: true,
  },
};
const colums = ref([
  {
    title: '序号',
    field: 'seq',
    fixed: 'left',
    width: 80,
    overflow: 'title',
  },

  {
    title: '批次号',
    field: 'batchID',
    type: 'html',
    width: 120,
    overflow: 'ellipsis',
  },
  {
    title: '团组号',
    field: 'groupID',
    width: 120,
    overflow: 'title',
  },
  {
    title: '证本号',
    field: 'docID',
    width: 120,
    overflow: 'title',
  },
  {
    title: '识别号',
    field: 'recID',
    width: 120,
    overflow: 'title',
  },
  {
    title: '派遣单位',
    field: 'dispatchUnit',
    formatter: formatterValue,
    width: 130,
    overflow: 'title',
  },
  {
    title: '数据来源',
    field: 'dataSource',
    formatter: formatterValue,
    width: 130,
    overflow: 'title',
  },

  {
    title: '加急程度',
    field: 'urgentType',
    formatter: formatterValue,
    width: 100,
    overflow: 'title',
  },

  {
    title: '当前工位',
    field: 'position',
    // formatter: formatterValue,
    width: 150,
    overflow: 'title',
  },
  {
    title: '状态',
    field: 'docStatus',
    formatter: formatterValue,
    width: 100,
    overflow: 'title',
  },
  {
    title: '证本类型',
    field: 'type',
    formatter: formatterValue,
    width: 120,
    overflow: 'title',
  },
  {
    title: '姓(中)',
    field: 'cnSurname',
    width: 70,
    overflow: 'title',
  },
  {
    title: '名(中)',
    field: 'cnGivenName',
    width: 70,
    overflow: 'title',
  },
  {
    title: '人像',
    field: 'photo',
    width: 100,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '加注类型',
    field: 'cnObsvType',
    formatter: formatterValue,
    width: 150,
    overflow: 'title',
  },
  {
    title: '机读码1',
    field: 'mrz1',
    width: 200,
    overflow: 'title',
  },
  {
    title: '机读码2',
    field: 'mrz2',
    width: 200,
    overflow: 'title',
  },
  {
    title: '空白本照片',
    field: 'blankDocPic',
    width: 120,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '激光前定位照片',
    field: 'laserPicLocation',
    width: 140,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '激光后质检照片',
    field: 'laserPicCheck',
    width: 140,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '喷墨前定位照片(主)',
    field: 'mainUVPicLocation',
    width: 160,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '喷墨后质检照片(主)',
    field: 'mainUVPicCheck',
    width: 160,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '喷墨前定位照片(加)',
    field: 'additionUVPicLocation',
    width: 160,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '喷墨前定位照片(加)',
    field: 'additionUVPicCheck',
    width: 160,
    overflow: 'title',
    imgUrlCellRender: imgShow,
  },
  {
    title: '废本原因',
    field: 'obsoleteReason',
    width: 120,
    overflow: 'title',
  },
  {
    title: '开始时间',
    field: 'startTime',
    width: 200,
    overflow: 'title',
  },
  {
    title: '结束时间',
    field: 'endTime',
    width: 200,
    overflow: 'title',
  },
]);
function formatterValue({ cellValue, column }: any) {
  switch (column.field) {
    // case 'position':
    //   return getWorkstationName(cellValue);
    case 'type':
      return findLabelByValue('docTypesOptions', cellValue);
    case 'docStatus':
      return findLabelByValue('docStatusOptions', cellValue);
    case 'cnObsvType':
      return findLabelByValue('cnObsvTypeOptions', Number(cellValue));
    case 'dispatchUnit':
      return findLabelByValue('dispatchUnitOptions', cellValue);
    case 'isTeam':
      return findLabelByValue('teamOptions', cellValue);
    case 'dataSource':
      return findLabelByValue('dataSourceOptions', cellValue);
    case 'urgentType':
      return findLabelByValue('urgencyOptions', cellValue);
    default:
      break;
  }
}

function setSearchForm(formValue: object) {
  searchForm.value = formValue;
  pageVO.currentPage = 1;
  // 清空筛选
  oldCheckedRow.value = [];
  checkedRow.value = [];
  getDataPage();
}
async function operate() {
  try {
    const oldCheckrecID = oldCheckedRow.value.map(item => item.recID);
    const allCheckRox = [...new Set([...checkedRow.value, ...oldCheckrecID])];
    await physicalModule.getDocOperate({
      recID: allCheckRox,
      operate: isReset.value,
    });
    openNotify(
      'bottomRight',
      `${isReset.value ? '恢复生产' : '挂起'}操作成功`,
      true,
    );
    getDataPage();
  }
  catch (error) {
    error;
    openNotify('bottomRight', `${isReset.value ? '恢复生产' : '挂起'}操作失败`);
  }
  finally {
    setOpen(false);
  }
}

// 取消的时候删掉这一行
function updateOldCheckedRow(delectArr) {
  let toDeleteIDs;
  // 提取要删除的 batchID 列表
  if (Array.isArray(delectArr)) {
    toDeleteIDs = delectArr.map(item => item.batchID);
  }
  else {
    toDeleteIDs = [delectArr.batchID];
    console.log('🚀 ~ updateOldCheckedRow ~ toDeleteIDs:', toDeleteIDs);
  }

  // 使用 filter 方法过滤掉需要删除的元素
  oldCheckedRow.value = oldCheckedRow.value.filter(
    item => !toDeleteIDs.includes(item.batchID),
  );
  console.log('🚀 ~ updateOldCheckedRow ~ delectArr:', oldCheckedRow.value);
}

function rowAction(type: string, batchID: string) {
  modal.value = type;
  const newCheckRow = !batchID ? tableRef.value.getSelectEvent() : [batchID];
  if (tableRef.value && newCheckRow) {
    checkedRow.value = !batchID
      ? newCheckRow.map(item => item.batchID)
      : newCheckRow;
  }
  nextTick(() => {
    if (checkedRow.value.length === 0 && oldCheckedRow.value.length === 0) {
      openNotify('bottomRight', `您还没有选中数据`);
    }
    if (checkedRow.value.length || oldCheckedRow.value.length) {
      const oldCheckBatchID = oldCheckedRow.value.map(item => item.batchID);
      const allCheckRox = [
        ...new Set([...checkedRow.value, ...oldCheckBatchID]),
      ];
      modal.value = `可能含有不能${type === 'stop' ? '挂起' : '恢复生产'}的数据，是否继续${type === 'stop' ? '挂起' : '恢复生产'}${
        allCheckRox.length
      }条数据?`;
      isReset.value = type === 'stop' ? 0 : 1;
      open.value = true;
    }
  });
}
// function formatterStatus({ cellValue }: any) {
//   const item = TaskStatusOptions.find((item) => item.value === cellValue);
//   return item ? item.label : cellValue;
// }
// 分页
function pageChange({ pageSize, currentPage }) {
  oldCheckedRow.value = [
    ...oldCheckedRow.value,
    ...tableRef.value.getSelectEvent(),
  ];

  pageVO.currentPage = currentPage;
  pageVO.pageSize = pageSize;
  getDataPage();
  // 选回上一页的数据
  tableRef.value.setSelectRow(oldCheckedRow.value, true);
}

function setOpen(value: boolean) {
  open.value = value;
}

onActivated(() => {
  getDataPage();
});
onDeactivated(() => {
  // 清空筛选
  oldCheckedRow.value = [];
  checkedRow.value = [];
  tableData.value = [];
  // stop();
});

async function getDataPage() {
  try {
    useAppStore().setSpinning(true);
    const params = {
      ...searchForm.value,
      page: pageVO.currentPage,
      rowPerPage: pageVO.pageSize,
    };
    const data = await physicalModule.getDocDetailGeneral(params);
    if (data.respData) {
      tableData.value = data.respData.docInfo;
      pageVO.currentPage = data.respData.page;
      pageVO.total = data.respData.totalRows;
      pageVO.pageSize = data.respData.rowPerPage;
    }
    // startGetDataPage();
  }
  catch (error) {
    error;
    openNotify('bottomRight', `接口超时`);
    // stop();
  }
  finally {
    useAppStore().setSpinning(false);
  }
}
// async function startGetDataPage() {
//   start(async () => {
//     await getDataPage();
//   }, 1);
// }
</script>

<style scoped lang="less">
.bg {
  background-image: url('@/assets/image/bigScreen/bg-none.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';

  //分页
  ::v-deep(.vxe-pager) {
    background-color: unset;
    color: #fff;
    .vxe-pager--jump-next,
    .vxe-pager--jump-prev,
    .vxe-pager--next-btn,
    .vxe-pager--num-btn,
    .vxe-pager--prev-btn {
      background-color: unset;
    }
  }
}
</style>
