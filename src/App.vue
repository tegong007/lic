<template>
  <a-config-provider :locale="locale === 'cn' ? zhCN : enUS">
    <a-app>
      <a-spin :spinning="appStore.spinning" :indicator="indicator" tip="加载中…">
        <div class="bgApp h-100vh pt-4vh font-[siyuan]">
          <TheHeader />
          <router-view v-slot="{ Component, route: curRoute }">
            <transition name="fade">
              <component :is="Component" :key="curRoute.fullPath" />
            </transition>
          </router-view>
          <TheFooter />
        </div>
        <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-ok="onConfirmOk" :handle-cancel="() => (modal = { open: false, title: '', key: -1 })" />
      </a-spin>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
import { App } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { h, watchEffect } from 'vue';
import { homeModule } from '@/apis/proApi';
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';

import { useAppStore } from '@/store';

const appStore = useAppStore();
const locale = ref(zhCN.locale);
const indicator = h(LoadingOutlined, { style: { fontSize: '200px' } });
const modal: any = ref({ open: false, title: '', key: -1 });
const { notification } = App.useApp();

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});

// 弹窗统一确认处理：优先使用 modal.handleOk，否则走 controlMachine
function onConfirmOk() {
  if (modal.value.handleOk) {
    modal.value.handleOk();
  } else {
    controlMachine();
  }
}
// 弹窗操作
async function getDataPage() {
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData) {
      let temp = data.respData.entire; // 当前生产任务
      temp = temp.errorInfo || {};
      if (temp.isShow && modal.value.title === '') modal.value = { open: true, title: '错误弹窗提示', data: temp, key: -1 };
      else if (!temp.isShow && modal.value.title === '错误弹窗提示') modal.value = { open: false, title: '', key: -1 };
    }
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
      notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
    } finally {
      modal.value = { open: false, title: '', key: -1 };
      useAppStore().setSpinning(false);
    }
  }
}

onMounted(async () => {
  // 监听主进程发送的确认退出消息
  window.ipcRenderer.on('confirm-quit', () => {
    // exitShow.value = true;
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
  try {
    const config = await window.electronAPI.getConfig();
    localStorage.setItem('config', JSON.stringify(config));
  } catch {
    localStorage.setItem('config', '{}');
  }
});

onUnmounted(() => {
  window.ipcRenderer.removeAllListeners('confirm-quit'); // 移除监听器
});
</script>

<style scoped lang="less">
* {
  .bgApp {
    background:
      radial-gradient(128% 128% at 50% 0%, #03163e 0%, #03163eff 37%, #3662ec00 99%),
      linear-gradient(264deg, #03163e 1%, #1d3974 98%), linear-gradient(#03163e, #03163e);
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
  }
}
::v-deep(.ant-spin-spinning) {
  position: fixed !important;
  //  top: calc(50% - 300px) !important;
  top: calc(10%) !important;
  font-size: 20px;
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
