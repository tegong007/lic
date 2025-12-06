<template>
  <div class="mt-2.5vh w-92% flex">
    <a-flex justify="around" class="mt-9vh w-94vw">
      <div>
        <div v-for="item in navs" :key="item.key" class="bgNav mb-4vh transition-transform duration-300" :class="actived === item.key ? 'actived' : 'hover:scale-105'" @click="setActived(item.key)">
          <span class="text-1.5vw line-height-8vh">{{ item.name }}</span>
        </div>
      </div>
      <div class="ml-2vw mt-3vh overflow-auto text-1.5vw">
        <template v-if="actived === 4">
          <div class="bg4 mt-2vh max-h-50vh w-60vw py-2vh pl-1vw">
            <div class="flex py-2vh">
              <div class="mr-1vw w-20vw text-right">打印管理系统：</div>
              <div>1.0.3.1.1</div>
            </div>
            <div v-for="(value, index) in options" :key="index" class="flex py-2vh">
              <div class="mr-1vw w-20vw text-right">{{ value.name }}：</div>
              <div>{{ value.version }}</div>
            </div>
          </div>
        </template>
        <template v-else-if="actived === 0">
          <TheTest :data="options.uvPrinters" :update-item="handleUpdateItem" />
        </template>
        <template v-else>
          <Reader v-if="options.readers" :data="options.readers" :update-item="handleUpdateItem" />
          <Camera v-if="options.cameras" :data="options.cameras" @update-item="handleUpdateItem" />
          <Laser v-if="options.lasers" :data="options.lasers" @update-item="handleUpdateItem" />
          <Inkjet v-if="options.uvPrinters" :data="options.uvPrinters" @update-item="handleUpdateItem" />
        </template>
      </div>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { defendModule } from '@/apis/proApi';
import Camera from '@/pages/Defend/components/TheCamera.vue';
import Inkjet from '@/pages/Defend/components/TheInkjet.vue';
import Laser from '@/pages/Defend/components/TheLaser.vue';
import Reader from '@/pages/Defend/components/TheReader.vue';
import TheTest from '@/pages/Defend/components/TheTest.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const route = useRoute();

const actived = ref(-1);
const navs: any = { x0: { name: '添加测试任务', key: 0 }, x1: { name: '空白本检测模块', key: 1 }, x2: { name: '激光打印模块', key: 2 }, x3: { name: '喷墨打印模块', key: 3 }, x4: { name: '关于设备', key: 4 } };
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
    if (actived.value === 4) data = await defendModule.getVersion({ type: 0 });
    else if (actived.value === 0) data = await defendModule.getDevice(Number(3));
    else data = await defendModule.getDevice(Number(actived.value));
    if (data.respData) options.value = data.respData;
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(async () => {
  setActived(Number(route.query.key || '0'));
});
</script>

<style scoped lang="less">
.bg4 {
  background: linear-gradient(92deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}
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
::-webkit-scrollbar {
  width: 1.5vw;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #03163e 0%, #3662ec 53%);
  border-radius: 50px;
}
</style>
