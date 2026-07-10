import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home', // 主页
    name: 'HomePage',
    component: () => import('@/pages/Home/HomePage.vue'),
  },
  {
    path: '/home-station', // 工位查看
    name: 'HomeStationPage',
    component: () => import('@/pages/Home/StationPage.vue'),
  },
  {
    path: '/check', // 智能质检
    name: 'CheckPage',
    component: () => import('@/pages/Check/CheckPage.vue'),
  },
  {
    path: '/check-select', // 质检内页
    name: 'CheckSelectPage',
    component: () => import('@/pages/Check/SelectPage.vue'),
  },
  {
    path: '/defend', // 设备维护
    name: 'DefendPage',
    component: () => import('@/pages/Defend/DefendPage.vue'),
  },
  {
    path: '/set', // 设备设置
    name: 'SetPage',
    component: () => import('@/pages/Set/SetPage.vue'),
  },
  {
    path: '/search', // 查询
    name: 'SearchPage',
    component: () => import('../pages/Search/SearchPage.vue'),
  },
  {
    path: '/login', // 用户登录
    name: 'LoginPage',
    component: () => import('@/pages/Login/LoginPage.vue'),
  },
  {
    path: '/register', // 用户注册
    name: 'RegisterPage',
    component: () => import('@/pages/Login/LoginInfo.vue'),
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });
export default router;
