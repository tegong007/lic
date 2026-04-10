<template>
  <div class="w-full">
    <div class="flex">
      <div class="w-27vw">
        <div class="flex gap-1vw">
          <div v-for="(value, index) in statistics" :key="index" class="text-center">
            <div class="text-1.8vw font-[xiaowei]">{{ value.value }}</div>
            <div class="mt--2vh text-1.2vw">{{ value.item }}</div>
            <img class="-mt-3vh" src="@/assets/image/bg_statistics.png" />
          </div>
        </div>
        <div class="bgHome_box mt-10vh h-18vh text-1vw">
          <div class="bgHome_tit mx-auto w-9vw pt-0.5vh text-center font-bold">当前生产任务</div>
          <div class="mt-3.5vh flex items-center justify-center gap-3vw">
            <span>证本总数：{{ entire.machineTotalDoc }}</span>
            <span>已进本：{{ entire.machineHandledDoc }}</span>
            <span>待进本：{{ entire.machineRemainDoc }}</span>
          </div>
        </div>
      </div>
      <TheTable class="bgHome_tb1" name="进本模块" :data="blankCheck" :count="1" />
      <TheTable class="bgHome_tb2" name="激光打印模块" :data="mainPrint" :count="2" />
      <TheTable class="bgHome_tb3" name="喷墨打印模块" :data="additionPrint" :count="3" />
    </div>
    <div class="mt-8vh flex">
      <div class="bgHome_box h-15vh w-60vw flex justify-between px-6vw">
        <div class="flex items-center gap-1.3vw">
          <TheButton v-if="isProduce === 0" title="开始进本" @click="setModal(0)" />
          <TheButton v-else-if="isProduce === 2" title="继续进本" @click="setModal(8)" />
          <TheButton v-else title="暂停进本" @click="setModal(1)" />
          <TheButton title="补打加注" @click="setModal(4)" />
        </div>
        <div class="flex items-center gap-1.3vw">
          <TheButton v-if="entire.beltStatusDetail === 111 || entire.beltStatusDetail === 113" title="启动设备" @click="setModal(3)" />
          <TheButton v-else title="暂停设备" @click="setModal(2)" />
          <TheButton title="初始化" @click="setModal(5)" />
        </div>
      </div>
      <div class="ml-3vw flex gap-1.5vw">
        <div class="relative cursor-pointer text-center" :class="entire.modules && entire.modules.length >= 2 ? (entire.modules[0].code === 0 && entire.modules[1].code === 0 ? 'bgHome_tip0' : entire.modules[0].code === 2 || entire.modules[1].code === 2 ? 'bgHome_tip2' : 'bgHome_tip3') : 'bgHome_tip3'" @click="setModal(7)">
          <template v-if="entire.modules && entire.modules.length > 2">
            <div v-if="entire.modules[0].code === 0 && entire.modules[1].code === 0">正常</div>
            <div v-else>错误</div>
          </template>
          <div v-else>离线</div>
          <img class="mx-auto h-60%" src="@/assets/image/ico_device.png" />
          <div class="absolute bottom-1.2vh w-full text-center">设备机状态</div>
        </div>
        <div class="relative cursor-pointer text-center" :class="entire.uvStatus && entire.uvStatus.length > 0 ? `bgHome_tip${entire.uvStatus[0].status}` : 'bgHome_tip3'" @click="setModal(6)">
          <template v-if="entire.uvStatus && entire.uvStatus.length > 0">
            <div v-if="entire.uvStatus[0].status === 0">正常</div>
            <div v-else-if="entire.uvStatus[0].status === 1">工作中</div>
            <div v-else-if="entire.uvStatus[0].status === 2">警告</div>
            <div v-else-if="entire.uvStatus[0].status === 3">故障</div>
            <div v-else>--</div>
          </template>
          <div v-else>离线</div>
          <img class="mx-auto h-60%" src="@/assets/image/ico_uv.png" />
          <div class="absolute bottom-1.2vh w-full text-center">喷墨机状态</div>
        </div>
        <div class="flex gap-0.5vw pl-0.5vw">
          <template v-for="(value, index) in link" :key="index">
            <div v-if="value.color" :key="index" class="w-2vw overflow-hidden text-center">
              <div class="relative mx-auto mt-1vh h-11vh w-60% border-1px border-gray-400 border-dashed">
                <div class="absolute bottom-0 w-100%" :style="{ height: `${value.count}%`, backgroundColor: value.color }"></div>
              </div>
              <div class="mt-1vh text-0.6vw">{{ value.name }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-ok="controlMachine" :handle-cancel="() => setModal(-1)" />
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { footerModule, homeModule } from '@/apis/proApi';
import TheButton from '@/components/base/TheButton.vue';
import TheConfirm from '@/components/TheConfirm.vue';
import TheTable from '@/pages/Home/components/TheTable.vue';
import router from '@/router';
import { useAppStore } from '@/store/index';
import useCustomTimer from '@/utils/useCustomTimer';

const { notification } = App.useApp();
const { start, stop } = useCustomTimer();

const isProduce = ref(0);
const statistics: any = ref([
  { item: '良本数', value: '0' },
  { item: '废本数', value: '0' },
  { item: '良本率', value: '0%' },
]);
const errorInfo: any = ref({});
const entire: any = ref({ beltStatusDetail: 0, machineTotalDoc: 0, machineHandledDoc: 0, machineRemainDoc: 0, modules: {} });
const blankCheck = ref({});
const mainPrint = ref({});
const additionPrint = ref({});
const modal: any = ref({ open: false, title: '', key: -1 });
const link: any = ref([]);
const color: any = { Y: '#ffff00', M: '#ff00ff', C: '#00ffff', K: '#000000', O: '#979797' };

async function getDataPage() {
  try {
    const data: any = await footerModule.getLnkRemainder();
    if (data.respData && data.respData[0].inkObjects) {
      link.value = [];
      data.respData[0].inkObjects.forEach((element: any) => {
        link.value.push({ name: element.inkName, count: element.remainder, color: color[element.inkCode] || '' });
      });
    }
  } catch {
    link.value = [];
  }
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData) {
      entire.value = data.respData.entire; // 当前生产任务
      additionPrint.value = data.respData.additionPrint; // 喷墨打印模块
      mainPrint.value = data.respData.mainPrint; // 激光打印模块
      blankCheck.value = data.respData.blankCheck; // 进本模块
      errorInfo.value = entire.value.errorInfo || {};
      /* if (errorInfo.value.isShow && modal.value.title === '') modal.value = { open: true, title: '错误弹窗提示', data: errorInfo.value, key: -1 };
      else if (!errorInfo.value.isShow && modal.value.title === '错误弹窗提示') modal.value = { open: false, title: '', key: -1 }; */
      /* status-设备状态（0-待机；1-工作中；2-警告；3-故障） */
      if (data.respData.entire.machineRemainDoc > 0) isProduce.value = data.respData.entire.taskStatus || 0;
      else if (data.respData.entire.machineRemainDoc === 0) isProduce.value = data.respData.entire.taskStatus === 2 ? 2 : 0;
      else isProduce.value = -1;
      // data.respData.mainPrint.status !== 1 && data.respData.blankCheck.status !== 1 && data.respData.additionPrint.status !== 1;
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
    case 8:
      modal.value = { open: true, title: '继续进本', key: 0 };
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
      notification.success({ message: '成功', description: `${modal.value.title}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
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
    notification.success({ message: '成功', description: '初始化接口调用成功', placement: 'bottomRight', class: 'notification-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
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
.bgHome_box {
  background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}
.bgHome_tit {
  background: url('@/assets/image/bg_navItem.png') no-repeat;
  background-size: cover;
}
.bgHome_tb1,
.bgHome_tb2,
.bgHome_tb3 {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 17.9vw;
  height: 48.5vh;
  margin-left: 1.8vw;
  position: relative;
}
.bgHome_tb1 {
  background-image: url('@/assets/image/bg_tabMin1.png');
  margin-left: 2.2vw;
}
.bgHome_tb2 {
  background-image: url('@/assets/image/bg_tabMin2.png');
}
.bgHome_tb3 {
  background-image: url('@/assets/image/bg_tabMin3.png');
}
.bgHome_tip0,
.bgHome_tip1,
.bgHome_tip2,
.bgHome_tip3 {
  background-size: contain;
  background-repeat: no-repeat;
  width: 4vw;
  height: 17.4vh;
  font-size: 0.7vw;
}
.bgHome_tip0 {
  background-image: url('@/assets/image/bg_state_ok.png');
}
.bgHome_tip1 {
  background-image: url('@/assets/image/bg_state_work.png');
}
.bgHome_tip2 {
  background-image: url('@/assets/image/bg_state_warn.png');
}
.bgHome_tip3 {
  background-image: url('@/assets/image/bg_state_ng.png');
}
</style>
