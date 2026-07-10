/**
 * Mock 启动器 - 拦截 axios 请求，返回本地 mock 数据
 *
 * 原理：重写 axios 实例的 post 方法，匹配 URL 后直接返回与拦截器一致的数据格式，
 *       code===0 时返回 { code, respData, msg }，否则 reject。
 */
import service from '@/plugins/request';
import { findMockResponse, MOCK_CAMERA_PLACEHOLDER } from './data';

// 保存原始 post 引用
const _originalPost = service.post.bind(service);

/** 视频流 Mock：返回占位图 */
function getMockVideoStreamUrl(): string {
  return MOCK_CAMERA_PLACEHOLDER;
}



/** 替换后的 post - 模拟 response 拦截器行为：code===0 返回 respData，否则 reject */
async function mockPost<T = any>(this: typeof service, url: string, requestData?: any, config?: any): Promise<any> {
  const mockData = findMockResponse(url, requestData);
  if (mockData) {
    if (typeof window !== 'undefined' && (window as any).__MOCK_VERBOSE__ !== false) {
      console.log(`[Mock] POST ${url} →`, mockData);
    }
    // 模拟网络延迟 200ms
    await new Promise(r => setTimeout(r, 200));
    // 模拟 response 拦截器逻辑：与 request.ts 中保持一致
    if (mockData.code === 0) {
      return mockData; // 返回 { code: 0, respData, msg: 'ok' }
    } else {
      return Promise.reject(mockData.msg);
    }
  }
  // 未匹配则走真实请求，真实请求会经过拦截器自动解包
  return _originalPost(url, requestData, config) as Promise<T>;
}

/** 启用 Mock */
export async function enableMock() {
  (service as any).post = mockPost;

  // 延迟导入 loginModule 避免循环依赖，替换视频流为占位图
  const { loginModule } = await import('@/apis/loginApi');
  (loginModule as any)._originalGetVideoStreamUrl = loginModule.getVideoStreamUrl;
  loginModule.getVideoStreamUrl = getMockVideoStreamUrl;

  console.log('[Mock] 已启用 — 所有匹配到的接口将返回本地 Mock 数据，视频流使用占位图');
}

/** 禁用 Mock，恢复真实请求 */
export async function disableMock() {
  (service as any).post = _originalPost;

  try {
    const { loginModule } = await import('@/apis/loginApi');
    if ((loginModule as any)._originalGetVideoStreamUrl) {
      loginModule.getVideoStreamUrl = (loginModule as any)._originalGetVideoStreamUrl;
    }
  } catch { /* 忽略 */ }

  console.log('[Mock] 已禁用');
}
