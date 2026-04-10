<template>
  <TheTask v-if="choose === 1" :page="pages" :data="lists" @callback="getCallback" />
  <TheRecord v-else-if="choose === 2" :form="form" :page="pages" :data="lists" @callback="getCallback" />
  <TheDoc v-else-if="choose === 3" :page="pages" :data="lists" @callback="getCallback" />
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :handle-ok="handleModal" :handle-cancel="() => (modal = { open: false, title: '', item: {} })" />
  <TheDetail v-if="detail.open" :open="detail.open" :item="detail.item" :handle-cancel="() => (detail = { open: false, item: {} })" />
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { searchModule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import TheDetail from '@/pages/Search/components/TheDetail.vue';
import TheDoc from '@/pages/Search/components/TheDoc.vue';
import TheRecord from '@/pages/Search/components/TheRecord.vue';
import TheTask from '@/pages/Search/components/TheTask.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();

const form = ref({});
const choose = ref(1);
const lists = ref([]);
const pages = ref({ total: 0, current: 1, size: 3 });
const modal = ref({ open: false, title: '', item: {} });
const detail = ref({ open: false, item: {} });

// 弹窗操作
async function handleModal() {
  const temp: any = modal.value;
  let data: any;
  try {
    modal.value = { open: false, title: '', item: {} };
    useAppStore().setSpinning(true);
    if (choose.value === 1) {
      if (temp.title === '挂起') data = await searchModule.taskOperate({ taskID: [temp.item.taskID], operate: 0 });
      else if (temp.title === '恢复生产') data = await searchModule.taskOperate({ taskID: [temp.item.taskID], operate: 1 });
      else if (temp.title.indexOf('批量挂起') > -1) data = await searchModule.taskOperate({ taskID: temp.item, operate: 0 });
      else if (temp.title.indexOf('批量恢复生产') > -1) data = await searchModule.taskOperate({ taskID: temp.item, operate: 1 });
    } else if (choose.value === 2) {
      if (temp.title === '挂起') data = await searchModule.docOperate({ docSN: [temp.item.docSN], operate: 0 });
      else if (temp.title === '恢复生产') data = await searchModule.docOperate({ docSN: [temp.item.docSN], operate: 1 });
      else if (temp.title === '设为成功') data = await searchModule.docOperate({ docSN: [temp.item.docSN], operate: 2 });
      else if (temp.title === '设为失败') data = await searchModule.docOperate({ docSN: [temp.item.docSN], operate: 3 });
      else if (temp.title.indexOf('批量挂起') > -1) data = await searchModule.docOperate({ docSN: temp.item, operate: 0 });
      else if (temp.title.indexOf('批量恢复生产') > -1) data = await searchModule.docOperate({ docSN: temp.item, operate: 1 });
      else if (temp.title.indexOf('批量设为成功') > -1) data = await searchModule.docOperate({ docSN: temp.item, operate: 2 });
      else if (temp.title.indexOf('批量设为失败') > -1) data = await searchModule.docOperate({ docSN: temp.item, operate: 3 });
    } else if (choose.value === 3) {
      if (temp.title === '设为成功') data = await searchModule.physicalDocOperate({ physicalID: [temp.item.physicalID], operate: 2 });
      else if (temp.title === '设为失败') data = await searchModule.physicalDocOperate({ physicalID: [temp.item.physicalID], operate: 3 });
      else if (temp.title.indexOf('批量设为成功') > -1) data = await searchModule.physicalDocOperate({ physicalID: temp.item, operate: 2 });
      else if (temp.title.indexOf('批量设为失败') > -1) data = await searchModule.physicalDocOperate({ physicalID: temp.item, operate: 3 });
    }
    let s = 0;
    let e = 0;
    if (data.respData.length > 0) {
      if (data.respData.length === 1) {
        if (data.respData[0].code !== 0) throw data.respData[0].msg;
        else s = s + 1;
      } else {
        data.respData.forEach((element: any) => {
          if (element.code === 0) s = s + 1;
          else e = e + 1;
        });
      }
    }
    if (e === 0) notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
    else if (s > 0) notification.success({ message: '成功', description: s + '条操作成功，' + e + '条操作失败', placement: 'bottomRight', class: 'notification-custom-class' });
    else throw new Error('全部操作失败');
    getData();
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
    getData();
  } finally {
    useAppStore().setSpinning(false);
  }
}

// 回调事件
function getCallback(param: any) {
  const page = param.page || { total: 0, current: 1, size: 3 };
  if (param.formData) {
    form.value = param.formData;
    choose.value = param.formData.choose;
    pages.value = page;
    getData();
  } else if (param.items) {
    if (param.key === 'chakan') {
      if (choose.value === 1) {
        form.value = { taskID: param.items.taskID };
        pages.value = { total: 0, current: 1, size: 3 };
        choose.value = 2;
        getData();
      } else if (choose.value === 2 || choose.value === 3) {
        detail.value = { open: true, item: param.items };
      }
    } else {
      if (param.key.indexOf('批量') > -1) modal.value = { open: true, title: param.key + '(共' + param.items.length + '条)，其中可能含有不能操作数据', item: param.items };
      else modal.value = { open: true, title: param.key, item: param.items };
    }
  }
}

async function getData() {
  try {
    useAppStore().setSpinning(true);
    let data: any;
    if (choose.value === 1) data = await searchModule.getTask({ ...form.value, page: pages.value.current, rowPerPage: 3 });
    else if (choose.value === 2) data = await searchModule.docData({ ...form.value, page: pages.value.current, rowPerPage: 3 });
    else if (choose.value === 3) data = await searchModule.physicalDoc({ ...form.value, page: pages.value.current, rowPerPage: 3 });
    if (data.respData) {
      if (choose.value === 1) {
        lists.value = data.respData.taskInfo;
      } else if (choose.value === 2) {
        lists.value = data.respData.docInfo;
      } else if (choose.value === 3) {
        lists.value = data.respData.docInfo;
      }
      pages.value = { total: data.respData.totalRows, current: data.respData.page, size: data.respData.rowPerPage };
      if (!(pages.value.total > 0)) notification.error({ message: '完成', description: '搜索完成，没有搜到有效数据', placement: 'bottomRight', class: 'notification-custom-class' });
    }
  } catch (error) {
    lists.value = [];
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
::v-deep(.ant-form-item) {
  margin-bottom: 0vh;
}
::v-deep(.ant-form-item-label) {
  line-height: 6vh !important;
}
::v-deep(.ant-form-item-label label) {
  color: #ffffff;
  font-size: 0.8vw;
}
::v-deep(.ant-input),
::v-deep(.ant-select-selector),
::v-deep(.ant-picker-range) {
  font-size: 0.8vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 1px !important;
  height: 6vh !important;
  border-radius: 0;
  min-width: 5vw;
}
::v-deep(.ant-select-selection-item) {
  line-height: 5.5vh !important;
}
::v-deep(.ant-picker-range input),
::v-deep(.ant-select-selection-item) {
  font-size: 0.8vw;
  color: #ffffff !important;
}
::v-deep(.ant-input::placeholder),
::v-deep(.ant-select-selection-placeholder),
::v-deep(.ant-picker-input input::placeholder) {
  color: #989ca1;
}
::v-deep(.anticon svg) {
  color: #e2e5eb;
}
::v-deep(.vxe-pager) {
  font-size: 0.8vw;
  color: #cfdef1;
  background-color: transparent;
  .vxe-pager--prev-btn,
  .vxe-pager--num-btn,
  .vxe-pager--next-btn {
    color: #ffffff;
    background: transparent;
  }
  .is--active {
    background: #3662ec;
    color: #ffffff !important;
  }
  .is--disabled {
    color: #989ca1 !important;
  }
}
</style>
