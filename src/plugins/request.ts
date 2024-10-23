import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useI18n } from 'vue-i18n';

const timeOut = window.timeOut ?? '5000';
const service = axios.create({ timeout: timeOut });

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
    const { t } = useI18n();
    if (err.code === 'ECONNABORTED')
      return Promise.reject(t('network.timeout'));
    if (err.code === 'ERR_NETWORK')
      return Promise.reject(t('network.newworkError'));
    return Promise.reject(err.message);
  },
);

export default service;
