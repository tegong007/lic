import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';
import { generate, getRgbStr } from '@arco-design/color';
import { defaultLayout, defaultPrimaryColor, naiveThemeOverrides } from '@/settings';

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    isDark: useDark(),
    layout: defaultLayout,
    primaryColor: defaultPrimaryColor,
    naiveThemeOverrides,
  }),
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setCollapsed(b: boolean) {
      this.collapsed = b;
    },
    toggleDark() {
      this.isDark = !this.isDark;
    },
    setLayout(v: string) {
      this.layout = v;
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color;
    },
    setThemeColor(color: typeof this.primaryColor, isDark: typeof this.isDark) {
      const colors = generate(color, {
        list: true,
        dark: isDark,
      });
      document.body.style.setProperty('--primary-color', getRgbStr(colors[5]));
      this.naiveThemeOverrides.common = Object.assign(this.naiveThemeOverrides.common || {}, {
        primaryColor: colors[5],
        primaryColorHover: colors[4],
        primaryColorSuppl: colors[4],
        primaryColorPressed: colors[6],
      });
    },
  },
});
