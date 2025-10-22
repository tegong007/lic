import request from '@/plugins/request';
// 后端服务
const v1 = window.serverAddress ?? 'http://localhost:6101/';
const homeModule = {
  getHomeList: () => request.post(`${v1}/tss/produce-status`),
  getDocNumProduce: () => request.post(`${v1}/tss/get-doc-num-produce`),
  setControlMachine: (data: any) =>
    request.post(`${v1}/tss/machine-control`, data),
};
// 工位状态模块
const positionModule = {
  getPositionCard: (data: any) =>
    request.post(`${v1}/tss/position-status`, data),
};

// 任务模块
const TaskModule = {
  getTaskPage: (data: any) => request.post(`${v1}/tss/get-task`, data),
  getTaskOperate: (data: any) => request.post(`${v1}/tss/task-operate`, data),
  // getGroupPage: (data: any) => request.post(`${v1}/tss/get-group`, data),
  // getBatchStatistics: (data: any) =>
  //   request.post(`${v1}/tss/batch-statistics`, data),
};

// 制证数据模块
const documentModule = {
  getDocDetailPage: (data: any) => request.post(`${v1}/tss/doc-detail`, data),
  getDocStatistics: (data: any) =>
    request.post(`${v1}/tss/doc-statistics`, data),
  getDocAllStatistics: () => request.post(`${v1}/tss/doc-allStatistics`),
  getDocOperate: (data: any) => request.post(`${v1}/tss/doc-operate`, data),
  getDocDetailGeneral: (data: any) => request.post(`${v1}/tss/doc-data`, data),
};

// 实体证本模块
const physicalModule = {
  // getDocDetailPage: (data: any) => request.post(`${v1}/tss/doc-detail`, data),
  // getDocStatistics: (data: any) =>
  //   request.post(`${v1}/tss/doc-statistics`, data),
  // getDocAllStatistics: () => request.post(`${v1}/tss/doc-allStatistics`),
  getPhysicaDocOperate: (data: any) =>
    request.post(`${v1}/tss/physical-doc-operate`, data),
  getPhysicalDoc: (data: any) => request.post(`${v1}/tss/physical-doc`, data),
};

// 维护页面
const mainTainModule = {
  getDevice: (data: any) => request.post(`${v1}/tss/get-device`, data),
  consumables: {
    getLnkRemainder: () => request.post(`${v1}/tss/get-ink-remainder`),
  },
  getVersion: (data: any) => request.post(`${v1}/tss/get-version`, data),
  getPassWord: (data: any) => request.post(`${v1}/tss/password`, data),
};
// 设置页面
const settingMoule = {
  getUvPlatformConfig: () => request.post(`${v1}/tss/get-uv-platform-config`),
  setUvPlatformConfig: (data: any) =>
    request.post(`${v1}/tss/set-uv-platform-config`, data),
  getUvLocationg: () => request.post(`${v1}/tss/get-uv-location-base`),
  setUvLocationg: (data: any) =>
    request.post(`${v1}/tss/set-uv-location-base`, data),
  getLoadSlot: () => request.post(`${v1}/tss/get-load-slot-enable`),
  setLoadSlot: (data: any) =>
    request.post(`${v1}/tss/set-load-slot-enable`, data),
  getCollectionSlot: () => request.post(`${v1}/tss/get-collection-slot-enable`),
  setCollectionSlot: (data: any) =>
    request.post(`${v1}/tss/set-collection-slot-enable`, data),
};
// 错误页面接口
const ErrorModule = {
  getModuleStatus: (data: any) =>
    request.post(`${v1}/tss/doc-machine/module-status`, data),
  handleError: (data: any) =>
    request.post(`${v1}/tss/error-handle/send-cmd`, data),
  handleDone: (data: any) => request.post(`${v1}/tss/error-handle/done`, data),
  removeDoc: (data: any) =>
    request.post(`${v1}/tss/error-handle/remove-doc`, data),
};
export {
  documentModule,
  ErrorModule,
  homeModule,
  mainTainModule,
  physicalModule,
  positionModule,
  settingMoule,
  TaskModule,
};
