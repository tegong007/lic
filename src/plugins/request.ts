import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const service = axios.create({ timeout: 3000 });

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // config.headers["Content-Type"] = "application/json";
    config.headers.Authorization = 'bearer ';
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
        return res.data.respData;
      }
      else {
        return Promise.reject(res.data.msg);
      }
    }
    else {
      return Promise.reject(res.data);
    }
  },
  (err) => {
    if (err.code === 'ECONNABORTED')
      return Promise.reject('接口超时');
    if (err.code === 'ERR_NETWORK')
      return Promise.reject('网络错误');
    return Promise.reject(err.message);
  },
);

export default service;
