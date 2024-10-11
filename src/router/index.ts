import { createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from 'vue-router/auto-routes';
import { setupRouterGuards } from './guards';

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export async function setupRouter(app: App) {
  app.use(router);
  setupRouterGuards(router);
}
