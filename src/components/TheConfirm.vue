<template>
  <a-modal width="78.3vw" :get-container="false" :open="props.open" :closable="false" centered force-render>
    <SimpleKeyboard v-if="focus && props.title === '补打备注'" :transform="transformValue" :input="text" :max-length="20" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <SimpleKeyboard v-if="focus && props.title === '开始进本'" :transform="transformValue" layout="num" :input="text" :max-length="20" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <template v-if="props.title === '补打备注'">
      <div class="w-full pb-2vh pt-6vh text-center text-4.5vw color-#ffffff">{{ `${props.title}前请输入证本号` }}</div>
      <a-input v-model:value="text" :class="focus ? 'keyInput' : ''" class="mx-auto mb-4vh block w-95% text-4.5vw" placeholder="请输入证本号" :maxlength="15" @click.stop="onInputFocus($event)" />
    </template>
    <template v-else-if="props.title === '开始进本'">
      <div class="w-full pb-0vh pt-2vh text-center text-4.5vw color-#ffffff">{{ `${props.title}前请输入进本数` }}</div>
      <div class="w-full pb-2vh pt-0vh text-center text-3.5vw color-#ffffff">{{ `(范围1~${props.desc})` }}</div>
      <a-input v-model:value="text" :class="focus ? 'keyInput' : ''" class="mx-auto mb-4vh block w-95% text-4.5vw" placeholder="请输入进本数" :maxlength="15" @click.stop="onInputFocus($event)" />
    </template>
    <template v-else-if="props.title === '任务添加成功'">
      <div class="w-full pb-6vh pt-7vh text-center text-1.2vw color-#ffffff">{{ props.title }}</div>
      <div class="text-1vw text-#ffffff">
        <div class="mx-auto w-60% pb-2vh">任务号: {{ props.data.batchID }}</div>
        <div class="mx-auto w-60% pb-2vh">批次号: {{ props.data.taskID }}</div>
        <div class="mx-auto w-60% pb-2vh">总人数: {{ props.data.totalPeopleNum }}</div>
      </div>
    </template>
    <template v-else-if="props.title === '喷墨机状态'">
      <div class="w-full pb-6vh pt-7vh text-center text-1.2vw color-#ffffff">{{ props.title }}</div>
      <div class="mx-auto w-90% pb-6vh text-1vw text-#ffffff">{{ props.desc }}</div>
    </template>
    <template v-else-if="props.title === '错误弹窗提示'">
      <div class="w-full pb-3vh pt-4vh text-center text-5.2vw color-#ffffff">{{ props.data ? props.data.title : '--' }}</div>
      <div class="mx-auto h-20vh w-90% overflow-auto text-4vw text-#ffffff">{{ props.data ? props.data.msg : '--' }}</div>
    </template>
    <template v-else-if="props.title === '指纹识别' || props.title === '身份证识别'">
      <div class="h-28vh w-98% flex flex-col items-center justify-center pt-2vw">
        <div v-if="props.title === '指纹识别'" class="h-15vh w-40vw flex items-center justify-center"><div class="fingerprint h-10vh w-10vh"></div></div>
        <div v-else class="idCard h-15vh w-40vw"></div>
        <div class="absolute bottom--9vh text-center text-4vw text-#ffffff">{{ props.desc }}</div>
      </div>
    </template>
    <template v-else-if="props.title === '人脸识别'">
      <div class="h-28vh w-98% flex items-center justify-center pt-2vw">
        <img :src="cameraSrc" class="h-28vh w-full object-contain" alt="摄像头视频流" />
        <!-- 状态提示 -->
        <div class="absolute left-0 right-0 top-[calc(100%+5vh)] text-center text-4vw" :class="faceStatus.includes('失败') || faceStatus.includes('连接') ? 'text-#ff4d4f' : 'text-#ffffff'">{{ faceStatus || props.desc }}</div>
      </div>
    </template>
    <template v-else-if="props.title === '登录成功'">
      <div class="h-20vh w-98% flex flex-col items-center justify-center gap-1vh">
        <img src="@/assets/image/ico_success.png" class="h-10vh w-full object-contain" alt="" />
        <div class="text-center text-4vw text-#ffffff">{{ props.desc }}</div>
        <div class="text-center text-3vw text-#ffffff">用户:{{ account }}</div>
      </div>
    </template>

    <div v-else class="w-full pb-5vh pt-6vh text-center text-4.5vw color-#ffffff">{{ `确定执行${props.title}？` }}</div>
    <template #footer>
      <a-flex v-if="props.title === '错误弹窗提示'" justify="center" align="center" class="gap-5%">
        <template v-if="data && data.type === 10">
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('停止进本')">停止进本</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('已放本')">已放本</a-button>
        </template>
        <template v-else-if="data && data.isRetry">
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('重试')">重试</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('继续任务')">继续任务</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('停止进本')">停止进本</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('暂停设备')">暂停设备</a-button>
        </template>
        <template v-else>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('继续任务')">继续任务</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('停止进本')">停止进本</a-button>
          <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('暂停设备')">暂停设备</a-button>
        </template>
      </a-flex>
      <a-flex v-else-if="props.title === '指纹识别' || props.title === '人脸识别' || props.title === '身份证识别'" justify="center" align="center" class="gap-5%">
        <a-button class="btn mt2vh transition-transform duration-300 hover:scale-105" @click="handleCancel">取消</a-button>
      </a-flex>
      <a-flex v-else-if="props.title === '登录成功'" justify="center" align="center" class="gap-5%">
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="handleLoginSuccessOk">{{ loginSuccessBtnText }}</a-button>
      </a-flex>
      <a-flex v-else justify="center" align="center" class="gap-10%">
        <a-button v-if="props.title !== '任务添加成功' && props.title !== '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="handleCancel">取消</a-button>
        <a-button v-if="props.title === '补打备注' || props.title === '开始进本'" class="btn transition-transform duration-300 hover:scale-105" @click="submitOK">确定</a-button>
        <a-button v-else-if="props.title === '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="handleCancel">确定</a-button>
        <a-button v-else class="btn transition-transform duration-300 hover:scale-105" @click="handleOk">确定</a-button>
        <a-button v-if="props.title === '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="clearData">清除喷墨日志</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { homeModule } from '@/apis/proApi';
