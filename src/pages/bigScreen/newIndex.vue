<template>
  <div
    class="bg relative h-100vh flex flex-col items-center text-[18px] text-white"
  >
    <div
      class="font-semiboldw relative top-4.5vh w-full flex flex-col gap-10 text-1.4vh text-white color-[#CFDEF1]"
    >
      <div class="text-center">
        当前生产任务
      </div>
      <div
        class="flex items-center justify-between bg-slate-500/30 p-10 p-x-3vh"
      >
        <span>证本总数：<span class="text-1.6vh font-[youshe]">{{
          entire.machineTotalDoc
        }}</span></span>
        <span>已进本：<span class="text-1.6vh font-[youshe]">{{
          entire.machineHandledDoc
        }}</span></span>
        <span>待进本：<span class="text-1.6vh font-[youshe]">{{
          entire.machineRemainDoc
        }}</span></span>
      </div>
    </div>
    <CanvasComponent
      :width="1000"
      :height="150"
      :top="710"
      :left="0"
      :rectangles="rectangles"
    />
    <bigScreenHeader />
    <div class="absolute top-11.7vh h20vh w100% flex gap-20 p-x-40">
      <Print class="relative h20vh flex-1" :data="mainPrint" />
      <Start class="relative h20vh flex-1" :data="blankCheck" />
      <div
        class="absolute left-22.5vh top-0 h-3vh w-5vh flex items-center justify-center"
        @click="
          $goto('WorkstationStatus', {
            light: 2,
          })
        "
      >
        <span
          class="absolute cursor-default rounded-[1vh] bg-[#0000007a] p-x-10 p-y-3 text-1vh line-height-[40px] font-[youshe]"
        >工位查看
        </span>
      </div>
      <div
        class="absolute right-2.5vh top-0 h-3vh w-5vh flex items-center justify-center"
        @click="
          $goto('WorkstationStatus', {
            light: 1,
          })
        "
      >
        <span
          class="absolute cursor-default rounded-[1vh] bg-[#0000007a] p-x-10 p-y-3 text-1vh line-height-[40px] font-[youshe]"
        >工位查看
        </span>
      </div>
    </div>
    <div class="absolute bottom-19vh h20vh w100% flex gap-20 p-x-40">
      <FinishedProductBg
        class="relative h20vh flex-1"
        :data="finishedProduct"
      />
      <AddMore class="relative h20vh flex-1" :data="additionPrint" />
      <div
        class="absolute left-22.5vh top-0 h-3vh w-6vh flex items-center justify-center"
        @click="
          $goto('WorkstationStatus', {
            light: 4,
          })
        "
      >
        <span
          class="absolute cursor-default rounded-[1vh] bg-[#0000007a] p-x-10 p-y-3 text-1vh line-height-[40px] line-height-[40px] font-[youshe]"
        >工位查看
        </span>
      </div>
      <div
        class="absolute right-2.5vh top-0 h-3vh w-6vh flex items-center justify-center"
        @click="
          $goto('WorkstationStatus', {
            light: 3,
          })
        "
      >
        <span
          class="absolute cursor-default rounded-[1vh] bg-[#0000007a] p-x-10 p-y-3 text-1vh line-height-[40px] font-[youshe]"
        >工位查看
        </span>
      </div>
    </div>

    <div
      class="groupBtn absolute bottom-10vh z-22 h8em w-full flex items-center justify-center gap-20"
    >
      <TheButton
        :title="entire?.taskStatus === 0 ? '开始进本' : '加本'"
        @click="setModal(0, entire?.taskStatus === 0 ? 'open' : 'add')"
      />
      <TheButton
        v-if="entire?.machineRemainDoc !== 0"
        :title="canContinue ? '继续进本' : '暂停进本'"
        @click="
          setModal(canContinue ? 0 : 1, canContinue ? 'continue' : 'pause')
        "
      />
      <!-- <button @click="addRectangle()">Add Rectangle</button>
      <button @click="deleteRectangleById(1)">
        Delete Rectangle with ID 1
      </button>
      <button @click="modifyRectangleById(1, 150, 150, 200, 100)">
        Modify Rectangle with ID 1
      </button> -->
      <TheButton
        class="absolute right-2vh"
        :title="
          entire.beltStatusDetail === 111 || entire.beltStatusDetail === 113
            ? '启动设备'
            : '暂停设备'
        "
        @click="
          setModal(
            entire.beltStatusDetail === 111 || entire.beltStatusDetail === 113
              ? 3
              : 2,
          )
        "
      />
    </div>

    <!-- 下边按钮 -->
    <div
      class="groupBtn absolute bottom-4vh h8em w-full flex items-center justify-center gap-20"
    >
      <!-- <div class="flex">
        <TheButton title="批次查询" @click="$goto('BatchList')" />
      </div>
     <div class="flex">
        <TheButton title="批次查询" @click="$goto('BatchList')" />
      </div>
      <div class="flex">
        <TheButton title="证本查询" @click="$goto('docList')" />
      </div> -->
      <div class="flex">
        <TheButton title="查询" @click="$goto('SearchCard', { choose: 1 })" />
      </div>
      <!-- <span class="h-50% w-2px bg-[#8BB2FF]" /> -->
      <div class="flex gap-20">
        <TheButton
          title="设备设置"
          @click="$goto('SetPage', { currentModel: '2' })"
        />
        <TheButton
          title="设备维护"
          @click="$goto('MainTain', { currentModel: '5', isProduce })"
        />
        <TheButton class="absolute right-2vh" title="初始化" @click="init()" />
      </div>
    </div>

    <TheModal
      :open="open"
      :handle-ok="controlMachine"
      :warn-icon="true"
      :handle-cancel="() => setOpen(false)"
      :title="modal"
    />
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { homeModule } from '@/apis/proApi';
import { initMachine } from '@/apis/webApi';
import TheButton from '@/components/base/TheButton.vue';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import CanvasComponent from '@/components/canvas/home.vue';
import TheModal from '@/components/modal/docNumModal.vue';
import { useAppStore } from '@/store/index';
import useCustomTimer from '@/utils/useCustomTimer';
import AddMore from './module/addMore.vue';
import FinishedProductBg from './module/finishedProduct.vue';
import Print from './module/printPage.vue';
import Start from './module/startPage.vue';

