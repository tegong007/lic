<template>
  <div class="w-full">
    <SimpleKeyboard v-if="focus" :transform="transformValue" :input="formData.account" :max-length="20" keyboard-width="w90%" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="mx-3vw h-full flex justify-between">
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_left.png" />
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_right.png" />
    </div>
    <img class="absolute bottom-0 z-1 h-50vh w-full" src="@/assets/image/ico_bottom.png" />
    <div class="relative top-0vh z-2 flex items-center justify-center">
      <div class="w-80vw rounded-lg py-2vh">
        <!-- 标题 -->
        <div class="relative mb-3vh flex items-center justify-center text-center">
          <img src="@/assets/image/ico_success.png" alt="" class="absolute left-10vw h-4vh w-4vh" />
          <span class="text-4vw text-white font-bold tracking-wider"> 请录入用户信息</span>
        </div>

        <!-- 头像 -->
        <div class="mb-2vh flex justify-center">
          <div class="h-18vh w-18vh overflow-hidden border-2 border-white rounded-full">
            <img v-if="formData.avatar" :src="formData.avatar" class="h-full w-full object-cover" alt="头像" />
            <div v-else class="h-full w-full flex items-center justify-center bg-gray-600 text-3vw text-white">暂无头像</div>
          </div>
        </div>

        <!-- 表单 -->
        <div class="mx-auto w-70vw">
          <!-- 账号 -->
          <div class="mb-3vh">
            <div class="mb-1vh pl-1vw text-3vw text-white">账号</div>
            <a-input v-model:value="formData.account" placeholder="请输入账号（英文或数字）" :maxlength="30" class="form-input" @input="errors.account = ''" @click.stop="onInputFocus($event)" />
            <div v-if="errors.account" class="mt-1vh pl-1vw text-2.5vw text-red-400">{{ errors.account }}</div>
          </div>

          <!-- 身份证号 -->
          <div class="mb-3vh">
            <div class="mb-1vh pl-1vw text-3vw text-white">身份证号</div>
            <a-input v-model:value="formData.idCard" disabled class="form-input form-input-disabled" />
          </div>

          <!-- 姓名 -->
          <div class="mb-3vh">
            <div class="mb-1vh pl-1vw text-3vw text-white">姓名</div>
            <a-input v-model:value="formData.name" disabled class="form-input form-input-disabled" />
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-center gap-2vw pt-5vh">
            <a-button class="btn_submit transition-transform duration-300 hover:scale-105" @click="handleSubmit">确定并录入指纹</a-button>
            <a-button class="btn_submit transition-transform duration-300 hover:scale-105" @click="$goto('LoginPage')">返回登录页</a-button>
          </div>
        </div>
      </div>
    </div>
    <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-cancel="() => setModal(-1)" />
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { loginModule } from '@/apis/loginApi';
import { recordUserInfo } from '@/apis/webApi';
import TheConfirm from '@/components/TheConfirm.vue';
import useCustomTimer from '@/utils/useCustomTimer';

const { notification } = App.useApp();
const route = useRoute();
const router = useRouter();
const { start, stop } = useCustomTimer();
const focus = ref(false);
const cursorPosition = ref(null);
const transformValue: any = ref(null);
interface FormData {
  account: string;
  idCard: string;
  name: string;
  avatar: string;
}

const formData = reactive<FormData>({
  account: '',
  idCard: '',
  name: '',
  avatar: '',
});

const errors = reactive({
  account: '',
});

const modal: any = ref({ open: false, title: '', key: -1 });

// 三枚指纹信息
interface FingerprintInfo {
  data: string; // 指纹数据（后续接口返回）
  status: 'pending' | 'success' | 'failed';
}

const fingerprints = reactive<FingerprintInfo[]>([
  { data: '', status: 'pending' },
  { data: '', status: 'pending' },
  { data: '', status: 'pending' },
]);

const fingerprintStep = ref(0); // 当前录入第几枚指纹 (0/1/2)

function setModal(value: number) {
  if (value === -1) {
    modal.value = { open: false, title: '', key: -1 };
  }
}

