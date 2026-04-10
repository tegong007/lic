<template>
  <div class="bgSelect ml-2vw mt-2vh h-65vh w-95% overflow-auto">
    <TheRecord v-if="choose === 1" :page="pages" :data="lists" @callback="getCallback" />
    <TheSet v-else-if="choose === 2" />
  </div>
  <div class="bgSelect_bottom fixed bottom-0 left-12vw right-7vw flex justify-center px-3vw py-2vh">
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
.bgSelect {
  ::v-deep(.ant-input),
  ::v-deep(.ant-select-selector) {
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
  ::v-deep(.ant-select-selection-item) {
    font-size: 0.8vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-input::placeholder),
  ::v-deep(.ant-select-selection-placeholder) {
    color: #989ca1;
  }
  ::v-deep(.ant-switch-checked .ant-switch-inner) {
    background: #3662ec;
  }
  ::v-deep(.ant-switch-inner) {
    background: #d8d8d8;
  }
}
.bgSelect_bottom {
  background:
    linear-gradient(270deg, #03163e 0%, #03163e 93%, #03163e00 100%),
    linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}
</style>

<style lang="less">
.bgSelect {
  .bg_listItem {
    padding: 2vh 0;
    margin: 2vh 0;
    font-size: 1vw;
  }
  .bgSelect_item {
    margin-bottom: 3vh;
    .bgSelect_tit {
      font-size: 1vw;
      font-weight: bold;
    }
    .bg_listItem {
      display: flex;
      .bgSelect_itemIn {
        display: flex;
        align-items: center;
        margin-right: 2vw;
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
