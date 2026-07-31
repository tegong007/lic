import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
// 配置文件的 timeOut 在 DOMContentLoaded 后由 electronAPI.getConfig() 异步写入 window.timeOut，
// 不能在模块加载时同步读取，需在每次请求时动态取值。
const getTimeout = () => Number(window.timeOut ?? 5000);

const service = axios.create({ timeout: getTimeout() });

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 每次请求动态应用配置文件中的 timeOut（避免模块加载时 window.timeOut 尚未注入）
    config.timeout = getTimeout();
    // config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    // config.headers.Authorization = "bearer ";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

service.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        return res.data;
      } else {
        return Promise.reject(res.data.msg);
      }
    } else {
      return Promise.reject(res.data);
    }
  },
  (err) => {
    // const { t } = useI18n();
    if (err.code === 'ECONNABORTED') return Promise.reject('接口超时');
    if (err.code === 'ERR_NETWORK') return Promise.reject('网络错误');
    return Promise.reject(err.message);
  },
);

export default service;
