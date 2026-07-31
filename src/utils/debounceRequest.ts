// debounceRequest.ts
import type { AxiosRequestConfig } from 'axios';
import request from '@/plugins/request';

type RequestParams = AxiosRequestConfig; // ✅ 正确写法

interface PendingItem {
  controller: AbortController;
  promise: Promise<any>;
}
const pendings = new Map<string, PendingItem>();

export function createDebouncedRequest(cfg: RequestParams) {
  const key = `${cfg.url}|${cfg.method || 'GET'}|${JSON.stringify(cfg.params || cfg.data || {})}`;

  const hit = pendings.get(key);
  if (hit) {
    // console.warn("[debounce] 请求被丢弃", key);
    return hit.promise;
  }
  //   console.log("[debounce] 真正发请求", key);

  const controller = new AbortController();
  const promise = request({ ...cfg, signal: controller.signal }).finally(() => pendings.delete(key));

  pendings.set(key, { controller, promise });
  return promise;
}

export function cancelAllPending() {
  pendings.forEach(({ controller }) => controller.abort());
  pendings.clear();
}
