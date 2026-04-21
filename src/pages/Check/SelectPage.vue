<template>
  <div class="mx-auto ml-1vw mt-1.4vh flex text-2.2vw">
    <div class="bgNav sp2 animation" :class="choose === 2 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 2 })">
      <span>参数设置</span>
    </div>
    <div class="bgNav sp2 animation" :class="choose === 1 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 1 })">
      <span>质检记录</span>
    </div>
  </div>
  <div class="bgSelect mx-auto mt-2vh h-77vh overflow-auto">
    <TheRecord v-if="choose === 1" :page="pages" :data="lists" @callback="getCallback" />
    <TheSet v-else-if="choose === 2" />
  </div>
  <div class="bgSelect_bottom fixed bottom-0 left-0 right-0 right-7vw mx-auto w-full flex justify-center px-3vw py-2vh">
    <div>
      <TheButton title="返回" @click="$goto('CheckPage')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { checkModule } from '@/apis/proApi';
import TheRecord from '@/pages/Check/components/TheRecord.vue';
import TheSet from '@/pages/Check/components/TheSet.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const route = useRoute();

const form: any = ref({});
const choose = ref(-1);
const lists = ref([]);
const pages = ref({ total: 0, current: 1, size: 5 });

function setActived(key: number) {
  if (key !== choose.value) {
    choose.value = key;
    form.value = {};
    getData();
  }
}

// 回调事件
function getCallback(param: any) {
  const page = param.page || { total: 0, current: 1, size: 5 };
  if (param.formData) {
    form.value = param.formData;
    pages.value = page;
    getData();
  }
}

async function getData() {
  try {
    useAppStore().setSpinning(true);
    let data: any;
    if (choose.value === 1) {
      const temp: any = form.value.dateRange || ['', ''];
      data = await checkModule.qualityCheckHistoy({ ...form.value, dateRange: undefined, beginDate: temp[0], endDate: temp[1], page: pages.value.current, rowPerPage: 5 });
      if (data.respData) {
        lists.value = data.respData.checkedInfo;
        pages.value = { total: data.respData.totalRows, current: data.respData.page, size: data.respData.rowPerPage };
        if (!(pages.value.total > 0)) notification.error({ message: '完成', description: '搜索完成，没有搜到有效数据', placement: 'bottomRight', class: 'notification-custom-class' });
      }
    }
  } catch (error) {
    lists.value = [];
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(async () => {
  setActived(Number(route.query.key || '1'));
});
</script>

<style scoped lang="less">
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 19.5vw;
  text-align: center;
  height: 2.8vh;
  line-height: 2.8vh;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
.bgSelect {
  ::v-deep(.ant-form-item) {
    margin-bottom: 0vh;
  }
  ::v-deep(.ant-form-item-label) {
    line-height: 3vh !important;
  }
  ::v-deep(.ant-form-item-label label) {
    color: #ffffff;
    font-size: 2vw;
  }
  ::v-deep(.ant-input),
  ::v-deep(.ant-select-selector),
  ::v-deep(.ant-picker-range) {
    font-size: 2vw;
    background-color: transparent !important;
    color: #ffffff;
    border-width: 1px !important;
    height: 3vh !important;
    border-radius: 0;
  }
  ::v-deep(.ant-select-selection-item) {
    line-height: 3vh !important;
  }
  ::v-deep(.ant-picker-range input),
  ::v-deep(.ant-select-selection-item) {
    font-size: 2vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-input::placeholder),
  ::v-deep(.ant-select-selection-placeholder),
  ::v-deep(.ant-picker-input input::placeholder) {
    color: #989ca1;
  }
  ::v-deep(.ant-switch-checked .ant-switch-inner) {
    background: #3662ec;
  }
  ::v-deep(.ant-switch-inner) {
    background: #d8d8d8;
  }
  ::v-deep(.anticon svg) {
    color: #e2e5eb;
  }
  ::v-deep(.vxe-pager) {
    font-size: 2vw;
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
}
</style>

<style lang="less">
.bgSelect {
  .bg_listItem {
    padding: 1vh 0;
    margin: 1vh 0;
    display: flex;
    font-size: 2vw;
  }
  .bgSelect_item {
    margin-bottom: 2vh;
    .bgSelect_tit {
      font-size: 2.5vw;
      font-weight: bold;
    }
    .bg_listItem {
      display: flex;
      .bgSelect_itemIn {
        display: flex;
        align-items: center;
        margin-right: 1vw;
        .bgSelect_itemIn_tit {
          margin-left: 2vw;
          padding-right: 0.5vw;
        }
      }
      .keyInput {
        border-color: #3662ec;
      }
    }
  }
}
</style>
