<template>
  <div class="mt-6.5vh w-92% flex font-[xiaowei]">
    <img class="h-7vw w-9vw" src="@/assets/image/tmp_left.png" />
    <div v-for="(value, index) in statistics" :key="index" class="w-30% text-center">
      <div class="mt-5vh text-8vh">{{ value.value }}</div>
      <div class="-mt-2vh" text-2vw>{{ value.item }}</div>
      <img class="m-auto block w-18vw -mt-3vh" src="@/assets/image/tmp_bottom.png" />
    </div>
    <img class="h-7vw w-9vw" src="@/assets/image/tmp_right.png" />
  </div>
  <a-flex class="bgB mx-auto mt-5vh h-8vh w-85% line-height-8vh">
    <div class="bgB1 mr-1vw w-14vw text-center text-1.3vw line-height-5.5vh">当前生产任务</div>
    <span class="px-5vw text-1.8vw">证本总数: {{ entire.machineTotalDoc }}</span>
    <span class="px-5vw text-1.8vw">已进本: {{ entire.machineHandledDoc }}</span>
    <span class="px-5vw text-1.8vw">待进本: {{ entire.machineRemainDoc }}</span>
  </a-flex>
  <a-flex>
    <TheTable class="bgM3" name="喷墨打印模块" :data="additionPrint" :count="3" />
    <TheTable class="bgM2" name="激光打印模块" :data="mainPrint" :count="2" />
    <TheTable class="bgM1" name="空白本检测模块" :data="blankCheck" :count="1" />
  </a-flex>
  <a-flex justify="space-between" class="bgB mx-auto mt-5vh h-8vh w-85%">
    <a-flex class="items-center gap-2vw">
      <TheButton v-if="isProduce" title="开始进本" @click="setModal(0)" />
      <TheButton v-else title="暂停进本" @click="setModal(1)" />
      <TheButton title="补打备注" @click="setModal(4)" />
    </a-flex>
    <a-flex class="items-center gap-2vw">
      <TheButton v-if="entire.beltStatusDetail === 111 || entire.beltStatusDetail === 113" title="启动设备" @click="setModal(3)" />
      <TheButton v-else title="暂停设备" @click="setModal(2)" />
      <TheButton title="初始化" @click="init()" />
    </a-flex>
  </a-flex>
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :handle-ok="controlMachine" :handle-cancel="() => setModal(-1)" />
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { homeModule } from '@/apis/proApi';
import TheButton from '@/components/base/TheButton.vue';
import TheConfirm from '@/components/TheConfirm.vue';
import TheTable from '@/pages/Home/components/TheTable.vue';
import { useAppStore } from '@/store/index';
import useCustomTimer from '@/utils/useCustomTimer';

const { notification } = App.useApp();
const { start, stop } = useCustomTimer();

const isProduce = ref(false);
const statistics: any = ref([
  { item: '良本数', value: '0' },
  { item: '废本数', value: '0' },
  { item: '良本率', value: '0%' },
]);
const entire = ref({ beltStatusDetail: 0, machineTotalDoc: 0, machineHandledDoc: 0, machineRemainDoc: 0 });
const blankCheck = ref({});
const mainPrint = ref({});
const additionPrint = ref({});
const modal = ref({ open: false, title: '', key: -1 });

async function getDataPage() {
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData) {
      entire.value = data.respData.entire; // 当前生产任务
      additionPrint.value = data.respData.additionPrint; // 喷墨打印模块
      mainPrint.value = data.respData.mainPrint; // 激光打印模块
      blankCheck.value = data.respData.blankCheck; // 空白本检测模块
      /* status-设备状态（0-待机；1-工作中；2-警告；3-故障） */
      isProduce.value = data.respData.mainPrint.status !== 1 && data.respData.blankCheck.status !== 1 && data.respData.additionPrint.status !== 1;
      if (data.respData.finishedProduct.items.length > 0) statistics.value = data.respData.finishedProduct.items;
    }
    return true;
  } catch {
    entire.value = { beltStatusDetail: 0, machineTotalDoc: 0, machineHandledDoc: 0, machineRemainDoc: 0 };
    statistics.value = [
      { item: '良本数', value: '0' },
      { item: '废本数', value: '0' },
      { item: '良本率', value: '0%' },
    ];
    return false;
  }
}

async function startGetDataPage() {
  start(async () => {
    await getDataPage();
  }, 5);
}

// 弹窗控制
function setModal(value: number) {
  switch (value) {
    case 0:
      modal.value = { open: true, title: '开始进本', key: 0 };
      break;
    case 1:
      modal.value = { open: true, title: '暂停进本', key: 1 };
      break;
    case 2:
      modal.value = { open: true, title: '暂停设备', key: 2 };
      break;
    case 3:
      modal.value = { open: true, title: '启动设备', key: 3 };
      break;
    case 4:
      modal.value = { open: true, title: '补打备注', key: 4 };
      break;
    default:
      modal.value = { open: false, title: '', key: -1 };
      break;
  }
}

async function controlMachine() {
  try {
    useAppStore().setSpinning(true);
    /* control-证本操作（0-开始/继续 进本；1-暂停进本；2-暂停设备；3-启动设备） */
    await homeModule.setControlMachine({ control: modal.value.key, docNum: modal.value.key ? null : 1 });
    notification.success({ message: '成功', description: `${modal.value.title}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    setModal(-1);
    useAppStore().setSpinning(false);
  }
}

// 初始化
async function init() {
  try {
    useAppStore().setSpinning(true);
    await homeModule.docMachineInit();
    notification.success({ message: '成功', description: '初始化接口调用成功', placement: 'bottomRight', class: 'notificationE-custom-class' });
  } catch {
    notification.error({ message: '错误', description: '初始化接口调用失败', placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(async () => {
  useAppStore().setSpinning(true);
  const end = await getDataPage();
  if (!end) notification.error({ message: '错误', description: '服务接口超时', placement: 'bottomRight', class: 'notificationE-custom-class' });
  useAppStore().setSpinning(false);
  await startGetDataPage();
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="less">
.bgB {
  background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
  .bgB1 {
    background-image: url('@/assets/image/bg_b1.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
