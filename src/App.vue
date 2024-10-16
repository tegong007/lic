<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui';
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
  <n-config-provider
    class="wh-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="appStore.isDark ? darkTheme : undefined"
    :theme-overrides="appStore.naiveThemeOverrides"
  >
    <a-spin :spinning="appStore.spinning" :indicator="indicator" delay="1000">
      <router-view v-slot="{ Component, route: curRoute }">
        <KeepAlive>
          <component :is="Component" :key="curRoute.fullPath" />
        </KeepAlive>
      </router-view>
    </a-spin>
  </n-config-provider>
</template>

<style scoped lang="less">
::v-deep(.ant-spin-spinning) {
  position: absolute !important;
  top: calc(50% - 300px) !important;
  left: -100px !important;
  z-index: 999999999999999999999;
  // color: blue;
}
</style>
