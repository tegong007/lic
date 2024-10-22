<template>
  <div class="bg h-full text-[18px] text-white">
    <TheHeader :is-show-test-btn="true" />
    <TheModal
      :open="open"
      :handle-ok="reset"
      :handle-cancel="handleCancel"
      title="确认停止"
    />
    <div class="content flex justify-between p-[20px]">
      <div
        class="w-[49.5%] flex flex-col border-[4px] border-[#3F89DD] from-[#ffffff44] bg-gradient-to-t"
      >
        <div
          class="title relative z-10 h-[50px] w-full flex items-center justify-between bg-[#fff]/[0.2] pl-[20px] font-bold"
        >
          <span class="text-[20px]"> {{ $t("home.preview") }}</span>
        </div>
        <div
          class="relative h-full w-full flex flex-col items-center justify-evenly"
        >
          <span v-if="titleStatus !== ''" class="text-[50px]">{{
            titleStatus
          }}</span>
          <a-flex justify="center" align="center">
            <span
              v-if="imgIndex === 0"
              class="absolute z-[999] text-[80px] font-bold"
            >
              {{ $t("home.preparePrint") }}</span>
            <a-image
              v-if="imgIndex !== 0"
              :src="imgStatus[imgIndex]"
              :width="480"
              :preview="false"
            />
          </a-flex>
        </div>
      </div>
      <div class="w-[49.5%] flex flex-col justify-between">
        <div
          class="h-[78%] flex flex-col border-[4px] border-[#3F89DD] from-[#ffffff44] bg-gradient-to-t"
        >
          <div
            class="title relative z-10 h-[50px] w-full flex items-center justify-between bg-[#fff]/[0.2] pl-[20px] font-bold"
          >
            <span class="text-[20px]"> {{ $t("home.printInformation") }}</span>
          </div>
          <div
            class="info-box scrollable-box w-full overflow-auto p-[20px] leading-[25px]"
          >
            <div v-for="(item, index) in flowData" :key="index">
              <!-- 结束线 -->
              <div
                v-if="item.status === 'M6-Product'"
                class="mt-[20px] color-gray leading-[55px]"
              >
                ******↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*****已完成以下证本打印流程*****↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓******
              </div>
              <!-- 内容 -->
              <div class="pl-[40px]">
                <span>
                  {{ item.time }} 证本已到达【{{ statusTypes[item.status] }}】
                </span>
                <span v-if="item.ocrData && isIncludes(item.status)">证本已完成OCR识别，结果：<span class="text-amber-100">【{{ item.ocrData }}】</span>
                </span>
                <div>
                  <span v-if="item.readerData && isIncludes(item.status)">证本已完成芯片读取，数据：<span class="text-amber-100">【{{ item.readerData }}】</span>
                  </span>
                </div>

                <div
                  v-if="item.imgData && isIncludes(item.status)"
                  class="py-[10px]"
                >
                  <a-image
                    :width="100"
                    :src="`data:image/png;base64,${item.imgData}`"
                  />
                </div>
              </div>
              <!-- 分割线 -->
              <div
                v-if="getModelStart(item.status) !== ''"
                class="leading-[55px]"
              >
                *********************************************{{
                  getModelStart(item.status)
                }}**************************************************
              </div>
            </div>
          </div>
        </div>
        <div class="h-[20%] w-full flex justify-between">
          <div
            class="printBtn relative h-full w-[63%] flex items-center justify-center"
          >
            <span class="relative text-[50px] font-bold">
              {{ $t("home.printCrtificateBtn") }}</span>
            <div
              :class="
                `${canClick ? 'bg-[#fff]/[0]  cursor-pointer hover:bg-[#fff]/[0.3]  active:bg-[#000]/[0.4]' : 'bg-[#000]/[0.4] pointer-events-none'}`
                  + ' absolute w-full h-full rounded-[1em] '
              "
              @click="startInterval"
            />
          </div>
          <div
            class="stopBtn relative h-full w-[35%] flex items-center justify-center"
          >
            <span class="relative text-[50px] font-bold">
              {{ $t("home.stopBtn") }}</span>
            <div
              :class="
                `${!canClick ? 'bg-[#fff]/[0]  cursor-pointer hover:bg-[#fff]/[0.3]  active:bg-[#000]/[0.4]' : 'bg-[#000]/[0.4] pointer-events-none'}`
                  + ' absolute w-full h-full rounded-[1em] '
              "
              @click="setOpen(true)"
            />
          </div>
        </div>
        <!-- <a-button @click="stopInterval">stop</a-button> -->
      </div>
    </div>
    <context-holder />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useAppStore } from '../store/index';
