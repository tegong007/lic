<template>
  <div class="bgT mt-6.5vh w-100% flex justify-center font-[xiaowei]">
    <div v-for="(value, index) in statistics" :key="index" class="mx-1.5% w-14% text-center">
      <div class="mt-5vh text-7vh">{{ value.value }}</div>
      <div class="-mt-2vh" text-2vw>{{ value.item }}</div>
      <img class="m-auto block w-18vw -mt-2vh" src="@/assets/image/tmp_bottom.png" />
    </div>
    <div class="flex items-center justify-center font-[siyuan]">
      <div class="relative cursor-pointer text-center" :class="entire.modules && entire.modules.length >= 2 ? (entire.modules[0].code === 0 && entire.modules[1].code === 0 ? 'bgbg0' : entire.modules[0].code === 2 || entire.modules[1].code === 2 ? 'bgbg2' : 'bgbg3') : 'bgbg3'" @click="setModal(7)">
        <template v-if="entire.modules && entire.modules.length > 2">
          <div v-if="entire.modules[0].code === 0 && entire.modules[1].code === 0">正常</div>
          <div v-else>错误</div>
        </template>
        <div v-else>离线</div>
        <img class="mx-auto mt-1.5vh" src="@/assets/image/ico_left.png" />
        <div class="absolute bottom-1vh left-0 right-0 text-center text-1.1vw">设备机状态</div>
      </div>
      <div class="relative cursor-pointer text-center" :class="entire.uvStatus && entire.uvStatus.length > 0 ? `bgbg${entire.uvStatus[0].status}` : 'bgbg3'" @click="setModal(6)">
        <template v-if="entire.uvStatus && entire.uvStatus.length > 0">
          <div v-if="entire.uvStatus[0].status === 0">正常</div>
          <div v-else-if="entire.uvStatus[0].status === 1">工作中</div>
          <div v-else-if="entire.uvStatus[0].status === 2">警告</div>
          <div v-else-if="entire.uvStatus[0].status === 3">故障</div>
          <div v-else>--</div>
        </template>
        <div v-else>离线</div>
        <img class="mx-auto mt-1vh" src="@/assets/image/ico_right.png" />
        <div class="absolute bottom-1vh left-0 right-0 text-center text-1.1vw">喷墨机状态</div>
      </div>
      <!-- <div class="relative mt-6vh block w-22vw">
        <img class="w-full" src="@/assets/image/machine2.png" />
        <div v-if="!entire.modules || entire.modules.length <= 0" class="error absolute bottom-0 top-0 w-full flex items-center justify-center text-2.5vw">离线中</div>
        <div v-else-if="entire.modules && entire.modules.length > 0 && entire.modules[0].status === 3" class="error absolute bottom-0 top-0 w-full flex items-center justify-center text-2.5vw cursor-pointer" @click="$goto('DefendPage', { key: 5 })">故障出错</div>
      </div>
      <div>
        <div class="mt-10vh w-8vw text-center text-1.3vw">喷墨机状态</div>
        <img v-if="entire.uvStatus && entire.uvStatus.length > 0 && entire.uvStatus[0].status === 2" class="mx-auto mt-1vh block w-5vw cursor-pointer" src="@/assets/image/ico_tip2.png" @click="setModal(6)" />
        <img v-else-if="entire.uvStatus && entire.uvStatus.length > 0 && entire.uvStatus[0].status === 3" class="mx-auto mt-1vh block w-5vw cursor-pointer" src="@/assets/image/ico_tip1.png" @click="setModal(6)" />
        <img v-else-if="entire.uvStatus && entire.uvStatus.length > 0" class="mx-auto mt-1vh block w-5vw" src="@/assets/image/ico_tip0.png" />
        <img v-else class="mx-auto mt-1vh block w-5vw" src="@/assets/image/ico_tip1.png" />
      </div> -->
    </div>
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
      <TheButton title="补打加注" @click="setModal(4)" />
    </a-flex>
    <a-flex class="items-center gap-2vw">
      <TheButton v-if="entire.beltStatusDetail === 111 || entire.beltStatusDetail === 113" title="启动设备" @click="setModal(3)" />
      <TheButton v-else title="暂停设备" @click="setModal(2)" />
      <TheButton title="初始化" @click="setModal(5)" />
    </a-flex>
  </a-flex>
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :handle-ok="controlMachine" :handle-cancel="() => setModal(-1)" />
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { homeModule } from '@/apis/proApi';
import TheButton from '@/components/base/TheButton.vue';
import TheConfirm from '@/components/TheConfirm.vue';
import TheTable from '@/pages/Home/components/TheTable.vue';
import router from '@/router';
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
const entire: any = ref({ beltStatusDetail: 0, machineTotalDoc: 0, machineHandledDoc: 0, machineRemainDoc: 0, modules: {} });
const blankCheck = ref({});
const mainPrint = ref({});
const additionPrint = ref({});
const modal: any = ref({ open: false, title: '', key: -1 });

