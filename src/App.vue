<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { h, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import SuceessModal from '@/pages/bigScreen/mainTain/version/checkPwModal.vue';
import { useAppStore } from './store';
// import enUS from "ant-design-vue/es/locale/en_US";
const appStore = useAppStore();
const { t } = useI18n();
watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});
const locale = ref(zhCN.locale);
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '200px',
  },
  // spin: true,
});
const checkPwOpen = ref<boolean>(false);
function setcheckPwOpen(value: boolean) {
  checkPwOpen.value = value;
}

onMounted(() => {
  // 监听主进程发送的确认退出消息
  window.ipcRenderer.on('confirm-quit', () => {
    checkPwOpen.value = true;
  });
});

onUnmounted(() => {
  // 移除监听器
  window.ipcRenderer.removeAllListeners('confirm-quit');
});
</script>

<template>
  <a-config-provider
    :locale="locale === 'en' ? enUS : zhCN"
    :theme="{
      token: {
        fontSize: 16, //会击穿button的样式
      },
    }"
  >
    <a-app>
      <a-spin
        :spinning="appStore.spinning"
        :indicator="indicator"
        :tip="t('modal.loading')"
      >
        <router-view v-slot="{ Component, route: curRoute }">
          <transition name="fade">
            <KeepAlive>
              <component :is="Component" :key="curRoute.fullPath" />
            </KeepAlive>
          </transition>
        </router-view>
        <SuceessModal
          :open="checkPwOpen"
          :handle-ok="() => setcheckPwOpen(false)"
          :handle-cancel="() => setcheckPwOpen(false)"
          title="退出系统"
        />
      </a-spin>
    </a-app>
  </a-config-provider>
</template>

<style scoped lang="less">
::v-deep(.ant-spin-spinning) {
  // position: absolute !important;
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
  background-color: rgba(0, 0, 0, 1);
}
::v-deep(.ant-spin-spinning) {
  transform: translate3d(0, 0, 0);
  will-change: transform;
}
::v-deep .btn {
  border-radius: 6px;
  opacity: 1;
  background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  padding: 0px 7px;
  color: white;
  height: 32px;
}
::v-deep .btn:hover {
  color: #89f7ff !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out; /* 使用更平滑的过渡函数 */
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0.1;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
