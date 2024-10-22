import '@/styles/output.css';
import '@/styles/global.scss';
import 'uno.css';

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupNaiveDiscreteApi } from './utils';
import i18n from './i18n';
// import { setupRouter } from './router';
import router from '@/router';
import 'tailwindcss/tailwind.css';
import 'ant-design-vue/dist/reset.css';

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);
  app.use(i18n);
  app.use(Antd);
  app.use(router);
  // await setupRouter(app);
  app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
  setupNaiveDiscreteApi();
}

bootstrap();
