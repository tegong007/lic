<template>
  <div
    class="absolute top-30 box-border h-76vh w90% flex flex-col items-center gap-20 p-2em p-b-0"
  >
    <div class="relative w-full flex">
      <TeamForm ref="searchRef" :set-search-form="setSearchForm" />
      <a-space :size="20" class="absolute bottom-[20px] right-10">
        <a-button
          type="primary"
          class="btn flex items-center"
          @click="getDataPage"
        >
          <img src="@/assets/image/bigScreen/btn/huifu.svg" class="mr7 w12px">
          刷新
        </a-button>
        <!-- <a-button
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
        </a-button> -->
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item :key="0">
                挂起
              </a-menu-item>
              <a-menu-item :key="1">
                恢复生产
              </a-menu-item>
              <!-- <a-menu-item :key="2"> 设为成功 </a-menu-item>
              <a-menu-item :key="3"> 设为失败 </a-menu-item> -->
            </a-menu>
          </template>
          <a-button class="btn flex items-center">
            批量操作
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-space>
    </div>

    <main class="box-border h90% w-full">
      <TaskCard
        :items="tableData"
        :check-row="checkRow"
        :old-checked-row="oldCheckedRow"
        :set-check-row="setCheckRow"
        :rowfun="rowAction"
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
            <!-- <span
            >跳到
            <a-input
              class="w-50 m-l-3"
              size="small"
              :maxlength="2"
              v-model:value="pageVO.currentPage"
              @input="validateInput"
              @click="onInputFocus($event, 'num')"
            ></a-input>
            页，
          </span> -->
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

  <contextHolder />
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { defineProps, reactive } from 'vue';
import { TaskModule } from '@/apis/proApi';
import { contextHolder, openNotify } from '@/components/base/useNotification';
import TheModal from '@/components/modal/TheModal.vue';
import { useAppStore } from '@/store/index';
import TaskCard from './card.vue';
import TeamForm from './task-form.vue';

const props = defineProps({
  choose: Number,
  docBatchId: String,
  docTaskId: String,
  changeTaskIdOrBatchId: Function,
});
const title: {
  [key: string]: string;
} = {
  0: '挂起',
  1: '恢复生产',
  2: '设为成功',
  3: '设为失败',
};
const handleMenuClick: MenuProps['onClick'] = (e) => {
  rowAction(e.key);
};

const pageVO = reactive({
  total: 20,
  currentPage: 1,
  pageSize: 5,
});
const checkRow = ref([]); // 选中的数据
const oldCheckedRow = ref([]); // 选中的数据
// const tableRef = ref(null);
const searchRef = ref(null);
const searchForm = ref({});
const open = ref<boolean>(false);
const modal = ref('');
const isReset = ref(0);
const tableData = ref([]);
const isSearching = ref(false);
function setSearchForm(formValue: object) {
  searchForm.value = formValue;
  pageVO.currentPage = 1;
  getDataPage();
}
function rowAction(type: number, taskID?: string) {
  console.log('🚀 ~ rowAction ~ type:', type);
  modal.value = title[type];
  checkRow.value = !taskID ? checkRow.value : [{ taskID }];
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
    ...new Map(oldCheckedRow.value.map(item => [item.taskID, item])).values(),
  ];
  getDataPage();
}

function setOpen(value: boolean) {
  open.value = value;
}

async function operate() {
  try {
    useAppStore().setSpinning(true);
    const oldCheckTaskID = checkRow.value.map(item => item.taskID);
    await TaskModule.getTaskOperate({
      taskID: oldCheckTaskID,
      operate: isReset.value,
    });
    openNotify(
      'bottomRight',
      `${isReset.value ? '恢复生产' : '挂起'}操作成功`,
      true,
    );
    getDataPage();
    oldCheckedRow.value = [];
    checkRow.value = [];
  }
  catch (error) {
    error;
    openNotify('bottomRight', `${isReset.value ? '恢复生产' : '挂起'}操作失败`);
  }
  finally {
    setOpen(false);
    useAppStore().setSpinning(false);
  }
}

onDeactivated(() => {
  // 清空筛选
  oldCheckedRow.value = [];
  checkRow.value = [];
  tableData.value = [];
  isSearching.value = false;
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
    const data = await TaskModule.getTaskPage(params);
    if (data.respData) {
      tableData.value = data.respData.taskInfo;
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

function setCheckRow(arr: Array<any>) {
  checkRow.value = arr;
}
watch(
  () => props.choose,
  (newValue) => {
    if (newValue === 1) {
      nextTick(() => {
        if (searchRef.value) {
          searchRef.value.setTaskID(
            typeof props.docTaskId === 'string' ? props.docTaskId : '',
          );
        }
      });
    }
  },
  { deep: true, immediate: true },
);
// async function startGetDataPage() {
//   start(async () => {
//     await getDataPage();
//   }, 1);
// }
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
    // background: #fff !important;
    box-shadow: 0 0 0.25em 0 #7ff3fd !important;
  }
}
</style>
