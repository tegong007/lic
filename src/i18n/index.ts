import { createI18n } from 'vue-i18n';
import enLocale from './locales/en.json';
import cnLocale from './locales/cn.json';

const systemLocale = await window.electronAPI.getConfig(); // 获取系统语言设置

const i18n = createI18n({
  legacy: false,
  locale: systemLocale.lang,
  globalInjection: true, // 全局注册$t方法
  messages: {
    en: {
      ...enLocale,
    },
    cn: {
      ...cnLocale,
    },
  },
});

export default i18n;
