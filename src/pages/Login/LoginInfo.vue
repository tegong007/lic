<template>
  <div class="page-root">
    <!-- 虚拟键盘 -->
    <SimpleKeyboard v-if="focus" :transform="transformValue" :input="formData.account" :max-length="20" keyboard-width="w90%" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />

    <!-- 顶部装饰 -->
    <div class="mx-3vw flex justify-between">
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_left.png" />
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_right.png" />
    </div>
    <img class="absolute bottom-0 z-1 h-50vh w-full" src="@/assets/image/ico_bottom.png" />

    <!-- 主内容 -->
    <div class="flex-1 z-2 flex items-center justify-center">
      <div class="card-wrapper">
        <!-- 标题区 -->
        <div class="card-header">
          <img class="header-bg" src="@/assets/image/bg_navBtn.png" />
          <div class="header-content">
            <img src="@/assets/image/ico_success.png" class="header-icon" />
            <span>录入用户信息</span>
          </div>
        </div>

        <!-- 头像区 -->
        <div class="avatar-section">
          <div class="avatar-ring">
            <div class="avatar-inner">
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar-img" alt="头像" />
              <div v-else class="avatar-placeholder">
                <span class="text-2vw text-gray-400">暂无</span>
                <span class="text-1vw text-gray-500">头像</span>
              </div>
            </div>
          </div>
          <div class="text-1.4vw text-white/50 mt-1.5vh">身份证读取信息</div>
        </div>

        <!-- 表单区 -->
        <div class="form-section">
          <!-- 账号 -->
          <div class="form-item">
            <div class="form-label">
              <span class="label-icon">●</span>
              <span>账 号</span>
            </div>
            <a-input v-model:value="formData.account" placeholder="请输入账号（英文或数字）" :maxlength="10" class="form-input" @input="errors.account = ''" @click.stop="onInputFocus($event)" />
            <div v-if="errors.account" class="form-error">{{ errors.account }}</div>
          </div>

          <!-- 身份证号 -->
          <div class="form-item">
            <div class="form-label">
              <span class="label-icon label-icon-disabled">●</span>
              <span>身份证号</span>
            </div>
            <a-input v-model:value="formData.idCard" disabled class="form-input form-input-disabled" />
          </div>

          <!-- 姓名 -->
          <div class="form-item">
            <div class="form-label">
              <span class="label-icon label-icon-disabled">●</span>
              <span>姓 名</span>
            </div>
            <a-input v-model:value="formData.name" disabled class="form-input form-input-disabled" />
          </div>

          <!-- 操作按钮 -->
          <div class="btn-group">
            <a-button class="btn-primary" @click="handleSubmit">
              <span class="btn-text">录入指纹</span>
            </a-button>
            <a-button class="btn-secondary" @click="$goto('LoginPage')">
              <span class="btn-text">返回首页</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
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
  data: string;
  status: 'pending' | 'success' | 'failed';
}

const fingerprints = reactive<FingerprintInfo[]>([
  { data: '', status: 'pending' },
  { data: '', status: 'pending' },
  { data: '', status: 'pending' },
]);

const fingerprintStep = ref(0);

function setModal(value: number) {
  if (value === -1) {
    modal.value = { open: false, title: '', key: -1 };
  }
}

let scanFailed = false;

function startFingerprintScan() {
  const step = fingerprintStep.value;
  if (step > 2) return;

  scanFailed = false;

  modal.value = {
    open: true,
    title: '指纹识别',
    key: -1,
    desc: `请把手指放到采集器上（第${step + 1}次）`,
  };

  start(async () => {
    try {
      const pressedData: any = await loginModule.checkPressed();
      if (pressedData.respData.isPressed === 1) {
        stop();

        const featureData: any = await loginModule.doFeature(step);
        modal.value = {
          open: true,
          title: '指纹识别',
          key: -1,
          desc: '请抬起手指',
        };
        fingerprints[step] = { data: JSON.stringify(featureData.respData), status: 'success' };

        await new Promise((r) => setTimeout(r, 800));

        fingerprintStep.value++;

        if (fingerprintStep.value < 3) {
          startFingerprintScan();
        } else {
          await onAllFingerprintsDone();
        }
      }
    } catch (error) {
      if (scanFailed) return;
      scanFailed = true;
      stop();
      fingerprints[fingerprintStep.value] = { data: '', status: 'failed' };
      setModal(-1);
      router.replace('/login');
      notification.error({ message: '指纹录入失败', description: String(error), placement: 'bottomRight', class: 'notification-custom-class' });
    }
  }, 1);
}