async function getDataPage() {
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData) {
      entire.value = data.respData.entire; // 当前生产任务
      additionPrint.value = data.respData.additionPrint; // 喷墨打印模块
      mainPrint.value = data.respData.mainPrint; // 激光打印模块
      blankCheck.value = data.respData.blankCheck; // 空白本检测模块
      /* status-设备状态（0-待机；1-工作中；2-警告；3-故障） */
      isProduce.value = data.respData.entire.taskStatus !== 1; // data.respData.mainPrint.status !== 1 && data.respData.blankCheck.status !== 1 && data.respData.additionPrint.status !== 1;
      if (data.respData.finishedProduct.items.length > 0) statistics.value = data.respData.finishedProduct.items;
    }
    return true;
  } catch {
    entire.value = { beltStatusDetail: 0, machineTotalDoc: 0, machineHandledDoc: 0, machineRemainDoc: 0, modules: {} };
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
  }, 2);
}

// 弹窗控制
async function setModal(value: number) {
  switch (value) {
    case 0:
      try {
        useAppStore().setSpinning(true);
        const data: any = await homeModule.getDocNumProduce();
        if (data.respData) {
          if (data.respData.docNum <= 0) throw new Error('暂无可打印数据');
          modal.value = { open: true, title: '开始进本', key: 0, desc: String(data.respData.docNum) };
        } else {
          modal.value = { open: true, title: '开始进本', key: 0, desc: '0' };
        }
      } catch (error) {
        notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
      } finally {
        useAppStore().setSpinning(false);
      }
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
    case 5:
      modal.value = { open: true, title: '初始化', key: 5 };
      break;
    case 6:
      if (entire.value.uvStatus && entire.value.uvStatus.length > 0 && (entire.value.uvStatus[0].status === 2 || entire.value.uvStatus[0].status === 3)) modal.value = { open: true, title: '喷墨机状态', key: 6, desc: entire.value.uvStatus[0].msg || '--' };
      break;
    case 7:
      if (entire.value.modules && entire.value.modules.length >= 2 && (entire.value.modules[0].status !== 0 || entire.value.modules[1].status !== 0)) router.push({ name: 'DefendPage', query: { key: 5 } });
      break;
    default:
      modal.value = { open: false, title: '', key: -1 };
      break;
  }
}

async function controlMachine() {
  if (modal.value.key === 5) {
    init();
    setModal(-1);
  } else {
    try {
      useAppStore().setSpinning(true);
      /* control-证本操作（0-开始/继续 进本；1-暂停进本；2-暂停设备；3-启动设备） */
      await homeModule.setControlMachine({ control: modal.value.key, docNum: null });
      notification.success({ message: '成功', description: `${modal.value.title}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
    } catch (error) {
      notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
    } finally {
      setModal(-1);
      useAppStore().setSpinning(false);
    }
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
.bgbg0,
.bgbg1,
.bgbg2,
.bgbg3 {
  background-size: contain;
  background-repeat: no-repeat;
  width: 7.9vw;
  height: 16.9vh;
  margin: 6vh 0 0 2.5vw;
  font-size: 1.1vw;
  img {
    width: 55%;
    display: block;
  }
}
.bgbg0 {
  background-image: url('@/assets/image/bg_tip0.png');
}
.bgbg1 {
  background-image: url('@/assets/image/bg_tip3.png');
}
.bgbg2 {
  background-image: url('@/assets/image/bg_tip2.png');
}
.bgbg3 {
  background-image: url('@/assets/image/bg_tip1.png');
}
.bgT {
  background-image: url('@/assets/image/tmp_lr.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.bgB {
  background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
  .bgB1 {
    background-image: url('@/assets/image/bg_b1.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.error {
  background: radial-gradient(61% 61% at 50% 50%, #b4050500 49%, #b4050580 100%);
}
</style>
