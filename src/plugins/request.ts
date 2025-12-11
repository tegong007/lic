import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
// 确保引入了 ant-design-vue
const timeOut = window.timeOut ?? '5000';
const service = axios.create({ timeout: Number(timeOut) });

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
