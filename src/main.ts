import Antd from 'ant-design-vue';
import VueViewer from 'v-viewer';
import { createApp } from 'vue';

import { CountTo } from 'vue3-count-to';
import VxeUI from 'vxe-pc-ui';
import VxeUITable from 'vxe-table';
import router from '@/router';
import i18n from './locales';
import { setupStore } from './store';
import { setupNaiveDiscreteApi } from './utils';
import '@/styles/output.css';
import '@/styles/global.scss';
import 'uno.css';
import 'tailwindcss/tailwind.css';
import 'ant-design-vue/dist/reset.css';
import '@/assets/font/fonts.css';
import 'vxe-pc-ui/lib/style.css';
import 'vxe-table/lib/style.css';
import 'viewerjs/dist/viewer.css';

// Mock: 由环境变量 VITE_MOCK_ENABLED 控制，设为 true 时拦截接口返回本地数据
import { enableMock } from '@/mock/setup';
const mockPromise = import.meta.env.VITE_MOCK_ENABLED === 'true' ? enableMock() : Promise.resolve();

async function bootstrap() {
  await mockPromise;
  const { default: App } = await import('./App.vue');
  const app = createApp(App);
  setupStore(app);
  app.use(i18n);
  app.use(Antd);
  app.use(router).use(VueViewer);
  app.use(VxeUI).use(VxeUITable);
  app.component('CountTo', CountTo);
  app.config.globalProperties.$goto = function (page: string, query?: any) {
    page === '-1' ? router.go(-1) : router.push({ name: page, query });
  };
  app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
  setupNaiveDiscreteApi();
}

bootstrap();