// 开始录入一枚指纹
function startFingerprintScan() {
  const step = fingerprintStep.value;
  if (step > 2) return;

  modal.value = {
    open: true,
    title: '指纹识别',
    key: -1,
    desc: `请把手指放到采集器上（第${step + 1}次）`,
  };

  // 每秒轮询 checkPressed
  start(async () => {
    try {
      const pressedData: any = await loginModule.checkPressed();
      if (pressedData.respData.isPressed === 1) {
        stop();

        const featureData: any = await loginModule.doFeature(step);
        // 提示用户抬起手指，同时调用 doFeature 记录指纹
        modal.value = {
          open: true,
          title: '指纹识别',
          key: -1,
          desc: '请抬起手指',
        };
        fingerprints[step] = { data: JSON.stringify(featureData.respData), status: 'success' };

        // 让用户看清「请抬起手指」停留片刻再进入下一步
        await new Promise(r => setTimeout(r, 800));

        // setModal(-1);
        fingerprintStep.value++;

        if (fingerprintStep.value < 3) {
          // 继续下一枚
          startFingerprintScan();
        } else {
          // 三枚全部完成，合成模板
          await onAllFingerprintsDone();
        }
      }
    } catch (error) {
      stop();
      fingerprints[fingerprintStep.value] = { data: '', status: 'failed' };
      setModal(-1);
      router.replace('/login');
      notification.error({ message: '指纹录入失败', description: String(error), placement: 'bottomRight', class: 'notification-custom-class' });
    }
  }, 1);
}

// 三枚指纹全部录入完成，合成模板
async function onAllFingerprintsDone() {
  try {
    const templateResult: any = await loginModule.compositeTemplate();
    const templateData = templateResult.respData.templateData || '';

    // 调用录入接口
    await recordUserInfo({
      account: formData.account,
      name: formData.name,
      idNumber: formData.idCard,
      headshot: formData.avatar,
      fingerprint1: templateData,
    });
    notification.success({ message: '录入完成', description: '用户信息录入成功', placement: 'bottomRight', class: 'notification-custom-class' });
    router.replace('/login');
  } catch (error) {
    setModal(-1);
    router.replace('/login');
    notification.error({ message: '录入失败', description: String(error), placement: 'bottomRight', class: 'notification-custom-class' });
  }
}

function validate(): boolean {
  errors.account = '';

  if (!formData.account.trim()) {
    errors.account = '请输入账号';
    return false;
  }

  if (!/^[a-z0-9]+$/i.test(formData.account)) {
    errors.account = '账号只能包含英文或数字';
    return false;
  }

  if (formData.account.length > 30) {
    errors.account = '账号不能超过30个字符';
    return false;
  }

  return true;
}

function handleSubmit() {
  if (!validate()) return;

  // 校验通过，开始录入三枚指纹
  fingerprintStep.value = 0;
  fingerprints.forEach((f: FingerprintInfo) => {
    f.data = '';
    f.status = 'pending';
  });
  startFingerprintScan();
}

onMounted(async () => {
  if (route.query.sIDNumber) {
    formData.idCard = (route.query.sIDNumber as string) || '';
    formData.name = (route.query.sName as string) || '';
    formData.avatar = (route.query.sPhoto as string) || '';
  }
});

onUnmounted(() => {
  stop();
});

function hideKeyboard() {
  focus.value = false;
}

function onInputFocus(event: any) {
  focus.value = true;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  console.log('🚀 ~ onInputFocus ~ top:', top);
  // transformValue.value = [-200, top - 280];
  transformValue.value = [0, 200];
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  formData.account = input;
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
.form-input {
  height: 4.5vh;
  font-size: 3vw;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border-radius: 4px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus,
  &:hover {
    border-color: #3662ec;
    box-shadow: 0 0 4px rgba(54, 98, 236, 0.5);
  }
}

.form-input-disabled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.btn_submit {
  background: #3662ec;
  border: 0;
  color: #ffffff;
  width: 55vw;
  font-size: 3.5vw;
  height: 5vh;
  border-radius: 4px;

  &:hover {
    color: #ffffff;
  }
}
</style>
