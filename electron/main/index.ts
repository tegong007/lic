/**
 * Electron 主进程入口
 */

import { exec, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, dialog, ipcMain, Menu, shell, Tray } from 'electron';

// ==================== 常量定义 ====================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '../..');
process.env.NODE_OPTIONS = '--no-warnings --max-old-space-size=1024';

app.commandLine.appendSwitch('charset', 'UTF-8');
Menu.setApplicationMenu(null);

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

// ==================== 平台配置 ====================

if (os.release().startsWith('6.1')) {
  app.disableHardwareAcceleration();
}

if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
}

// ==================== 单实例锁定 ====================

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// ==================== 类型定义 ====================

interface IConfig {
  width?: number;
  height?: number;
  fullscreen?: boolean;
  devTools?: boolean;
  [key: string]: unknown;
}

// ==================== 全局状态 ====================

let win: BrowserWindow | null = null;
let canExit: boolean = false;

const preload = path.join(__dirname, '../preload/index.mjs');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

// ==================== 配置读取 ====================

function readConfig(): IConfig {
  let configPath: string;

  if (VITE_DEV_SERVER_URL) {
    configPath = path.join(process.env.VITE_PUBLIC!, 'configDev.json');
  } else {
    configPath = path.resolve(path.dirname(app.getPath('exe')), 'public/configProd.json');
  }

  try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(rawConfig) as IConfig;
  } catch (error) {
    console.error('Error reading config file:', error);
    return {};
  }
}

const config = readConfig();
config.version = app.getVersion();

// ==================== 创建窗口 ====================

async function createWindow(): Promise<void> {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC!, 'icon/icon.ico'),
    frame: true,
    disableAutoHideCursor: false,
    fullscreen: Boolean(config.fullscreen),
    width: config.width,
    height: config.height,
    autoHideMenuBar: true,
    center: true,
    webPreferences: {
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: false,
      nodeIntegration: true,
      images: true,
      textAreasAreResizable: false,
      webgl: false,
      backgroundThrottling: true,
      preload,
    },
  });

  if (config.width && config.height) {
    win.setAspectRatio(config.width / config.height);
  }

  const tray = new Tray(path.join(process.env.VITE_PUBLIC!, 'icon/icon.ico'));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '刷新',
        click: () => {
          BrowserWindow.getAllWindows().forEach((element) => {
            element.reload();
          });
        },
      },
      { label: '退出', role: 'quit' },
    ]),
  );

  if (VITE_DEV_SERVER_URL) {
    await win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    await win.loadFile(indexHtml);
  }

  if (config.devTools) {
    win.webContents.openDevTools();
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.on('close', (event) => {
    if (!canExit) {
      if (win) {
        win.webContents.send('confirm-quit');
      }
      event.preventDefault();
    }
  });
}

// ==================== 更新功能 ====================

function checkForUpdate(): void {
  let newExePath: string;

  if (VITE_DEV_SERVER_URL) {
    newExePath = path.join(process.env.APP_ROOT!, 'Light-Ink-Craftsman-1.0.1.exe');
  } else {
    newExePath = path.resolve(path.dirname(app.getPath('exe')), 'Light-Ink-Craftsman-1.0.1.exe');
  }

  const opts: Electron.MessageBoxOptions = {
    type: 'question',
    buttons: ['立即更新', '稍后'],
    defaultId: 0,
    message: '检测到新版本，是否立即更新？',
    detail: '点击"立即更新"以安装最新版本。',
  };

  dialog.showMessageBox(opts).then((result) => {
    if (result.response === 0) {
      updateApp(newExePath);
    }
  });
}

function updateApp(newExePath: string): void {
  canExit = true;

  if (process.platform === 'win32') {
    spawn(newExePath, [], {
      detached: true,
    }).unref();
    app.quit();
  }
}

// ==================== 生命周期事件 ====================

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// ==================== IPC 处理器 ====================

ipcMain.handle('open-win', (_, arg: string) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('check-for-updates', () => {
  checkForUpdate();
});

ipcMain.handle('get-config', async (): Promise<IConfig> => {
  return config;
});

ipcMain.handle('modify-config', async (_event, key: string, value: unknown): Promise<boolean> => {
  let configPath: string;

  if (VITE_DEV_SERVER_URL) {
    configPath = path.join(process.env.VITE_PUBLIC!, 'config.json');
  } else {
    configPath = path.resolve(path.dirname(process.execPath), 'resources/app/public/config.json');
  }

  try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const fileConfig = JSON.parse(rawConfig) as IConfig;

    if (typeof key !== 'string') {
      console.error('Key must be a string');
      return false;
    }

    fileConfig[key] = value;

    const configString = JSON.stringify(fileConfig, null, 2);
    fs.writeFileSync(configPath, configString);
    console.log('Config file modified successfully');
    return true;
  } catch (error) {
    console.error('Error modifying config file:', error);
    return false;
  }
});

ipcMain.on('quit-app', () => {
  canExit = true;
  if (win) {
    win.close();
  }
});

ipcMain.handle('Exit_Window', async (): Promise<Record<string, never>> => {
  console.log('执行关机...');
  if (process.platform === 'win32') {
    exec('shutdown /s /t 0');
  } else if (process.platform === 'darwin') {
    exec('osascript -e \'tell app "System Events" to shut down\'');
  } else if (process.platform === 'linux') {
    exec('shutdown now');
  }
  return {};
});
