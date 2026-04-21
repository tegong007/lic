import type { UserConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import Vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import VueMacros from 'unplugin-vue-macros/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import removeNoMatch from 'vite-plugin-router-warn';
import pkg from './package.json';

interface IPackageJson {
  debug?: {
    env?: {
      VITE_DEV_SERVER_URL?: string;
    };
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const typedPkg = pkg as IPackageJson;

// ==================== 配置导出 ====================

export default defineConfig(({ command }): UserConfig => {
  // 清理旧的构建产物
  fs.rmSync('dist-electron', { recursive: true, force: true });

  const isServe: boolean = command === 'serve';
  const isBuild: boolean = command === 'build';
  const sourcemap: boolean | 'inline' = isServe || !!process.env.VSCODE_DEBUG;

  // 开发服务器 URL
  const viteDevServerUrl: string = process.env.VSCODE_DEBUG ? typedPkg.debug?.env?.VITE_DEV_SERVER_URL || '' : 'http://192.168.88.12:6102';

  return {
    // ===== 插件配置 =====
    plugins: [
      // Vue Router 自动路由
      VueRouter({
        extensions: ['.vue'],
        dts: 'src/typed-router.d.ts',
      }),

      // Vue Macros（增强 Vue 功能）
      VueMacros({
        plugins: {
          vue: Vue(),
        },
      }),

      // API 自动导入
      AutoImport({
        imports: [
          'vue',
          '@vueuse/head',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables'],
        vueTemplate: true,
      }),

      // 组件自动导入
      Components({
        resolvers: [NaiveUiResolver()],
        dts: false,
      }),

      // UnoCSS
      Unocss(),

      // Electron 构建
      electron({
        main: {
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App');
            } else {
              startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys(typedPkg.dependencies || {}),
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(typedPkg.dependencies || {}),
              },
            },
          },
        },
        renderer: {},
      }),

      // 移除路由警告
      removeNoMatch(),
    ],

    // ===== 路径别名 =====
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '~': path.resolve(process.cwd()),
      },
    },

    // ===== 开发服务器 =====
    server: process.env.VSCODE_DEBUG
      ? (() => {
          const url = new URL(typedPkg.debug?.env?.VITE_DEV_SERVER_URL || 'http://localhost:6102');
          return {
            host: url.hostname,
            port: Number(url.port),
          };
        })()
      : undefined,

    // ===== 构建配置 =====
    clearScreen: false,
    build: {
      chunkSizeWarningLimit: 1024,
      target: 'esnext',
    },

    // ===== 全局变量 =====
    define: {
      __SERVER_URL__: JSON.stringify(viteDevServerUrl),
    },
  };
});
