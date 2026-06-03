/**
 * Electron Preload 脚本
 */

import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';

// ==================== 类型定义 ====================

interface IElectronAPI {
  getConfig: () => Promise<unknown>;
  setConfig: (key: string, value: unknown) => Promise<boolean>;
  exitWindow: () => Promise<Record<string, never>>;
  getCameraHelperPath: () => Promise<string>;
}

interface ILegacyIpcRenderer {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
  off: (channel: string, listener: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
}

interface ILegacyElectron {
  send: (channel: string, ...args: unknown[]) => void;
}

// ==================== 暴露 API ====================

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
} as ILegacyIpcRenderer);

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: (): Promise<unknown> => ipcRenderer.invoke('get-config'),
  setConfig: (key: string, value: unknown): Promise<boolean> => ipcRenderer.invoke('modify-config', key, value),
  exitWindow: (): Promise<Record<string, never>> => ipcRenderer.invoke('Exit_Window'),
  getCameraHelperPath: (): Promise<string> => ipcRenderer.invoke('get-camera-helper-path'),
} as IElectronAPI);

contextBridge.exposeInMainWorld('electron', {
  send: ipcRenderer.send,
} as ILegacyElectron);

// ==================== 加载动画 ====================

type DocumentReadyState = 'loading' | 'interactive' | 'complete';

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']): Promise<boolean> {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState as DocumentReadyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState as DocumentReadyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement): HTMLElement | undefined {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child);
    }
    return undefined;
  },
  remove(parent: HTMLElement, child: HTMLElement): HTMLElement | undefined {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child);
    }
    return undefined;
  },
};

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading(): void {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading(): void {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

const { appendLoading, removeLoading } = useLoading();

domReady().then(() => {
  appendLoading();
});

window.addEventListener('message', (ev: MessageEvent) => {
  if (ev.data?.payload === 'removeLoading') {
    removeLoading();
  }
});

setTimeout(removeLoading, 4999);

// ==================== 类型声明 ====================

declare global {
  interface Window {
    ipcRenderer: ILegacyIpcRenderer;
    electronAPI: IElectronAPI;
    electron: ILegacyElectron;
  }
}