const { notification } = App.useApp();

const { start, stop } = useCustomTimer();
const entire = ref({});
const modal = ref('');
const open = ref<boolean>(false);
function setOpen(value: boolean) {
  open.value = value;
}
const canContinue = ref<boolean>(false);
const blankCheck = ref({});
const mainPrint = ref({});
const control = ref(null);
const additionPrint = ref({});
const finishedProduct = ref({});
const isProduce = ref(false);

const rectangles = ref([
  {
    id: 'm1',
    x: 710,
    y: 0,
    width: 230,
    height: 140,
    color: 'rgba(255, 255, 255, 0)',
    opacity: 0.3,
    msg: '',
  },
  // {
  //   id: 'm2',
  //   x: 300,
  //   y: 0,
  //   width: 200,
  //   height: 140,
  //   color: 'rgba(255, 255, 255, 0)',
  //   opacity: 0.3,
  // },
]);

// const addRectangle = () => {
//   const newId = rectangles.value.length + 1;
//   rectangles.value.push({
//     id: newId,
//     x: Math.random() * 500,
//     y: Math.random() * 500,
//     width: 100,
//     height: 50,
//     color: 'green',
//     opacity: 0.5,
//   });
// };

// const deleteRectangleById = (id: number) => {
//   rectangles.value = rectangles.value.filter((rect) => rect.id !== id);
// };

