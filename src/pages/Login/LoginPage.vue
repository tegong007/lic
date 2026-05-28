<template>
  <div class="w-full">
    <div class="mx-3vw h-full flex justify-between">
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_left.png" />
      <img class="h-6.5vh w-15.3vw" src="@/assets/image/ico_right.png" />
    </div>
    <img class="absolute bottom-0 z-1 h-50vh w-full" src="@/assets/image/ico_bottom.png" />
    <div class="relative top-10vh z-2 flex items-center justify-center">
      <div class="w-80vw rounded-lg py-2vh">
        <!-- 标题 -->
        <div class="mb-3vh text-center text-4vw text-white font-bold tracking-wider">用户登录</div>

        <!-- 两种登录方式 -->
        <div class="mb-5vh flex justify-center gap-15vw">
          <!-- 指纹识别登录 -->
          <div class="relative flex flex-col cursor-pointer cursor-pointer items-center transition-transform duration-300 hover:scale-105" @click="handleLogin('fingerprint')">
            <div class="h-18vh w-16vh flex items-center justify-center">
              <img class="h-18vh w-16vh object-contain" src="@/assets/image/login_left.png" alt="指纹识别" />
            </div>
            <span class="absolute bottom-4vh text-2.5vw text-white">指纹识别登录</span>
          </div>

          <!-- 人脸识别登录 -->
          <div class="relative flex flex-col cursor-pointer cursor-pointer items-center transition-transform duration-300 hover:scale-105" @click="handleLogin('face')">
            <div class="h-18vh w-16vh flex items-center justify-center">
              <img class="h-18vh w-16vh object-contain" src="@/assets/image/login_right.png" alt="人脸识别" />
            </div>
            <span class="absolute bottom-4vh text-2.5vw text-white">人脸识别登录</span>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-center gap-30vw">
          <a-button type="link" class="btn_search" @click="handleEnroll">录入登录信息</a-button>
          <a-button type="link" class="btn_search" @click="handleExit">退出系统</a-button>
        </div>
      </div>
    </div>
    <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-ok="controlMachine" :handle-cancel="() => setModal(-1)" />
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { loginModule } from '@/apis/loginApi';
import TheConfirm from '@/components/TheConfirm.vue';
import router from '@/router';
import useCustomTimer from '@/utils/useCustomTimer';

const { notification } = App.useApp();
const { start, stop } = useCustomTimer();
const modal: any = ref({ open: false, title: '', key: -1 });

// 弹窗控制
function setModal(value: number) {
  if (value === -1) {
    modal.value = { open: false, title: '', key: -1 };
  }
}

function controlMachine() {
  setModal(-1);
  router.push({ path: '/home' });
}

function handleLogin(type: string) {
  if (type === 'fingerprint') {
    modal.value = { open: true, title: '指纹识别', key: -1, desc: '正在进行指纹识别检测…' };
    setTimeout(() => {
      modal.value = { open: true, title: '登录成功', key: -1, desc: '登录成功' };
    }, 2000);
  } else {
    // 人脸识别：打开弹窗并开始轮询
    modal.value = { open: true, title: '人脸识别', desc: '正在进行人脸识别检测…', key: -1 };
    startFaceRecognition();
  }
}

// 人脸识别轮询
async function startFaceRecognition() {
  start(async () => {
    try {
      const data: any = await loginModule.faceRecognition();
      if (data.respData) {
        const { isAlive, isSamePerson } = data.respData;
        // 活体检测和人证对比都通过
        if (isAlive === 1 && isSamePerson === 1) {
          stop();
          modal.value = { open: true, title: '登录成功', desc: '登录成功', key: 0 };
        }
      }
    } catch (error) {
      stop();
      modal.value = { open: false, title: '', key: -1 };
      notification.error({ message: '人脸识别失败', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
    }
  }, 1.5);
}

function handleEnroll() {
  notification.info({ message: '录入登录信息', description: '录入登录信息功能待对接', placement: 'bottomRight', class: 'notification-custom-class' });
}

function handleExit() {
  window.electron.send('quit-app');
}

onUnmounted(() => {
  stop();
});
</script>
