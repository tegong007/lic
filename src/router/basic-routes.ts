import type { RouteRecordRaw } from 'vue-router';

export const basicRoutes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
];
