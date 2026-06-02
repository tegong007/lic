/**
 * CameraHelperWS 的 Vue Composable 封装
 *
 * 将 Demo_websocket_origin.html 中的 CameraHelperWS WebSocket 摄像头方案
 * 封装为 Vue 响应式组合函数，用于人脸识别弹窗的视频预览。
 *
 * 用法：
 *   const { cameraSrc, startPreview, stopCamera, isConnected } = useCamera();
 *   await startPreview();
 *   // <img :src="cameraSrc" />
 *   stopCamera();
 */

// ref, onUnmounted 由 unplugin-auto-import 全局注入，无需显式导入

interface CameraParams {
  host: string;
  Infrared: number;
  imgWidth: number;
  imgHeight: number;
  imgCompress: number;
  flip: number;
  fill: number;
  isActived: number;
  openByThread: number;
  useBlackMask: number;
  timeOut: number;
  expectedFacesCount: number;
  liveThreshold: string;
  minFaceWide: number;
  pupilDistMin: number;
  pupilDistMax: number;
  stableCount: number;
}

const defaultParams: CameraParams = {
  host: genCameraHost(),
  Infrared: 1,
  imgWidth: 640,
  imgHeight: 480,
  imgCompress: 85,
  flip: 1,
  fill: 1,
  isActived: 1,
  openByThread: 1,
  useBlackMask: 1,
  timeOut: 10, // 关键：超时时间(秒)，避免 faceCheck 无限等待
  expectedFacesCount: 1, // 期望人脸数量
  liveThreshold: '0.6', // 活体检测阈值
  minFaceWide: 60, // 最小人脸宽度
  pupilDistMin: 0, // 最小瞳距
  pupilDistMax: 1000, // 最大瞳距
  stableCount: 0, // 稳定帧数
};

/** 从 window.cameraIp 获取摄像头 WebSocket 地址 */
function genCameraHost(): string {
  try {
    return (window.cameraIp as string | undefined) ?? 'http://localhost:18832';
  } catch {
    return 'http://localhost:18832';
  }
}

/** 活体检测状态码映射（与 Demo_websocket_origin.html 保持一致） */
function toStateMsg(state: number): string {
  switch (state) {
    case 1: return '未检测到人脸';
    case 2: return '检测到多人脸';
    case 3: return '头部姿态不正，左右转幅较大或俯仰角度较大';
    case 4: return '太近了';
    case 5: return '太远了';
    case 6: return '有面部表情';
    case 7: return '人脸模糊';
    case 8: return '亮度不合格';
    case 9: return '人脸不居中';
    case 10: return '眼部遮挡';
    case 11: return '嘴部遮挡';
    case 12: return '人脸不在roi区域内';
    case 13: return '有戴墨镜';
    case 14: return '有戴口罩';
    case 15: return '有戴眼镜';
    case 16: return '有长胡子';
    case 17: return '在打电话';
    case 18: return '有戴帽子';
    case 19: return '左脸颊有遮挡';
    case 20: return '右脸颊有遮挡';
    case 21: return '额头有遮挡';
    case 22: return '下巴有遮挡';
    case 40: return '算法无授权，请检查授权信息';
    default: return '';
  }
}