import { useCamera } from '@/plugins/useCamera';
import { useAppStore } from '@/store/index';
import { ensureInRange } from '@/utils/index';

const props = defineProps({ open: Boolean, handleOk: Function, title: String, handleCancel: Function, data: Object, desc: String });
const emit = defineEmits(['cameraReady', 'faceCaptured']);

const router = useRouter();
const account = ref('');
// 登录成功倒计时
const loginSuccessCountdown = ref(5);
const loginSuccessBtnText = computed(() => `进入主页(${loginSuccessCountdown.value}s)`);

let loginSuccessTimer: number | undefined;

// ---- 摄像头（CameraHelperWS WebSocket 方案） ----
const { cameraSrc, startPreview, stopCamera, faceStatus, capturedImage, checkLive } = useCamera();
const isCheckLiving = ref(false); // 是否正在循环采集（用于控制重试）

watch(
  [() => props.open, () => props.title],
  ([newOpen, newTitle]) => {
    // 清理旧定时器
    if (loginSuccessTimer) {
      clearInterval(loginSuccessTimer);
      loginSuccessTimer = undefined;
    }

    if (newOpen && newTitle === '登录成功') {
      account.value = localStorage.getItem('account');
      loginSuccessCountdown.value = 5;

      loginSuccessTimer = setInterval(() => {
        loginSuccessCountdown.value--;
        if (loginSuccessCountdown.value <= 0) {
          clearInterval(loginSuccessTimer);
          loginSuccessTimer = undefined;
          handleLoginSuccessOk();
        }
      }, 1000);
    }

    // 摄像头
    if (newOpen && newTitle === '人脸识别') {
      faceStatus.value = '正在连接摄像头…';
      capturedImage.value = '';
      isCheckLiving.value = true;
      startPreview()
        .then(() => {
          emit('cameraReady');
          return retryCheckLive();
        })
        .then((base64: string) => {
          emit('faceCaptured', base64);
        })
        .catch((err: Error) => {
          isCheckLiving.value = false; // 致命错误，停止重试
          faceStatus.value = `${err.message}`;
          console.warn('[TheConfirm] 人脸采集失败:', err);
        });
    } else if (newTitle !== '人脸识别') {
      isCheckLiving.value = false;
      stopCamera();
    }
  },
  { immediate: true },
);
function handleLoginSuccessOk() {
  if (loginSuccessTimer) {
    clearInterval(loginSuccessTimer);
    loginSuccessTimer = undefined;
  }
  router.push('/home');
}

