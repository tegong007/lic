<script setup lang="ts">
import { h, watchEffect } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { useAppStore } from './store';

const appStore = useAppStore();

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '200px',
  },
  spin: true,
});
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        fontSize: 16, //会击穿button的样式
      },
    }"
  >
    <a-spin
      :spinning="appStore.spinning"
      :indicator="indicator"
      tip="加载中..."
    >
      <router-view v-slot="{ Component, route: curRoute }">
        <KeepAlive>
          <component :is="Component" :key="curRoute.fullPath" />
        </KeepAlive>
      </router-view>
    </a-spin>
  </a-config-provider>
</template>

<style scoped lang="less">
::v-deep(.ant-spin-spinning) {
  position: absolute !important;
  top: calc(50% - 300px) !important;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-dot {
    margin-top: -70px !important;
    margin-left: -100px !important;
  }
  // color: blue;
}
</style>
