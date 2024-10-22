import { createI18n } from 'vue-i18n';
import enLocale from './locales/en.json';
import cnLocale from './locales/cn.json';

// let systemLocale = await window.electronAPI.getSystemLocale(); // 获取系统语言设置

// console.log('systemLocale:', systemLocale); // 输出系统语言设置
// let systemLanguageDe = 'cn';

// // 如果系统语言不是 'zh-CN'，则设置为 'en'
// if (systemLocale !== 'zh-CN') {
//   systemLanguageDe = 'en';
// }
// await window.electronAPI.getStoreValue('locale') ||
const i18n = createI18n({
  legacy: false, // you must specify 'legacy: false' option
  locale: 'cn',
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
