import request from '@/plugins/request';

const v1 = window.serverAddress; // 后端服务

// 主页
const homeModule = {
  docMachineInit: () => request.post(`${v1}/tss/doc-machine/init`, { module: 'm0' }), // 制证设备初始化-全部
  getAllStatus: () => request.post(`${v1}/tss/position-status`, { moduleID: 0 }), // 工位状态查询-整机
  getHomeList: () => request.post(`${v1}/tss/produce-status`), // 生产状态查询
  getDocNumProduce: () => request.post(`${v1}/tss/get-doc-num-produce`), // 可进本数查询
  setControlMachine: (data: any) => request.post(`${v1}/tss/machine-control`, data), // 生产设备控制
  getPositionCard: (data: number) => request.post(`${v1}/tss/position-status`, { moduleID: data }), // 工位状态查询
  printObsv: (data: any) => request.post(`${v1}/tss/print-obsv`, data), // 工位状态查询
  clearLog: (data: any) => request.post(`${v1}/tss/uv/clear-log`, data), // 清除喷墨的日志
  errorHandle: (data: any) => request.post(`${v1}/tss/error-handle`, data), // 错误处理
  deviceSet: (data: any) => request.post(`${v1}/tss/device-set`, data), // 部件设置
};

// 智能质检
const checkModule = {
  qualityCheckLast: () => request.post(`${v1}/tss/quality-check-last`), // 质检最新结果查询
  qualityCheckGet: () => request.post(`${v1}/tss/mv-para-get`), // 质检参数读取
  qualityCheckSet: (data: any) => request.post(`${v1}/tss/mv-para-set`, data), // 质检参数设置
  qualityCheckHistoy: (data: any) => request.post(`${v1}/tss/quality-check-history`, data), // 质检历史记录查询
};

// 设备维护
const defendModule = {
  getDevice: (data: number) => request.post(`${v1}/tss/get-device`, { moduleID: data }), // 部件维护查询
  getApiTransfer: (data: any) => request.post(`${v1}/tss/api-transfer`, data), // 接口转发
  getVersion: (data: any) => request.post(`${v1}/tss/get-version`, data), // 版本号查询-所有类型
  addTask: (data: any) => request.post(`${v1}/tss/demo/add-task`, data), // 任务添加（演示模式）
  moduleStatus: (data: any) => request.post(`${v1}/tss/doc-machine/module-status`, data), // 制证设备模块状态查询
  sendCmd: (data: any) => request.post(`${v1}/tss/error-handle/send-cmd`, data), // 发送错误处理指令
  removeDoc: (data: any) => request.post(`${v1}/tss/error-handle/remove-doc`, data), // 已手动取本
  Done: (data: any) => request.post(`${v1}/tss/error-handle/done`, data), // 已处理错误
  printSelfTest: () => request.post(`${v1}/tss/print-self-test`), // 自检
};

// 设备设置
const setMoule = {
  setSystemPara: (data: any) => request.post(`${v1}/tss/set-system-para`, data), // 设置系统参数
  getSystemPara: () => request.post(`${v1}/tss/get-system-para`), // 获取系统参数
};

// 查询
const searchModule = {
  getTask: (data: any) => request.post(`${v1}/tss/get-task`, data), // 任务查询
  taskOperate: (data: any) => request.post(`${v1}/tss/task-operate`, data), // 任务操作
  docData: (data: any) => request.post(`${v1}/tss/doc-data`, data), // 制证数据查询
  docOperate: (data: any) => request.post(`${v1}/tss/doc-operate`, data), // 证本数据操作
  physicalDoc: (data: any) => request.post(`${v1}/tss/physical-doc`, data), // 实体证本查询
  physicalDocOperate: (data: any) => request.post(`${v1}/tss/physical-doc-operate`, data), // 实体证本操作
};

// 油墨余量
const footerModule = {
  getLnkRemainder: () => request.post(`${v1}/tss/get-ink-remainder`),
};

//   getDocNumProduce: () => request.post(`${v1}/tss/get-doc-num-produce`),

// 工位状态模块
const positionModule = {
  getPositionCard: (data: any) => request.post(`${v1}/tss/position-status`, data),
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
  getDocStatistics: (data: any) => request.post(`${v1}/tss/doc-statistics`, data),
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
  getDocOperate: (data: any) => request.post(`${v1}/tss/physical-doc-operate`, data),
  getDocDetailGeneral: (data: any) => request.post(`${v1}/tss/physical-doc`, data),
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
  setUvPlatformConfig: (data: any) => request.post(`${v1}/tss/set-uv-platform-config`, data),
  getUvLocationg: () => request.post(`${v1}/tss/get-uv-location-base`),
  setUvLocationg: (data: any) => request.post(`${v1}/tss/set-uv-location-base`, data),
  getLoadSlot: () => request.post(`${v1}/tss/get-load-slot-enable`),
  setLoadSlot: (data: any) => request.post(`${v1}/tss/set-load-slot-enable`, data),
  getCollectionSlot: () => request.post(`${v1}/tss/get-collection-slot-enable`),
  setCollectionSlot: (data: any) => request.post(`${v1}/tss/set-collection-slot-enable`, data),
};
// 错误页面接口
const ErrorModule = {
  getModuleStatus: (data: any) => request.post(`${v1}/tss/doc-machine/module-status`, data),
  handleError: (data: any) => request.post(`${v1}/tss/error-handle/send-cmd`, data),
  handleDone: (data: any) => request.post(`${v1}/tss/error-handle/done`, data),
  removeDoc: (data: any) => request.post(`${v1}/tss/error-handle/remove-doc`, data),
};
export { checkModule, defendModule, documentModule, ErrorModule, footerModule, homeModule, mainTainModule, physicalModule, positionModule, searchModule, setMoule, settingMoule, TaskModule };