onUnmounted(() => {
  isCheckLiving.value = false;
  if (loginSuccessTimer) {
    clearInterval(loginSuccessTimer);
    loginSuccessTimer = undefined;
  }
});

/** 循环重试活体检测，直到成功或弹窗关闭 */
async function retryCheckLive(): Promise<string> {
  while (isCheckLiving.value) {
    try {
      return await checkLive();
    } catch {
      // 采集失败（102 或其他），faceStatus 已自动更新，
      // 等待 1秒让用户看到提示，然后自动重试
      if (isCheckLiving.value) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  throw new Error('采集已取消');
}

const text = ref(props.desc || '');
const focus = ref(false);
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const { notification } = App.useApp();

async function submitOKHandel(key: string) {
  try {
    useAppStore().setSpinning(true);
    let temp = 0;
    if (key === '继续任务') temp = 0;
    else if (key === '停止进本') temp = 1;
    else if (key === '暂停设备') temp = 2;
    else if (key === '已放本') temp = 3;
    else if (key === '重试') temp = 4;
    await homeModule.errorHandle({ type: props.data.type, position: props.data.position, operate: temp });
    notification.success({ message: '成功', description: `${key}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
    if (props.handleCancel) props.handleCancel();
  }
}

async function submitOK() {
  if (props.title === '开始进本') {
    if (text.value) {
      if (!ensureInRange(text.value, props.desc)) {
        notification.error({ message: '错误', description: '进本数不在有效范围', placement: 'bottomRight', class: 'notificationE-custom-class' });
      } else {
        try {
          useAppStore().setSpinning(true);
          await homeModule.setControlMachine({ control: 0, docNum: Number(text.value) });
          notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
        } catch (error) {
          notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
        } finally {
          useAppStore().setSpinning(false);
          if (props.handleCancel) props.handleCancel();
        }
      }
    } else {
      notification.error({ message: '错误', description: '请先输入进本数', placement: 'bottomRight', class: 'notificationE-custom-class' });
    }
  } else {
    if (text.value) {
      try {
        useAppStore().setSpinning(true);
        await homeModule.printObsv({ docID: text.value });
        notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
      } catch (error) {
        notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
      } finally {
        useAppStore().setSpinning(false);
        if (props.handleCancel) props.handleCancel();
      }
    } else {
      notification.error({ message: '错误', description: '请先输入证本号', placement: 'bottomRight', class: 'notificationE-custom-class' });
    }
  }
}

async function clearData() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await homeModule.getHomeList();
    if (data.respData.entire && data.respData.entire.uvStatus && data.respData.entire.uvStatus[0]) await homeModule.clearLog({ uid: data.respData.entire.uvStatus[0].uid });
    notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
    if (props.handleCancel) props.handleCancel();
  }
}

function hideKeyboard() {
  focus.value = false;
}

function onInputFocus(event: any) {
  focus.value = true;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  transformValue.value = [0, top - 280];
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  text.value = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}
</script>

<style scoped lang="less">
.btn {
  background: #3662ec;
  border: 0;
  color: #ffffff;
  width: 21.8vw;
  font-size: 2.5vw;
  height: 4vh;
  border-radius: 2px;
  &:hover {
    color: #ffffff;
  }
}
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 30.6vh;
  background-color: #03163e;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
.fingerprint {
  background-image: url('@/assets/image/fingerprint.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.idCard {
  background-image: url('@/assets/image/idCard.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.face {
  background-image: url('@/assets/image/face.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
