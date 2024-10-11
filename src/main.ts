import '@/styles/reset.css';
import '@/styles/global.scss';
import 'uno.css';

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupNaiveDiscreteApi } from './utils';
import { setupRouter } from './router';
import 'tailwindcss/tailwind.css';
import 'ant-design-vue/dist/reset.css';

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);
  app.use(Antd);
  await setupRouter(app);
  app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
  setupNaiveDiscreteApi();
}

bootstrap();
