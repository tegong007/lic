<template>
  <div class="bg h-100vh flex flex-col items-center text-[18px] text-white">
    <bigScreenHeader title="批次列表" />
    <div
      class="absolute top-70 box-border h-85vh w90% flex flex-col items-center gap-20 p-2em p-b-0"
    >
      <BatchInfo />
      <div class="relative w-full">
        <TeamForm :set-search-form="setSearchForm" />
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
          key-field="batchID"
          page-name="BatchList"
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
import { useRoute } from 'vue-router';
import { batchModule } from '@/apis/proApi';
import TheButton from '@/components/base/TheButton.vue';
import { contextHolder, openNotify } from '@/components/base/useNotification';
import MyTable from '@/components/base/vxeTable.vue';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import TheModal from '@/components/modal/TheModal.vue';
import { TaskStatusOptions } from '@/pages/bigScreen/batch/option.ts';
import { useAppStore } from '@/store/index';
import BatchInfo from './batchInfo.vue';
import TeamForm from './team-form.vue';

const route = useRoute();
// const { start, stop } = useCustomTimer();
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
const batchID = ref<string>('');

const colums = ref([
  {
    title: '序号',
    field: 'seq',
    fixed: 'left',
  },
  {
    title: '批次号',
    field: 'batchID',
    width: 150,
  },
  {
    title: '证本数',
    field: 'docNum',
  },
  {
    title: '良本数',
    field: 'productNum',
  },
  {
    title: '废本数',
    field: 'obsoleteNum',
  },
  {
    title: '待生产数',
    field: 'waitingNum',
  },
  {
    title: '挂起数',
    field: 'hangUpNum',
  },
  {
    title: '状态',
    field: 'status',
    formatter: formatterStatus,
    width: 150,
    // isTip: true,
  },
  {
    title: '接收时间',
    field: 'receiveTime',
    width: 200,
  },
  {
    title: '开始生产时间',
    field: 'startTime',
    width: 200,
  },
  {
    title: '完成时间',
    field: 'finishTime',
    width: 200,
  },
]);
const isSearching = ref(false);
function setSearchForm(formValue: object) {
  searchForm.value = formValue;
  pageVO.currentPage = 1;
  // 清空筛选
  oldCheckedRow.value = [];
  checkedRow.value = [];
  isSearching.value = true;
  getDataPage();
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
function formatterStatus({ cellValue }: any) {
  const item = TaskStatusOptions.find(item => item.value === cellValue);
  return item ? item.label : cellValue;
}
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

async function operate() {
  try {
    const oldCheckBatchID = oldCheckedRow.value.map(item => item.batchID);
    const allCheckRox = [...new Set([...checkedRow.value, ...oldCheckBatchID])];
    await batchModule.getBatchOperate({
      batchID: allCheckRox,
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

onActivated(() => {
  nextTick(() => {
    const query = route.query;
    batchID.value = query.batchID;
    getDataPage();
  });
});
onDeactivated(() => {
  // 清空筛选
  oldCheckedRow.value = [];
  checkedRow.value = [];
  tableData.value = [];
  isSearching.value = false;

  // stop();
});

async function getDataPage() {
  try {
    useAppStore().setSpinning(true);
    const { batchID: _, ...restSearchForm } = searchForm.value; // 移除 searchForm.value 中的 batchID 属性
    const params = {
      batchID: isSearching.value
        ? searchForm.value.batchID
        : batchID.value || searchForm.value.batchID,
      ...restSearchForm,
      // ...searchForm.value,
      page: pageVO.currentPage,
      rowPerPage: pageVO.pageSize,
    };
    // console.log('🚀 ~ getDataPage ~ params:', params);
    const data = await batchModule.getBatchPage(params);
    if (data.respData) {
      tableData.value = data.respData.batchInfo;
      pageVO.currentPage = data.respData.page;
      pageVO.total = data.respData.totalRows;
      pageVO.pageSize = data.respData.rowPerPage;
    }
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