// const modifyRectangleById = (
//   id: number,
//   newX: number,
//   newY: number,
//   newWidth: number,
//   newHeight: number,
// ) => {
//   const index = rectangles.value.findIndex((rect) => rect.id === id);
//   if (index !== -1) {
//     rectangles.value[index] = {
//       ...rectangles.value[index],
//       x: newX,
//       y: newY,
//       width: newWidth,
//       height: newHeight,
//     };
//   }
// };
onActivated(async () => {
  useAppStore().setSpinning(true);
  const end = await getDataPage();
  !end
  && notification.error({
    message: `错误`,
    description: '接口超时',
    placement: 'bottomRight',
    class: 'notification-custom-class',
  });
  useAppStore().setSpinning(false);
  await startGetDataPage();
});
onDeactivated(() => {
  stop();
});
// function formatterStatus(cellValue: any) {
//   const item = TaskStatusOptions.find((item) => item.value === cellValue);
//   return item ? item.label : cellValue;
// }
async function getDataPage() {
  try {
    const data = await homeModule.getHomeList();
    if (data.respData) {
      blankCheck.value = data.respData.blankCheck;
      mainPrint.value = data.respData.mainPrint;
      additionPrint.value = data.respData.additionPrint;
      finishedProduct.value = data.respData.finishedProduct;
      // taskStatus	integer	设备生产任务的状态，0：空闲；1：执行中；2：暂停。
      // machineStatus 0	ready，待机1	working，工作中2	warning，警告 3	error，故障
      if (
        data.respData.entire.taskStatus === 2
        && data.respData.entire.machineRemainDoc !== 0
      ) {
        canContinue.value = true;
      }
      else {
        canContinue.value = false;
      }
      entire.value = data.respData.entire;
      // 错误页面显示处理，目前只有m1,todo--m2m3m4
      if (data.respData.entire.modules.length > 0) {
        // 如果modules里面的uid等于rectangles.id,变成红色
        rectangles.value.forEach((item) => {
          data.respData.entire.modules.forEach((item2) => {
            if (item.id === item2.uid && item2.code !== 0) {
              item.color = 'red';
              item.msg = item2.msg;
            }
            else if (item.id === item2.uid && item2.code === 0) {
              item.color = 'rgba(255, 255, 255, 0)';
              item.msg = '';
            }
          });
        });
      }
      else {
        // 把rectangles里面所有的color都是透明色
        rectangles.value.forEach((item) => {
          item.color = 'rgba(255, 255, 255, 0)';
        });
      }
    }
    if (data.respData) {
      isProduce.value
        // statistics.respData.status !== 0 &&
        = mainPrint.value.status !== 1
          && blankCheck.value.status !== 1
          && additionPrint.value.status !== 1
          && finishedProduct.value.status !== 1;
    }
    return true;

    // startGetDataPage();
  }
  catch (error) {
    error;
    return false;
    // stop();
  }
}

async function startGetDataPage() {
  start(async () => {
    await getDataPage();
  }, 5);
}
const isOpen = ref('');
function setModal(value: number, isOpenIng?: string) {
  control.value = value;
  const title = {
    open: '确认开始进本？',
    continue: '确认继续进本？',
    add: '确认加本？',
  };
  switch (value) {
    case 0:
      isOpen.value = isOpenIng;
      modal.value = title[isOpenIng];
      break;
    case 1:
      modal.value = '确认暂停进本？';
      isOpen.value = isOpenIng;
      break;
    case 2:
      modal.value = '确认暂停设备？';
      break;
    case 3:
      modal.value = '确认启动设备？';
      break;
    default:
      break;
  }
  setOpen(true);
}
async function controlMachine(num: string) {
  let tips = '';
  const title = {
    open: '开始进本',
    continue: '继续进本',
    add: '加本',
  };
  switch (control.value) {
    case 0:
      tips = title[isOpen.value];
      break;
    case 1:
      tips = '暂停进本';
      break;
    case 2:
      tips = '暂停设备';
      break;
    case 3:
      tips = '启动设备';
      break;
    default:
      break;
  }
  try {
    useAppStore().setSpinning(true);
    await homeModule.setControlMachine({
      control: control.value,
      docNum: isOpen.value !== 'continue' ? Number(num) : null,
    });
    console.log('🚀 ~ controlMachine ~ tips:', tips);
    notification.success({
      message: `成功`,
      description: `${tips}操作成功`,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  catch (error) {
    error;
    notification.error({
      message: `错误`,
      description: error,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  finally {
    setOpen(false);
    useAppStore().setSpinning(false);
  }
}

// 初始化
async function init() {
  try {
    useAppStore().setSpinning(true);
    await initMachine({ module: 'm0' });
    notification.success({
      message: `成功`,
      description: `初始化接口调用成功`,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  catch (error) {
    error;
    notification.error({
      message: `成功`,
      description: `初始化接口调用失败`,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  finally {
    useAppStore().setSpinning(false);
  }
}
</script>

<style lang="less">
.siyuan {
  font-family: 'siyuan';
}

.bg {
  background-image: url('../../assets/image/bigScreen/new-bg.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
  .light {
    text-shadow: 0px 0px 8px #ffffff;
  }
  .groupBtn {
    div {
      background-size: 100% 100%;
      background-repeat: 'no-repeat';
    }
  }
}
</style>
