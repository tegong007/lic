declare module '@arco-design/color';

interface CameraHelperWS {
  initParam: (params: Record<string, unknown>) => void;
  connect: (onSuccess: () => void, onError: () => void) => void;
  disconnect: () => void;
  openCam: (onSuccess: () => void, onError: (errCode: number, errMsg: string) => void, onPreview: (previewData: string) => void) => void;
  closeCam: () => void;
  faceCheck: (onSuccess: (data: string) => void, onError: (errCode: number, errMsg: string) => void, onState: (state: number) => void) => void;
  cropImageAdvance: (
    imageData: string,
    faceRect: string,
    specWidth: number,
    specHeight: number,
    maxSize: number,
    onSuccess: (croppedData: string) => void,
    onError: () => void,
  ) => void;
  enumAllCameras: (onResult: (result: string) => void) => void;
  getSn: (onResult: (result: string) => void) => void;
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
  $message: import('naive-ui').MessageApi;
  $dialog: import('naive-ui').DialogApi;
  $notification: import('naive-ui').NotificationApi;
  $loadingBar: import('naive-ui').LoadingBarApi;
  serverAddress: string;
  biometricIP: string;
  cameraIp: string;
  timeOut: string;
  lang: string;
  CameraHelperWS?: CameraHelperWS;
}
