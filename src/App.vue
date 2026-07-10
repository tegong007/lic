<template>
  <a-config-provider :locale="locale === 'cn' ? zhCN : enUS">
    <a-app>
      <a-spin :spinning="appStore.spinning" :indicator="indicator" tip="加载中…">
        <div class="bg relative h-100vh flex flex-col items-center">
          <Header v-if="isMainPage" />
          <router-view v-slot="{ Component, route: curRoute }">
            <transition name="fade">
              <component :is="Component" :key="curRoute.fullPath" />
            </transition>
          </router-view>
          <Footer v-if="isMainPage" />
        </div>

        <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-ok="modal.handleOk || controlMachine" :handle-cancel="() => (modal = { open: false, title: '', key: -1 })" />
      </a-spin>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
import { App } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { computed, h, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { homeModule } from '@/apis/proApi';
import Footer from '@/components/TheFooter.vue';
import Header from '@/components/TheHeader.vue';

import { useAppStore } from '@/store';

const appStore = useAppStore();
const route = useRoute();
const locale = ref(zhCN.locale);
const indicator = h(LoadingOutlined, { style: { fontSize: '200px' } });
const modal: any = ref({ open: false, title: '', key: -1 });
const { notification } = App.useApp();

const isMainPage = computed(() => {
  const mainRoutes = ['/home', '/home-station', '/check', '/check-select', '/defend', '/set', '/search'];
  return mainRoutes.includes(route.path);
});

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});

async function getDataPage() {
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData) {
      let temp = data.respData.entire; // 当前生产任务
      temp = temp.errorInfo || {};
      if (temp.isShow && modal.value.title === '') modal.value = { open: true, title: '错误弹窗提示', data: temp, key: -1 };
      else if (!temp.isShow && modal.value.title === '错误弹窗提示') modal.value = { open: false, title: '', key: -1 };
    }
  } catch {
    // modal.value = { open: true, title: '错误弹窗提示', data: '123', key: -1 };
  } finally {
    setTimeout(() => {
      getDataPage();
    }, 2000);
  }
}
async function controlMachine() {
  if (modal.value.key === 5) {
    modal.value = { open: false, title: '', key: -1 };
  } else {
    try {
      useAppStore().setSpinning(true);
      /* control-证本操作（0-开始/继续 进本；1-暂停进本；2-暂停设备；3-启动设备） */
      await homeModule.setControlMachine({ control: modal.value.key, docNum: null });
      notification.success({ message: '成功', description: `${modal.value.title}操作成功`, placement: 'bottomRight', class: 'notification-custom-class' });
    } catch (error) {
      notification?.error?.({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
    } finally {
      modal.value = { open: false, title: '', key: -1 };
      useAppStore().setSpinning(false);
    }
  }
}

onMounted(() => {
  // 监听主进程发送的确认退出消息
  window.ipcRenderer.on('confirm-quit', () => {
    modal.value = {
      open: true,
      title: '退出系统',
      key: -1,
      handleOk: () => {
        modal.value = { open: false, title: '', key: -1 };
        window.electron.send('quit-app');
      },
    };
  });
  getDataPage();
});

onUnmounted(() => {
  window.ipcRenderer.removeAllListeners('confirm-quit'); // 移除监听器
});
</script>

<style scoped lang="less">
* {
  user-select: none;
  color: #ffffff;
  .bg {
    background: url('@/assets/image/bg.png') center;
    background-size: 100% 100%;
    position: relative;
    min-height: 100vh;
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
      position: absolute;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
    .fade-enter-to,
    .fade-leave-from {
      opacity: 1;
    }
    router-view {
      display: block;
      width: 100%;
      flex: 1;
      position: relative;
    }
  }
}
::v-deep(.ant-spin-spinning) {
  position: fixed !important;
  top: calc(50% - 300px) !important;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-dot {
    margin-top: -70px !important;
    margin-left: -100px !important;
  }
  .ant-spin-text {
    text-shadow: unset;
  }
}
::v-deep(.ant-spin-blur::after) {
  background-color: #000000;
}
::v-deep(.ant-spin-spinning) {
  transform: translate3d(0, 0, 0);
  will-change: transform;
}
</style>
