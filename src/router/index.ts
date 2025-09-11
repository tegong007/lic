import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
// import RouterReplaceComp from "./routerReplaceSelf";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/bigScreen',
  },
  {
    path: '/bigScreen', // 首页
    name: 'BigScreen',
    component: () => import('../pages/bigScreen/newIndex.vue'),
  },
  {
    path: '/setPage', // 设置
    name: 'SetPage',
    meta: { keepAlive: false },
    component: () => import('@/pages/bigScreen/setting/index.vue'),
  },
  {
    path: '/mainTain', // 维护
    name: 'MainTain',
    meta: { keepAlive: false },
    component: () => import('@/pages/bigScreen/mainTain/index.vue'),
  },
  {
    path: '/workstationStatus', // 工位状态
    name: 'WorkstationStatus',
    component: () => import('../pages/bigScreen/workstationStatus/index.vue'),
  },
  {
    path: '/addTask', // 添加批次
    name: 'AddTask',
    component: () => import('@/pages/bigScreen/batch/addBatch/index.vue'),
  },
  {
    path: '/docList', // 证本列表
    name: 'docList',
    component: () => import('@/pages/bigScreen/doc/index.vue'),
  },

  // {
  //   path: '/search', // 查询页面
  //   name: 'Search',
  //   component: () => import('../pages/bigScreen/search/index.vue'),
  // },
  {
    path: '/searchCard', // 查询页面
    name: 'SearchCard',
    component: () => import('../pages/bigScreen/searchCard/index.vue'),
  },
  {
    path: '/test', // 工位状态
    name: 'Test',
    component: () => import('../pages/bigScreen/test.vue'),
  },
  {
    path: '/error-m1', // 错误详情
    name: 'Error-m1',
    component: () => import('../pages/bigScreen/error/m1/index.vue'),
  },
  {
    path: '/error-m2', // 错误详情
    name: 'Error-m2',
    component: () => import('../pages/bigScreen/error/m2.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
