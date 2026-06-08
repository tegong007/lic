<template>
  <div class="flex">
    <div class="ml-1vw mt-1.4vh text-2.2vw">
      <div class="bgNav animation" :class="actived === 1 ? 'actived' : ''" @click="$goto('DefendPage', { key: 1 })">
        <span>进本模块</span>
      </div>
      <div class="bgNav animation" :class="actived === 2 ? 'actived' : ''" @click="$goto('DefendPage', { key: 2 })">
        <span>主副页打印模块</span>
      </div>
      <div class="bgNav animation" :class="actived === 3 ? 'actived' : ''" @click="$goto('DefendPage', { key: 3 })">
        <span>加注页打印模块</span>
      </div>
      <div class="bgNav animation" :class="actived === 4 ? 'actived' : ''" @click="$goto('DefendPage', { key: 4 })">
        <span>添加测试任务</span>
      </div>
      <!-- <div class="bgNav animation" :class="actived === 5 ? 'actived' : ''" @click="$goto('DefendPage', { key: 5 })">
        <span>工位操作</span>
      </div> -->
      <div class="bgNav animation" :class="actived === 6 ? 'actived' : ''" @click="$goto('DefendPage', { key: 6 })">
        <span>关于设备</span>
      </div>
    </div>
    <div class="bgDefend ml-2vw mt-2vh h-82vh w-95% overflow-auto">
      <template v-if="actived === 4">
        <TheTest :data="options.uvPrinters" :update-item="handleUpdateItem" />
      </template>
      <template v-else-if="actived === 5">
        <TheFw />
      </template>
      <template v-else-if="actived === 6">
        <div class="bg_listItem">
          <div class="flex py-0.5vh">
            <div class="mr-1vw w-24vw text-right">打印管理系统：</div>
            <div>{{ config.version }}</div>
          </div>
          <div v-for="(value, index) in options" :key="index" class="flex py-0.5vh">
            <div class="mr-1vw w-24vw text-right">{{ value.name }}：</div>
            <div>{{ value.version }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <Reader v-if="options.readers" :data="options.readers" :update-item="handleUpdateItem" />
        <Camera v-if="options.cameras" :data="options.cameras" @update-item="handleUpdateItem" />
        <Laser v-if="options.lasers" :data="options.lasers" @update-item="handleUpdateItem" />
        <Inkjet v-if="options.uvPrinters" :data="options.uvPrinters" @update-item="handleUpdateItem" />
        <!-- <Light v-if="options.lamps" :data="options.lamps" :act="actived" @update-item="handleUpdateItem" /> -->
      </template>
      <template v-if="actived === 1">
        <ThePrint :data="options.uvPrinters" :update-item="handleUpdateItem" />
      </template>
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
const config = JSON.parse(localStorage.getItem('config') || '{}');

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
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 19.5vw;
  text-align: center;
  height: 2.8vh;
  line-height: 2.8vh;
  margin-bottom: 3vh;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
</style>

<style lang="less">
.bgDefend {
  .bg_listItem {
    padding: 2vh 0;
    margin: 1vh 0;
    font-size: 2vw;
  }
  .bgDefend_item {
    margin-bottom: 3vh;
    .bgDefend_tit {
      font-size: 2.5vw;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        min-width: 2vw;
      }
      &::before {
        background: linear-gradient(270deg, #ffffff 0%, #ffffff00 100%);
        margin-right: 1vw;
      }
      &::after {
        background: linear-gradient(90deg, #ffffff 0%, #ffffff00 100%);
        margin-left: 1vw;
      }
    }
    .bg_listItem {
      padding: 1vh 0;
      margin: 1vh 0;
      display: flex;
      font-size: 1.8vw;
      .bgDefend_itemIn {
        display: flex;
        align-items: center;
        margin-right: 2vw;
        .bgDefend_itemIn_tit {
          margin-left: 2vw;
          padding-right: 0.5vw;
          min-width: 7vw;
          white-space: nowrap;
        }
        // 第一个 bgDefend_itemIn 下的 tit 左侧小竖条
        &:first-of-type .bgDefend_itemIn_tit:first-of-type {
          position: relative;
          padding-left: 1.5vw;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 1.2em;
            border-radius: 50px;
            background: #ffffff;
          }
        }
      }
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
      ::v-deep(.ant-select-selector) {
        font-size: 1.8vw;
        background-color: transparent !important;
        color: #ffffff;
        border-width: 0px !important;
        background-color: #ffffff15 !important;
        height: 2.5vh !important;
        border-radius: 0;
        min-width: 15vw;
      }
      ::v-deep(.ant-select-selector) {
        min-width: 12vw !important;
      }
      ::v-deep(.ant-select-selection-item) {
        line-height: 2.5vh !important;
        font-size: 1.8vw;
        color: #ffffff !important;
      }
      ::v-deep(.ant-input::placeholder),
      :v-deep(.ant-select-selection-placeholder) {
        color: #989ca1;
      }
      ::v-deep(.ant-select-arrow) {
        right: 0.5vw !important;
      }
      .keyInput {
        border-color: #3662ec;
      }
    }
  }
}
</style>

<style lang="less">
// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  .ant-select-item-option-content {
    font-size: 1.8vw;
  }
  .ant-select-item-option {
    min-height: unset !important;
    height: 2.5vh !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: center !important;
  }
}
</style>
