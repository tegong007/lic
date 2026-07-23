<template>
  <div class="absolute top-10vh flex justify-start">
    <div class="flex justify-start">
      <div class="ml-1vw w-20vw flex-shrink-0 text-1.5vw">
        <div class="bgNav animation" :class="choose === 2 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 2 })">
          <span>参数设置</span>
        </div>
        <div class="bgNav animation" :class="choose === 1 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 1 })">
          <span>质检记录</span>
        </div>
      </div>
      <div class="bgDefend ml-2vw h-71vh w-75vw overflow-auto">
        <TheRecord v-if="choose === 1" :page="pages" :data="lists" @callback="getCallback" />
        <TheSet v-else-if="choose === 2" />
      </div>
    </div>
    <!-- <div v-if="choose !== 2" class="fixed bottom-10vh left-3vw right-3vw flex justify-center">
      <TheButton title="返回" @click="$goto('CheckPage')" />
    </div> -->
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
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 19.5vw;
  text-align: center;
  height: 10vh;
  line-height: 8vh;
  margin-bottom: 1vh;
  white-space: nowrap;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
.bgDefend {
  ::v-deep(.ant-form-item) {
    margin-bottom: 0vh;
  }
  ::v-deep(.ant-form-item-label) {
    line-height: 3vh !important;
  }
  ::v-deep(.ant-form-item-label label) {
    color: #ffffff;
    font-size: 1.4vw;
  }
  ::v-deep(.ant-input),
  ::v-deep(.ant-select-selector),
  ::v-deep(.ant-picker-range) {
    font-size: 1.1vw;
    background-color: transparent !important;
    color: #ffffff;
    border-width: 0px !important;
    background-color: #ffffff15 !important;
    height: 5vh !important;
    border-radius: 0;
  }
  ::v-deep(.ant-select-selection-item) {
    line-height: 5vh !important;
    font-size: 1.1vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-picker-range input) {
    font-size: 1.1vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-input::placeholder),
  ::v-deep(.ant-select-selection-placeholder),
  ::v-deep(.ant-picker-input input::placeholder) {
    color: #989ca1;
  }
  ::v-deep(.ant-select-arrow) {
    right: 0.5vw !important;
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
    font-size: 1.4vw;
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
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3662ec;
    border-radius: 2px;
  }
}
</style>

<style lang="less">
.bgDefend {
  .bg_listItem {
    padding: 2vh 0;
    margin: 1vh 0;
    font-size: 1.4vw;
    &:nth-of-type(odd) {
      background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%);
    }
    &:nth-of-type(even) {
      background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%);
    }
  }
}
</style>

<style lang="less">
// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  background-color: #141723;
  border-radius: 0;
  .ant-select-item-option {
    padding: 1.2vh 14px !important;
    min-height: auto !important;
    height: auto !important;
  }
  .ant-select-item-option-content {
    font-size: 1.1vw !important;
    color: #b0b4ba;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(54, 98, 236, 0.3) !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #3662ec !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-state {
    color: #ffffff;
  }
}
.ant-select-arrow {
  color: #e2e5eb !important;
}
</style>