export function useCamera() {
  // ---- 状态 ----
  const cameraSrc = ref<string>(''); // base64 帧，给 <img :src="cameraSrc">
  const isConnected = ref(false);
  const isPreviewing = ref(false);
  const errorMsg = ref('');
  const faceStatus = ref(''); // 活体检测状态文字
  const capturedImage = ref(''); // 采集到的人脸 base64（带 data URI 头，用于 img 展示）

  /** 获取全局 CameraHelperWS */
  function getCHWS(): any {
    const g = (typeof window !== 'undefined' ? (window as any).CameraHelperWS : undefined) ?? (globalThis as any).CameraHelperWS;
    if (!g) {
      throw new Error('CameraHelperWS 未加载，请确保 CameraHelperWS.js 脚本已注入');
    }
    return g;
  }

  /** 初始化参数 + 连接 WebSocket */
  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const chws = getCHWS();
        chws.initParam(defaultParams);
        chws.connect(
          () => {
            isConnected.value = true;
            console.log('[CameraHelperWS] 连接成功');
            resolve();
          },
          () => {
            isConnected.value = false;
            const msg = '摄像头WebSocket连接失败';
            errorMsg.value = msg;
            console.warn('[CameraHelperWS] 连接失败');
            reject(new Error(msg));
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  /** 打开摄像头，启动预览流（base64 帧） */
  function openCamera(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const chws = getCHWS();
        chws.openCam(
          () => {
            isPreviewing.value = true;
            console.log('[CameraHelperWS] 摄像头已打开');
            resolve();
          },
          (errCode: number, errMsg: string) => {
            isPreviewing.value = false;
            const msg = `摄像头打开失败: ${errMsg || errCode}`;
            errorMsg.value = msg;
            reject(new Error(msg));
          },
          (previewData: string) => {
            // 每一帧都以 base64 回调
            cameraSrc.value = `data:image/jpg;base64,${previewData}`;
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  /** 关闭摄像头预览 */
  function closeCamera(): void {
    try {
      const chws = getCHWS();
      chws.closeCam();
    } catch {
      // 忽略关闭时的错误
    }
    isPreviewing.value = false;
    cameraSrc.value = '';
  }

  /** 断开 WebSocket 连接 */
  function disconnect(): void {
    try {
      const chws = getCHWS();
      chws.disconnect();
    } catch {
      // 忽略
    }
    isConnected.value = false;
    errorMsg.value = '';
  }

  /** 整体启动：连接 → 打开摄像头 */
  async function startPreview(): Promise<void> {
    // 如果已经连接过（可能之前连接还存在），先重置
    if (isConnected.value) {
      try {
        closeCamera();
      } catch { /* noop */ }
      try {
        disconnect();
      } catch { /* noop */ }
    }
    errorMsg.value = '';
    await init();
    await openCamera();
  }

  /** 整体关闭：关摄像头 + 断连接 */
  function stopCamera(): void {
    // 仅在已连接或预览中时才做清理，避免 CameraHelperWS 未加载时空调用报错
    if (!isConnected.value && !isPreviewing.value) return;
    closeCamera();
    disconnect();
  }

  /** 活体检测采集：调用 CameraHelperWS.faceCheck → cropImageAdvance → 返回 raw base64（无 data URI 头） */
  function checkLive(): Promise<string> {
    return new Promise((resolve, reject) => {
      let lastEvent = 0;
      const chws = getCHWS();
      faceStatus.value = '开始采集';
      chws.faceCheck(
        (data: string) => {
          faceStatus.value = '采集成功';
          const arrayData = data.split('$&');
          // 裁切人脸：arrayData[0]=全图, arrayData[1]=人脸区域, arrayData[2]=裁切后的人脸
          chws.cropImageAdvance(
            arrayData[0],
            arrayData[1],
            0,
            0,
            0,
            (croppedData: string) => {
              capturedImage.value = `data:image/jpg;base64,${croppedData}`;
              resolve(croppedData); // 纯 base64，不带 data URI 头
            },
            () => reject(new Error('裁切图片失败')),
          );
        },
        (errCode: number) => {
          let resultStr = `采集失败: ${errCode}`;
          if (errCode === 102) {
            resultStr += `, ${toStateMsg(lastEvent)}`;
          }
          faceStatus.value = resultStr;
          reject(new Error(resultStr));
        },
        (state: number) => {
          lastEvent = state;
          faceStatus.value = toStateMsg(state);
        },
      );
    });
  }

  // 组件卸载时自动清理
  onUnmounted(() => {
    stopCamera();
  });

  return {
    cameraSrc,
    isConnected,
    isPreviewing,
    errorMsg,
    faceStatus,
    capturedImage,
    startPreview,
    stopCamera,
    checkLive,
  };
}
