import request from '@/plugins/request';

const baseUrl = window.videoIP ?? 'http://localhost:6130/';

// ── 类型定义 ──

/** 获取版本号 */
export interface VersionInfo {
  name: string;
  version: string;
}

export interface GetVersionParams {
  type: number; // 0: 所有类型, 1: 当前程序
}

/** 设置 */
export interface AppConfig {
  language?: string; // "zh_CN" | "en"
  [key: string]: unknown;
}

/** 指纹模板 */
export interface TemplateItem {
  templateData: string;
}

export interface TemplateMatchParams {
  templateList: TemplateItem[];
}

/** 读身份证 */
export interface IdCardInfo {
  sName: string;
  sSex: string;
  sNation: string;
  sBirthday: string;
  sAddress: string;
  sIDNumber: string;
  sValidFromDate: string;
  sValidExpiryDate: string;
  sPhoto: string; // Base64
}

/** 人脸识别结果 */
export interface FaceIdentifyResult {
  isAlive: number; // 0:未检测 1:是 -1:否
  isSamePerson: number; // 0:未检测 1:是 -1:否
}

// ── API ──

const loginModule = {
  /** 获取版本号 */
  getVersion: (params: GetVersionParams) => request.post(`${baseUrl}/at/get-version`, params),

  /** 获取设置 */
  getConfig: () => request.post(`${baseUrl}/at/get-config`),

  /** 设置设置 */
  setConfig: (config: AppConfig) => request.post(`${baseUrl}/at/set-config`, config),

  /** 判断是否有手指按捺 */
  checkPressed: () => request.post(`${baseUrl}/at/check-pressed`),

  /** 获得指纹特征 (num: 0/1/2) */
  doFeature: (num: number) => request.post(`${baseUrl}/at/do-feature`, { num }),

  /** 合成指纹模板 */
  compositeTemplate: () => request.post(`${baseUrl}/at/composite-template`),

  /** 特征模板对比 */
  templateMatch: (params: TemplateMatchParams) => request.post(`${baseUrl}/at/template-match`, params),

  /** 读身份证（15秒超时） */
  idCardRead: () => request.post(`${baseUrl}/at/id-card-read`, {}, { timeout: 15000 }),

  /** 获取视频流地址 */
  getVideoStreamUrl: () => `${baseUrl}/at/video-stream`,

  /** 人脸识别结果 */
  faceIdentifyResult: () => request.post(`${baseUrl}/at/face-identify-result`),

  /** @deprecated 旧的人脸识别接口 */
  faceRecognition: () => request.post(`${baseUrl}/fc/face-identify-result`),
};

export { loginModule };
