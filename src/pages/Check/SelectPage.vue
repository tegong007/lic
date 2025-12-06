<template>
  <div class="mt-2.5vh w-92% flex">
    <a-flex justify="around" class="mt-9vh w-94vw">
      <div>
        <div v-for="item in navs" :key="item.key" class="bgNav mb-4vh transition-transform duration-300" :class="choose === item.key ? 'actived' : 'hover:scale-105'" @click="setActived(item.key)">
          <span class="text-1.5vw line-height-8vh">{{ item.name }}</span>
        </div>
      </div>
      <div class="ml-2vw overflow-auto text-1.5vw">
        <TheRecord v-if="choose === 1" :page="pages" :data="lists" @callback="getCallback" />
        <TheSet v-else-if="choose === 2" />
      </div>
    </a-flex>
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
const pages = ref({ total: 0, current: 1, size: 10 });
const navs: any = { x1: { name: '质检记录', key: 1 }, x2: { name: '质检设置', key: 2 } };

function setActived(key: number) {
  if (key !== choose.value) {
    choose.value = key;
    form.value = {};
    getData();
  }
}

// 回调事件
function getCallback(param: any) {
  const page = param.page || { total: 0, current: 1, size: 10 };
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
      data = await checkModule.qualityCheckHistoy({ ...form.value, beginDate: temp[0], endDate: temp[1], page: pages.value.current, rowPerPage: 10 });
      if (data.respData) {
        lists.value = data.respData.checkedInfo;
        pages.value = { total: data.respData.totalRows, current: data.respData.page, size: data.respData.rowPerPage };
      }
    } else if (choose.value === 2) {
      //
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
  background-image: url('@/assets/image/bg_nav.png');
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 15vw;
  text-align: center;
  height: 9vh;
  &.actived {
    background-image: url('@/assets/image/bg_navA.png');
    cursor: default;
  }
}
::v-deep(.ant-form-item) {
  margin-bottom: 0;
}
::v-deep(.ant-form-item-label label) {
  color: #ffffff;
  font-size: 1.3vw;
  height: 4vh;
}
::v-deep(.ant-input),
::v-deep(.ant-select-selector),
::v-deep(.ant-picker-range) {
  font-size: 1.2vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 2px !important;
  height: 4vh !important;
  border-radius: 0;
  min-width: 7.5vw;
}
::v-deep(.ant-select-selection-item) {
  line-height: 3.5vh !important;
}
::v-deep(.ant-picker-range input),
::v-deep(.ant-select-selection-item) {
  font-size: 1.2vw;
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
::v-deep(.ant-dropdown-trigger) {
  padding-right: 2vw;
}
::v-deep(.ant-dropdown-trigger .anticon) {
  position: absolute;
  top: 1vh;
}
</style>