import TheHeader from '@/components/TheHeader.vue';
import TheModal from '@/components/TheModal.vue';
import { getDocStatus, startOrStopPrintTask } from '@/apis/webApi';
import { throttle } from '@/utils/throttle.js';
import readyImg from '@/assets/image/ready.png';
import defaultImg from '@/assets/image/default.png';
import laser1Img from '@/assets/image/laser1.png';
import laser2Img from '@/assets/image/laser2.png';
import lnkjetImg from '@/assets/image/lnkjet.png';

// defineOptions({ name: "IndexPage" });

definePage({
  name: 'Main',
  meta: {
    title: '首页',
  },
});
interface T {
  time?: string;
  description?: string;
  ocrData?: string;
  readerData?: string;
  status: string;
  imgData?: string;
}
const appStore = useAppStore();
const [contextHolder] = message.useMessage();
const imgStatus = [readyImg, defaultImg, laser1Img, laser2Img, lnkjetImg];
const statusTypes = {
  'M1-Warehouse': '模组一卡仓位',
  'M1-Ready': '模组一发证位',
  'M1-Camera': '模组一摄像位',
  'M2-Reader-1': '模组二读写位1',
  'M2-Reader-2': '模组二读写位2',
  'M2-Reader-3': '模组二读写位3',
  'M2-Obsolete': '模组二废本槽',
  'M2-Laser-1': '模组二激光位1',
  'M2-Laser-2': '模组二激光位2',
  'M2-Laser-3': '模组二激光位3',
  'M2-Camera': '模组二摄像位', // 第一次
  'M3-Reader-1': '模组三读写位1',
  'M3-Reader-2': '模组三读写位2',
  'M3-Reader-3': '模组三读写位3',
  'M3-Laser-1': '模组三激光位1',
  'M3-Laser-2': '模组三激光位2',
  'M3-Laser-3': '模组三激光位3',
  'M3-UV-1': '模组三喷墨位1', // 第二次
  'M3-UV-2': '模组三喷墨位2', // 第二次
  'M3-UV-3': '模组三喷墨位3', // 第二次
  'M3-Camera': '模组三摄像位', // 第三次
  'M4-Turn': '模组四翻页器',
  'M5-Reader-1': '模组五读写位1',
  'M5-Reader-2': '模组五读写位2',
  'M5-Reader-3': '模组五读写位3',
  'M5-UV-1': '模组五喷墨位1', // 第二次
  'M5-UV-2': '模组五喷墨位2', // 第二次
  'M5-UV-3': '模组五喷墨位3', // 第二次
  'M5-Camera': '模组五摄像位',
  'M6-Product': '模组六成品槽', // 结束
  'M6-Obsolete': '模组六废品槽',
};

// 数据流
const flowData = ref<T[]>([]);
const currentObj = ref<T>(); // 当前对象
const canClick = ref(true); // 是否可以点击打印
const intervalRef = ref<number | null>(null); // 定时器
const imgIndex = ref(0); // 当前图片所处于的位置
const titleStatus = ref('');
const open = ref<boolean>(false);

