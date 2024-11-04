<template>
  <div class="relative w-full flex flex-col text-white">
    <div class="relative border-b-[2px] border-[#7C9FCA] pl-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white"> {{ $t("moduleForm.requsetParams") }}</span>
      </a-typography-title>
      <a-flex>
        <a-form
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :rules="rules"
          :wrapper-col="wrapperCol"
          label-align="left"
          class="relative ml-[20px] mt-[20px] w-[60%] text-[18px] text-white"
        >
          <a-form-item :label="t('transderModule.testModal')" name="module">
            <a-select
              v-model:value="formState.module"
              :placeholder="t('transderModule.testModalPla')"
              @change="handleChange"
            >
              <a-select-option
                v-for="(item, index) in transferOptions"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="relative left-[-12em] mb-20px flex items-end justify-between">
          <!-- <a-button type="primary" class="" size="large" @click="onSubmit">
            {{ $t("transderModule.initBtn") }}
          </a-button> -->
          <a-button
            size="large"
            :disabled="!canClick"
            :class="`${!canClick ? '' : 'bg-[#fff]! text-black! border-0!'}`"
            @click="startInterval"
          >
            {{ $t("transderModule.startBtn") }}
          </a-button>
          <!-- <a-button size="large" @click="onSubmit">
            {{ $t("transderModule.pauseBtn") }}
          </a-button> -->
          <a-button
            type="primary"
            class="ml15px"
            danger
            size="large"
            :disabled="canClick"
            :class="`${!canClick ? '' : 'bg-[#ff4d4f]! text-white! border-0!'}`"
            @click="setOpen(true)"
          >
            {{ $t("transderModule.stopBtn") }}
          </a-button>
        </div>
      </a-flex>
      <!-- <div class="absolute right-[20px] top-0">
        <a-button type="primary" class="" @click="onSubmit"> 测试 </a-button>
      </div> -->
    </div>
    <div class="relative p-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white"> {{ $t("moduleForm.returnData") }}</span>
      </a-typography-title>
      <InfoLog ref="infoRef" :flow-data="flowData" />
    </div>
    <context-holder />
    <TheModal :open="open" :handle-ok="reset" :handle-cancel="handleCancel" title="确认停止" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { NotificationPlacement } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../store/index';
import InfoLog from '@/pages/Info/index.vue';
import { getDocStatus, getLineRun } from '@/apis/webApi';
import { throttle } from '@/utils/throttle.js';

const infoRef = ref<InstanceType<typeof InfoLog> | null>(null);
interface T {
  time?: string;
  ocrData?: string;
  readerData?: string;
  status: string;
  imgData?: string;
  error?: boolean; // 任务失败的标识
  showDivider?: string; // 分界线的标识
  stop?: boolean; // 用户手动停止
}
const [api, contextHolder] = notification.useNotification();
const openNotify = (placement: NotificationPlacement, msg: any) => openNotification(placement, msg);
function openNotification(placement: NotificationPlacement, msg: any) {
  api.error({
    message: '错误信息',
    description: ` ${msg}`,
    placement,
  });
}
const { t } = useI18n();
const canClick = ref(true); // 是否可以点击打印
const intervalRef = ref<number | null>(null); // 定时器
const flowData = ref<T[]>([]); // 数据流
const currentObj = ref<T>(); // 当前对象
const stoping = ref(false);

const open = ref<boolean>(false);
function handleCancel() {
  setOpen(false);
}
function setOpen(value: boolean) {
  open.value = value;
}

// 手动停止
async function reset() {
  open.value = false;
  await stopInterval();
  flowData.value.unshift({ status: 'stop', stop: true });
}

const transferOptions = [
  { label: `全部`, value: 0 },
  { label: `${t('moduleTest.module')}1`, value: 1 },
  { label: `${t('moduleTest.module')}2`, value: 2 },
  { label: `${t('moduleTest.module')}3`, value: 3 },
  { label: `${t('moduleTest.module')}4`, value: 4 },
  { label: `${t('moduleTest.module')}5`, value: 5 },
  { label: `${t('moduleTest.module')}6`, value: 6 },
];
const appStore = useAppStore();
interface FormState {
  module: string | undefined;
}

const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };
const formState: UnwrapRef<FormState> = reactive({
  module: 0,
});

const rules: Record<string, Rule[]> = {
  module: [{ required: true, message: t('transderModule.testModalPla'), trigger: 'change' }],
};
function handleChange() {
  // dataRef.value.resetFields();
}

//  开始任务调度
async function startTask(status: number) {
  appStore.setSpinning(true);
  if (status === 0)
    stoping.value = false;
  const params = {
    module: formState.module,
    operate: status,
  };
  try {
    await getLineRun(params);
    return true;
  }
  catch (error) {
    error;
    openNotify('bottomRight', '执行走本任务失败');
    await stopInterval();
    appStore.setSpinning(false);
  }
  return false;
}

//  开始任务后开始定时器
async function startInterval() {
  flowData.value = [];
  const startTaskStatus = await startTask(0);
  if (startTaskStatus) {
    canClick.value = false;
    // 开启定时器，每隔1.5秒访问一次
    intervalRef.value = setInterval(throttle(getStatus, 1500), 1500) as unknown as number;
  }
}

//  清除定时器
async function stopInterval() {
  if (intervalRef.value !== null) {
    clearInterval(intervalRef.value);
    try {
      await startTask(1);
    }
    catch (error) {
      error;
      openNotify('bottomRight', '任务停止失败');
    }
    finally {
      currentObj.value = {};
    }
  }
}

// 获取证本状态接口
async function getStatus() {
  if (!stoping.value) {
    try {
      const data = await getDocStatus();
      const formatData: T = {
        status: `${data?.status}`,
        ocrData: data?.ocrData,
        imgData: data?.imgData,
        readerData: data?.readerData,
      };

      if (JSON.stringify(currentObj.value) !== JSON.stringify(formatData)) {
        currentObj.value = JSON.parse(JSON.stringify(formatData)); // 深拷贝，只拷贝当前的
        // 分割线
        if (
          flowData.value.length
          && flowData.value[0]?.status.match(/M\d+/)[0] !== formatData.status.match(/M\d+/)[0]
        ) {
          formatData.showDivider = moduleMap[flowData.value[0]?.status.match(/M\d+/)[0]];
        }

        // 数据流
        const newData: T = {
          time: formatDateTime(),
          status: formatData.status,
          ocrData: formatData.ocrData,
          imgData: formatData.imgData,
          readerData: formatData.readerData,
          showDivider: formatData.showDivider,
        };
        flowData.value.unshift(newData);

        // 流程正常结束
        if (formatData.status === 'M6-Product' || formatData.status === 'M6-Obsolete') {
          await stopInterval();
        }
      }

      stoping.value = false;
    }
    catch (error) {
      await stopInterval();
      openNotify('bottomRight', error);
      flowData.value.unshift({ status: 'error', error: true });
      stoping.value = true;
    }
    finally {
      appStore.setSpinning(false);
    }
  }
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
</script>

<style scoped lang="less">
::v-deep(.ant-form-item) {
  label {
    color: #fff !important;
  }
}
::v-deep(.ant-descriptions-view) {
  background: #fff;
}
::v-deep(.ant-spin-spinning) {
  position: absolute !important;
  top: calc(50% - 300px) !important;
  left: -100px !important;
  z-index: 999999999999999999999;
}
</style>
