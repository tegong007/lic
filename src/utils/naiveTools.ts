import { computed } from 'vue';
import * as NaiveUI from 'naive-ui';
import { useAppStore } from '@/store';

export function setupNaiveDiscreteApi() {
  const appStore = useAppStore();
  const configProviderProps = computed(() => ({
    theme: appStore.isDark ? NaiveUI.darkTheme : undefined,
    themeOverrides: useAppStore().naiveThemeOverrides,
  }));
  const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    { configProviderProps },
  );

  window.$loadingBar = loadingBar;
  window.$notification = notification;
  window.$message = message;
  window.$dialog = dialog;
}
