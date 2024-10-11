// import { createRouter, createWebHashHistory } from 'vue-router';
// import type { App } from 'vue';
// import { routes } from 'vue-router/auto-routes';
// import { setupRouterGuards } from './guards';

// export const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
//   scrollBehavior: () => ({ left: 0, top: 0 }),
// });

// export async function setupRouter(app: App) {
//   app.use(router);
//   setupRouterGuards(router);
// }
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/pages/index.vue'),
    // meta: { title: "社保应用" },
  },
  {
    path: '/testModal',
    name: 'TestModal',
    component: () => import('@/pages/Model/indexPage.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
