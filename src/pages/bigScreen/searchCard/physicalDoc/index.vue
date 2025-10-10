<template>
  <div
    class="absolute top-70 box-border h-85vh w90% flex flex-col items-center gap-20 p-2em p-b-0"
  >
    <!-- <DocInfo /> -->
    <div class="relative w-full">
      <docForm ref="searchRef" :set-search-form="setSearchForm" />
      <a-space :size="20" class="absolute bottom-[20px] right-10">
        <a-button
          type="primary"
          class="btn flex items-center"
          @click="getDataPage"
        >
          <img src="@/assets/image/bigScreen/btn/huifu.svg" class="mr7 w12px">
          刷新
        </a-button>
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <!-- <a-menu-item :key="0"> 挂起 </a-menu-item> -->
              <!-- <a-menu-item :key="1"> 恢复生产 </a-menu-item> -->
              <a-menu-item :key="2">
                设为成功
              </a-menu-item>
              <a-menu-item :key="3">
                设为失败
              </a-menu-item>
            </a-menu>
          </template>
          <a-button class="btn flex items-center">
            批量操作
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-space>
    </div>

    <main class="box-border h80% w-full">
      <DocCard
        :items="tableData"
        :check-row="checkRow"
        :old-checked-row="oldCheckedRow"
        :set-check-row="setCheckRow"
        :rowfun="rowAction"
        :set-detai="setDetai"
        :change-task-id-or-batch-id="props.changeTaskIdOrBatchId"
      />
      <vxe-pager
        v-model:current-page="pageVO.currentPage"
        v-model:page-size="pageVO.pageSize"
        class="z-99 w-full flex items-center justify-center"
        :total="pageVO.total"
        :layouts="['Home', 'PrevPage', 'Number', 'NextPage', 'End']"
        @page-change="pageChange"
      >
        <template #right>
          <div class="relative top-1">
            <span>共{{ Math.ceil(pageVO.total / pageVO.pageSize) }}页，{{
              pageVO.total
            }}条记录
            </span>
          </div>
        </template>
      </vxe-pager>
    </main>
  </div>
  <!-- 下边按钮 -->
  <TheModal
    :open="open"
    :handle-ok="() => operate()"
    :warn-icon="true"
    :handle-cancel="() => setOpen(false)"
    :title="modal"
  />
  <DetailModal
    :open="detailOpen"
    :current-row="currentRow"
    :handle-ok="() => setDetailOpen(false)"
    :handle-cancel="() => setDetailOpen(false)"
    title="详情"
  />

  <contextHolder />
</template>

<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { physicalModule } from '@/apis/proApi';
import { contextHolder, openNotify } from '@/components/base/useNotification';
import TheModal from '@/components/modal/TheModal.vue';
import { useAppStore } from '@/store/index';
import DocCard from './card.vue';
import DetailModal from './detailModal.vue';
import docForm from './doc-form.vue';

const props = defineProps({
  choose: Number,
  changeTaskIdOrBatchId: Function,
  docBatchId: String || Object,
  docTaskId: String || Object,
});
const pageVO = reactive({
  total: 20,
  currentPage: 1,
  pageSize: 5,
});
const checkRow = ref();
const oldCheckedRow = ref([]);
// const tableRef = ref(null);
const searchRef = ref(null);
const searchForm = ref({});
const open = ref<boolean>(false);
const detailOpen = ref<boolean>(false);
const modal = ref('');
const isReset = ref(0);
const tableData = ref([]);
const title: {
  [key: string]: string;
} = {
  0: '挂起',
  1: '恢复生产',
  2: '设为成功',
  3: '设为失败',
};
const handleMenuClick: MenuProps['onClick'] = (e) => {
  console.log('click', e.key);
  rowAction(e.key);
};

function setSearchForm(formValue: object) {
  searchForm.value = formValue;
  pageVO.currentPage = 1;
  // 清空筛选
  oldCheckedRow.value = [];
  checkRow.value = [];
  getDataPage();
}
function setCheckRow(arr: Array<any>) {
  checkRow.value = arr;
}
async function operate() {
  try {
    const oldCheckTaskID = checkRow.value.map(item => item.physicalID);
    await physicalModule.getDocOperate({
      physicalID: oldCheckTaskID,
      operate: isReset.value,
    });
    openNotify('bottomRight', `${title[isReset.value]}操作成功`, true);
    getDataPage();
    oldCheckedRow.value = [];
    checkRow.value = [];
  }
  catch (error) {
    error;
    openNotify('bottomRight', `${title[isReset.value]}操作失败`);
  }
  finally {
    setOpen(false);
  }
}

function rowAction(type: number, physicalID?: string) {
  modal.value = title[type];
  checkRow.value = !physicalID ? checkRow.value : [{ physicalID }];
  nextTick(() => {
    if (checkRow.value.length === 0 && oldCheckedRow.value.length === 0) {
      openNotify('bottomRight', `您还没有选中数据`);
    }

    if (checkRow.value.length || oldCheckedRow.value.length) {
      modal.value = `可能含有不能${title[type]}的数据，是否继续${title[type]}${
        checkRow.value.length
      }条数据?`;
      isReset.value = type;
      open.value = true;
    }
  });
}
// 分页
function pageChange() {
  oldCheckedRow.value.push(...checkRow.value); // 将 checkRow 的内容追加到 oldCheckedRow
  oldCheckedRow.value = [
    ...new Map(
      oldCheckedRow.value.map(item => [item.physicalID, item]),
    ).values(),
  ];
  getDataPage();
}

function setOpen(value: boolean) {
  open.value = value;
}

function setDetailOpen(value: boolean) {
  detailOpen.value = value;
}
const currentRow = ref({});
// 查看详情
function setDetai(row: any) {
  detailOpen.value = true;
  currentRow.value = row;
}

onActivated(() => {
  getDataPage();
});
onDeactivated(() => {
  // 清空筛选
  oldCheckedRow.value = [];
  checkRow.value = [];
  tableData.value = [];
  pageVO.currentPage = 1;
  pageVO.pageSize = 20;
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
  }
  catch (error) {
    openNotify('bottomRight', error);
  }
  finally {
    useAppStore().setSpinning(false);
  }
}

watch(
  () => props.choose,
  (newValue) => {
    if (newValue === 3) {
      nextTick(() => {
        if (searchRef.value) {
          searchRef.value.setBatchIDandGroupId(
            typeof props.docTaskId === 'string' ? props.docTaskId : '',
            typeof props.docBatchId === 'string' ? props.docBatchId : '',
          );
        }
      });
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="less">
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
  .is--active {
    box-shadow: 0 0 0.25em 0 #7ff3fd !important;
  }
}
</style>