const moduleMap = {
  M1: '模组一',
  M2: '模组二',
  M3: '模组三',
  M4: '模组四',
  M5: '模组五',
  M6: '模组六',
};
const stoping = ref(false);
function handleCancel() {
  setOpen(false);
}
function setOpen(value: boolean) {
  open.value = value;
}
// 获取状态
async function getStatus() {
  if (!stoping.value) {
    try {
      titleStatus.value = '送本中';
      const data = await getDocStatus();
      console.log('🚀 ~ file: index.vue:230 ~ getStatus ~ data:', data);
      const formatData: T = {
        status: `${data?.status}`,
        ocrData: data?.ocrData,
        imgData: data?.imgData,
        readerData: data?.readerData,
      };
      if (JSON.stringify(currentObj.value) !== JSON.stringify(formatData)) {
        currentObj.value = formatData;
        // 左边标题
        if (formatData.status.includes('Camera')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，OCR识别中`;
        }
        else if (formatData.status.includes('Reader')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，读写中`;
        }
        else if (formatData.status.includes('Laser')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，激光雕刻中`;
        }
        else if (formatData.status.includes('UV')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，喷墨打印中`;
        }
        else if (formatData.status.includes('Turn')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，翻页中`;
        }
        else if (formatData.status.includes('Product')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }，已完成证本打印`;
        }
        else if (formatData.status.includes('Obsolete')) {
          titleStatus.value = `${
            moduleMap[formatData.status.match(/M\d+/)[0]] || '未知模组'
          }失败，请重试`;
        }
        // 图片

        if (formatData.status.includes('M1-Warehouse')) {
          imgIndex.value = 1;
        }
        else if (formatData.status.includes('M2-Camera')) {
          imgIndex.value = 2;
        }
        else if (formatData.status.includes('M3-UV')) {
          imgIndex.value = 3;
        }
        else if (formatData.status.includes('M3-Camera')) {
          imgIndex.value = 4;
        }

        const newData: T = {
          time: formatDateTime(),
          status: formatData.status,
          ocrData: formatData.ocrData,
          imgData: formatData.imgData,
          readerData: formatData.readerData,
        };
        flowData.value.unshift(newData);
        if (
          formatData.status === 'M6-Product'
          || formatData.status === 'M6-Obsolete'
        ) {
          await stopInterval();
        }
      }
      stoping.value = false;
    }
    catch (error) {
      error;
      await stopInterval();
      message.error('出错了，请联系管理员');
      stoping.value = true;
    }
    finally {
      appStore.setSpinning(false);
    }
  }
}
//  判断状态
function isIncludes(status: string) {
  return status.includes('Reader') || status.includes('Camera');
}
//  分界线
function getModelStart(status: string) {
  let endStatus = '';
  if (
    status.includes('M2-Reader-1')
    || status.includes('M2-Reader-2')
    || status.includes('M2-Reader-3')
  ) {
    endStatus = '模組一';
  }
  else if (
    status.includes('M3-Reader-1')
    || status.includes('M3-Reader-2')
    || status.includes('M3-Reader-3')
  ) {
    endStatus = '模組二';
  }
  else if (status.includes('M4-Turn')) {
    endStatus = '模組三';
  }
  else if (
    status.includes('M5-Reader-1')
    || status.includes('M5-Reader-2')
    || status.includes('M5-Reader-3')
  ) {
    endStatus = '模組四';
  }
  else if (status.includes('M6-Product') || status.includes('M6-Obsolete')) {
    endStatus = '模組五';
  }
  else {
    endStatus = '';
  }

  return endStatus;
}

//  开始任务后开始定时器
async function startInterval() {
  const startTaskStatus = await startTask();
  if (startTaskStatus) {
    canClick.value = false;
    // 开启定时器，每隔1.5秒访问一次
    intervalRef.value = setInterval(
      throttle(getStatus, 1500),
      1500,
    ) as unknown as number;
  }
}

async function startTask() {
  imgIndex.value = 0;
  stoping.value = false;
  appStore.setSpinning(true);
  try {
    await startOrStopPrintTask({ operate: 1 });
    await startOrStopPrintTask({ operate: 0 });
    return true;
  }
  catch (error) {
    error;
    message.error('执行打印任务失败');
    await stopInterval();
    appStore.setSpinning(false);
  }
  return false;
}

//  清除定时器
async function stopInterval() {
  if (intervalRef.value !== null) {
    appStore.setSpinning(true);
    clearInterval(intervalRef.value);
    try {
      await startOrStopPrintTask({ operate: 1 });
    }
    catch (error) {
      error;
      message.error('任务停止失败');
    }
    finally {
      canClick.value = true;
      intervalRef.value = null;
      titleStatus.value = '';
      currentObj.value = {};
      appStore.setSpinning(false);
    }
  }
}
// 手动停止
async function reset() {
  open.value = false;
  flowData.value = [];
  await stopInterval();
  imgIndex.value = 0;
}

function formatDateTime() {
  const now = new Date();
  const year = now.getFullYear(); // 获取年份
  const month = now.getMonth() + 1; // 获取月份，月份从0开始，所以需要+1
  const day = now.getDate(); // 获取日
  const hours = now.getHours(); // 获取小时
  const minutes = now.getMinutes(); // 获取分钟
  const seconds = now.getSeconds(); // 获取分钟

  // 使用padStart方法确保月份和日期始终是两位数
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // 拼接成指定格式
  const formattedDateTime = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return formattedDateTime;
}

// const formatted = useDateFormat(useNow(), "HH:mm");
</script>

<style scoped lang="less">
.bg {
  background-image: url('../assets/image/bg_dark.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
}

.content {
  height: calc(100vh - 66px);
}
.printBtn {
  background-image: url('../assets/image/printBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
.stopBtn {
  background-image: url('../assets/image/stopBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
.info-box {
  height: calc(100% - 50px);
}
/* 自定义滚动条样式 */
.scrollable-box::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.scrollable-box::-webkit-scrollbar-thumb {
  background-color: #ffffff38;
  border-radius: 6px;
}

.scrollable-box::-webkit-scrollbar-track {
  /* background-color: #f1f1f1; */
  background-image: linear-gradient(to bottom, rgba(0, 140, 255, 0.329) 0%, rgba(255, 255, 255, 0.205) 100%);
  /* border-radius: 6px; */
}

.scrollable-box::-webkit-scrollbar-button {
  display: none;
}
</style>