async function onAllFingerprintsDone() {
  try {
    const templateResult: any = await loginModule.compositeTemplate();
    const templateData = templateResult.respData.templateData || '';

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

  if (formData.account.length > 10) {
    errors.account = '账号不能超过10个字符';
    return false;
  }

  return true;
}

function handleSubmit() {
  if (!validate()) return;

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
.page-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ========== 卡片容器 ========== */
.card-wrapper {
  width: 56vw;
  max-width: 840px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========== 标题区 ========== */
.card-header {
  position: relative;
  width: 100%;
  height: 7vh;
  margin-bottom: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .header-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 1vw;
    font-size: 2.2vw;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 0.15em;
  }

  .header-icon {
    width: 3.5vh;
    height: 3.5vh;
  }
}

/* ========== 头像区 ========== */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3vh;
}

.avatar-ring {
  width: 12vh;
  height: 12vh;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #3662ec, #22c0e8, #3662ec);
  box-shadow: 0 0 20px rgba(54, 98, 236, 0.3);

  .avatar-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.15);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a2540, #0d1528);
  }
}

/* ========== 表单区 ========== */
.form-section {
  width: 36vw;
  max-width: 520px;
}

.form-item {
  margin-bottom: 2.5vh;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.6vw;
  margin-bottom: 1vh;
  padding-left: 0.3vw;
  font-size: 1.4vw;
  color: #c8d6e5;
  letter-spacing: 0.08em;

  .label-icon {
    color: #3662ec;
    font-size: 0.6vw;
    line-height: 1;
  }

  .label-icon-disabled {
    color: #4a5e7a;
  }
}

.form-error {
  margin-top: 0.8vh;
  padding-left: 0.3vw;
  font-size: 1.1vw;
  color: #f87171;
}

// 输入框
.form-input {
  height: 5.5vh;
  font-size: 1.3vw;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  transition: all 0.25s;

  &::placeholder {
    color: #5a6078;
  }

  &:focus,
  &:hover {
    border-color: #3662ec;
    background: rgba(54, 98, 236, 0.06);
    box-shadow: 0 0 12px rgba(54, 98, 236, 0.15);
  }
}

.form-input-disabled {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.35);
  cursor: not-allowed;

  &:hover {
    border-color: rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.03);
    box-shadow: none;
  }
}

// Ant Design input 内部样式覆盖
:deep(.form-input .ant-input) {
  background: transparent;
  color: #ffffff;
  font-size: 1.3vw;

  &::placeholder {
    color: #5a6078;
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.35);
  }
}

:deep(.form-input-disabled .ant-input) {
  color: rgba(255, 255, 255, 0.35);
}

/* ========== 按钮区 ========== */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 3vw;
  margin-top: 4vh;
  padding-top: 2vh;
}

.btn-primary {
  height: 5.8vh;
  min-width: 14vw;
  border: none;
  border-radius: 8px;
  font-size: 1.5vw;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #3662ec, #4f7af2);
  box-shadow: 0 4px 16px rgba(54, 98, 236, 0.35);
  transition: all 0.3s;

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(54, 98, 236, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  .btn-text {
    letter-spacing: 0.1em;
  }
}

.btn-secondary {
  height: 5.8vh;
  min-width: 14vw;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1.5vw;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.3s;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  .btn-text {
    letter-spacing: 0.1em;
  }
}
</style>
