declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $goto: (page: string, query?: any) => void;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
  electron: { send: (channel: string, ...args: unknown[]) => void };
  electronAPI: {
    getConfig: () => Promise<any>;
    setConfig: (key: string, value: unknown) => Promise<boolean>;
    exitWindow: () => Promise<Record<string, never>>;
    getCameraHelperPath: () => Promise<string>;
  };
  cameraIp?: string;
}
