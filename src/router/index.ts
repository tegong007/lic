import { createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { setupRouterGuards } from './guards';
import { basicRoutes } from './basic-routes';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export async function setupRouter(app: App) {
  app.use(router);
  setupRouterGuards(router);
}
