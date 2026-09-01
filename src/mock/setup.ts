/**
 * Mock 启动器 - 拦截 axios 请求，返回本地 mock 数据
 *
 * 关键点：axios 实例被当作函数调用（service(config) / createDebouncedRequest 的 request(cfg)）
 * 与 service.post/get 最终都收敛到「adapter」这一层。因此必须在 adapter 层拦截，
 * 仅重写 service.post / service.request 都无法覆盖 service(config) 直接调用的场景。
 *
 * 命中 mock：直接返回与 response 拦截器解包后一致的结构 { code, respData, msg }。
 * 未命中：委托给真实 adapter（xhr/http/fetch）发出真实请求。
 */
import service from '@/plugins/request';
import { findMockResponse, MOCK_CAMERA_PLACEHOLDER } from './data';

// 捕获真实 adapter（默认 ['xhr','http','fetch']），未命中 mock 时委托给它
const REAL_ADAPTER: any = service.defaults.adapter || ['xhr', 'http', 'fetch'];
const realAdapterArr = Array.isArray(REAL_ADAPTER) ? REAL_ADAPTER : [REAL_ADAPTER];

/** 视频流 Mock：返回占位图 */
function getMockVideoStreamUrl(): string {
  return MOCK_CAMERA_PLACEHOLDER;
}

/** 网络延迟模拟 */
function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/** 构造一个与 axios 响应结构兼容的对象（response 拦截器会对其进行解包） */
function buildMockResponse(config: any, mockData: any): any {
  return {
    data: mockData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  };
}

/** 自定义 adapter：所有请求方式都会经过这里 */
async function mockAdapter(config: any): Promise<any> {
  const url: string = (config?.url as string) || '';
  const mockData = findMockResponse(url, config?.data ?? config?.params);
  if (mockData) {
    if (typeof window !== 'undefined' && (window as any).__MOCK_VERBOSE__ !== false) {
      console.log(`[Mock] ${String(config?.method || 'POST').toUpperCase()} ${url} →`, mockData);
    }
    // 模拟网络延迟 200ms
    await delay(200);
    return buildMockResponse(config, mockData);
  }
  // 未命中：委托给真实 adapter（会照常走 request/response 拦截器）
  return service.request({ ...config, adapter: realAdapterArr } as any);
}

/** 启用 Mock */
export async function enableMock() {
  (service.defaults as any).adapter = mockAdapter;

  // 延迟导入 loginModule 避免循环依赖，替换视频流为占位图
  const { loginModule } = await import('@/apis/loginApi');
  (loginModule as any)._originalGetVideoStreamUrl = loginModule.getVideoStreamUrl;
  loginModule.getVideoStreamUrl = getMockVideoStreamUrl;

  console.log('[Mock] 已启用 — 所有匹配到的接口将返回本地 Mock 数据，视频流使用占位图');
}

/** 禁用 Mock，恢复真实请求 */
export async function disableMock() {
  (service.defaults as any).adapter = REAL_ADAPTER;

  try {
    const { loginModule } = await import('@/apis/loginApi');
    if ((loginModule as any)._originalGetVideoStreamUrl) {
      loginModule.getVideoStreamUrl = (loginModule as any)._originalGetVideoStreamUrl;
    }
  } catch { /* 忽略 */ }

  console.log('[Mock] 已禁用');
}
