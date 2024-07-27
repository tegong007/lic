<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui';
import { RouterView } from 'vue-router';
import { watchEffect } from 'vue';
import { useAppStore } from './store';

const appStore = useAppStore();

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark);
});
</script>

<template>
  <n-config-provider class="wh-full" :locale="zhCN" :date-locale="dateZhCN" :theme="appStore.isDark ? darkTheme : undefined" :theme-overrides="appStore.naiveThemeOverrides">
    <RouterView />
  </n-config-provider>
</template>
