import request from '@/plugins/request';
// 后端服务
const v1 = window.serverAddress ?? 'http://localhost:6101/';

//  设备初始化
export function initMachine(data: any) {
  const api = `${v1}/tss/doc-machine/init`;
  return request.post(api, data);
}

// 任务管理服务HTTP接口
export function startOrStopPrintTask(data: any) {
  const api = `${v1}/tss/print-task`;
  // const api = `${v1}/doc-machine/print-task`;
  return request.post(api, data);
}
// 任务管理服务HTTP接口
export function getDocStatus() {
  const api = `${v1}/tss/doc-status`;
  return request.post(api);
}
// 子模块任务转发
export function getApiTransfer(data: any) {
  const api = `${v1}/tss/api-transfer`;
  return request.post(api, data);
}
// 流水线走本
export function getLineRun(data: any) {
  const api = `${v1}/tss/line-run`;
  return request.post(api, data);
}

// 多本-证本状态查询
export function lineGetDocStatus() {
  const api = `${v1}/tss/doc-status/current-task`;
  return request.post(api);
}
// 多本-证本状态查询
export function lineGetDocdetail(data: any) {
  const api = `${v1}/tss/doc-detail`;
  return request.post(api, data);
}
// 当前批次
export function getCurrentBatch() {
  const api = `${v1}/tss/current-batch`;
  return request.post(api);
}
// 立刻打印
export function setBatchRank(data: any) {
  const api = `${v1}/tss/set-batch-rank`;
  return request.post(api, data);
}
