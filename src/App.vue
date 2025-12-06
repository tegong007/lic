<template>
  <a-config-provider :locale="locale === 'cn' ? zhCN : enUS">
    <a-app>
      <a-spin :spinning="appStore.spinning" :indicator="indicator" tip="加载中…">
        <div class="bg relative h-100vh flex flex-col items-center">
          <Header />
          <router-view v-slot="{ Component, route: curRoute }">
            <transition name="fade">
              <component :is="Component" :key="curRoute.fullPath" />
            </transition>
          </router-view>
          <Footer />
        </div>
        <TheExit v-if="exitShow" :open="exitShow" :handle-ok="() => openExitModal(false)" :handle-cancel="() => openExitModal(false)" title="退出系统" />
      </a-spin>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { h, watchEffect } from 'vue';
import TheExit from '@/components/TheExit.vue';
import Footer from '@/components/TheFooter.vue';
import Header from '@/components/TheHeader.vue';

import { useAppStore } from '@/store';

const appStore = useAppStore();
const locale = ref(zhCN.locale);
const indicator = h(LoadingOutlined, { style: { fontSize: '200px' } });
const exitShow = ref(false);

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});

// 弹窗操作
function openExitModal(value: boolean) {
  exitShow.value = value;
}

onMounted(() => {
  // 监听主进程发送的确认退出消息
  window.ipcRenderer.on('confirm-quit', () => {
    exitShow.value = true;
  });
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
