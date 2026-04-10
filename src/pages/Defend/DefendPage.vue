<template>
  <div class="bgDefend ml-2vw mt-2vh h-65vh w-95% overflow-auto">
    <template v-if="actived === 1">
      <ThePrint :data="options.uvPrinters" :update-item="handleUpdateItem" />
    </template>
    <template v-else-if="actived === 4">
      <TheTest :data="options.uvPrinters" :update-item="handleUpdateItem" />
    </template>
    <template v-else-if="actived === 5">
      <TheFw />
    </template>
    <template v-else-if="actived === 6">
      <div class="bg_listItem">
        <div class="flex py-2vh">
          <div class="mr-1vw w-12vw text-right">打印管理系统：</div>
          <div>1.0.13.14</div>
        </div>
        <div v-for="(value, index) in options" :key="index" class="flex py-2vh">
          <div class="mr-1vw w-12vw text-right">{{ value.name }}：</div>
          <div>{{ value.version }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <Reader v-if="options.readers" :data="options.readers" :update-item="handleUpdateItem" />
      <Camera v-if="options.cameras" :data="options.cameras" @update-item="handleUpdateItem" />
      <Laser v-if="options.lasers" :data="options.lasers" @update-item="handleUpdateItem" />
      <Inkjet v-if="options.uvPrinters" :data="options.uvPrinters" @update-item="handleUpdateItem" />
      <Light v-if="options.lamps" :data="options.lamps" :act="actived" @update-item="handleUpdateItem" />
    </template>
  </div>
  <div class="bgDefend_bottom fixed bottom-0 left-12vw right-7vw flex justify-center px-3vw py-2vh">
    <div>
      <TheButton title="返回" @click="$goto('HomePage')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { defendModule } from '@/apis/proApi';
import Camera from '@/pages/Defend/components/TheCamera.vue';
import TheFw from '@/pages/Defend/components/TheFw.vue';
import Inkjet from '@/pages/Defend/components/TheInkjet.vue';
import Laser from '@/pages/Defend/components/TheLaser.vue';
import Light from '@/pages/Defend/components/TheLight.vue';
import ThePrint from '@/pages/Defend/components/ThePrint.vue';
import Reader from '@/pages/Defend/components/TheReader.vue';
import TheTest from '@/pages/Defend/components/TheTest.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const route = useRoute();

const actived = ref(-1);
const options: any = ref({});

function setActived(key: number) {
  if (key !== actived.value) {
    actived.value = key;
    getData();
  }
}

function handleUpdateItem(arrayName: string, index: string, value: any) {
  if (options.value[arrayName] && options.value[arrayName][index]) {
    if (arrayName === 'uvPrinters') {
      options.value[arrayName][index].positionItems[1].value = value;
    } else {
      options.value[arrayName][index].value = value;
    }
  }
}

async function getData() {
  try {
    options.value = {};
    useAppStore().setSpinning(true);
    let data: any;
    if (actived.value === 6) {
      data = await defendModule.getVersion({ type: 0 });
    } else if (actived.value === 4 || actived.value === 5) {
      data = {};
    } else {
      data = await defendModule.getDevice(Number(actived.value));
    }
    if (data.respData) options.value = data.respData;
  } catch (error) {
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
.bgDefend {
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
.bgDefend_bottom {
  background:
    linear-gradient(270deg, #03163e 0%, #03163e 93%, #03163e00 100%),
    linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}
</style>

<style lang="less">
.bgDefend {
  .bg_listItem {
    padding: 2vh 0;
    margin: 2vh 0;
    font-size: 1vw;
  }
  .bgDefend_item {
    margin-bottom: 3vh;
    .bgDefend_tit {
      font-size: 1vw;
      font-weight: bold;
    }
    .bg_listItem {
      display: flex;
      .bgDefend_itemIn {
        display: flex;
        align-items: center;
        margin-right: 2vw;
        .bgDefend_itemIn_tit {
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
