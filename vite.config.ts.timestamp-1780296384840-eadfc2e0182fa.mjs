// vite.config.ts
import fs from "node:fs";
import path from "node:path";
import Vue from "file:///E:/vue-project/ds-lic/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Unocss from "file:///E:/vue-project/ds-lic/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/vue-project/ds-lic/node_modules/unplugin-auto-import/dist/vite.js";
import { NaiveUiResolver } from "file:///E:/vue-project/ds-lic/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///E:/vue-project/ds-lic/node_modules/unplugin-vue-components/dist/vite.js";
import VueMacros from "file:///E:/vue-project/ds-lic/node_modules/unplugin-vue-macros/dist/vite.js";
import { VueRouterAutoImports } from "file:///E:/vue-project/ds-lic/node_modules/unplugin-vue-router/dist/index.js";
import VueRouter from "file:///E:/vue-project/ds-lic/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig } from "file:///E:/vue-project/ds-lic/node_modules/vite/dist/node/index.js";
import electron from "file:///E:/vue-project/ds-lic/node_modules/vite-plugin-electron/dist/simple.mjs";
import removeNoMatch from "file:///E:/vue-project/ds-lic/node_modules/vite-plugin-router-warn/dist/index.mjs";

// package.json
var package_default = {
  name: "tss-xiaohongyan",
  type: "module",
  version: "3.13.2",
  private: true,
  description: "base on Electron + Vue + Naive UI created project.",
  author: "Dascom <xxxxx@dascom.cn>",
  license: "MIT",
  keywords: [
    "electron",
    "rollup",
    "vite",
    "vue3",
    "vue"
  ],
  main: "dist-electron/main/index.js",
  debug: {
    env: {
      VITE_DEV_SERVER_URL: "http://127.0.0.1:3344/"
    }
  },
  scripts: {
    dev: "vite",
    build: "vue-tsc --noEmit && vite build && electron-builder",
    preview: "vite preview",
    lint: "eslint",
    "lint:fix": "eslint --fix",
    typecheck: "npm run typecheck:node && npm run typecheck:web",
    start: "electron-vite preview",
    postinstall: "electron-builder install-app-deps",
    "build:unpack": "npm run build && electron-builder --dir",
    "build:win": "vite build && electron-builder --win",
    "build:mac": "vite build && electron-builder --mac",
    "electron-updater": "^6.6.2",
    "lodash.escaperegexp": "^4.1.2",
    "lodash.isequal": "^4.5.0",
    "build:linux": "vite build && electron-builder --linux",
    up: "taze major -I"
  },
  dependencies: {
    "@types/node": "^22.15.2",
    "ant-design-vue": "^4.2.5",
    axios: "^1.9.0",
    "simple-keyboard": "^3.8.43",
    "ts-md5": "^1.3.1",
    "v-viewer": "^3.0.22",
    "vue-i18n": "9.9.0",
    "vue3-count-to": "^1.1.2",
    "vue3-seamless-scroll": "^2.0.1",
    "vxe-pc-ui": "4.3.6",
    "vxe-table": "4.9.8"
  },
  devDependencies: {
    "@antfu/eslint-config": "^4.12.0",
    "@arco-design/color": "^0.4.0",
    "@unocss/eslint-plugin": "^0.61.5",
    "@unocss/preset-rem-to-px": "^0.61.5",
    "@vitejs/plugin-vue": "^5.0.4",
    "@vueuse/core": "^10.11.0",
    electron: "^35.2.1",
    "electron-builder": "^24.13.3",
    eslint: "^9.25.1",
    "eslint-plugin-format": "^1.0.1",
    less: "^4.3.0",
    "lint-staged": "^15.5.1",
    "naive-ui": "^2.39.0",
    pinia: "^3.0.2",
    sass: "^1.87.0",
    tailwindcss: "^3.4.13",
    taze: "^19.0.4",
    typescript: "^5.4.2",
    unocss: "^0.61.5",
    "unplugin-auto-import": "^0.17.6",
    "unplugin-vue-components": "^0.27.2",
    "unplugin-vue-macros": "^2.10.0",
    "unplugin-vue-router": "^0.10.1",
    vite: "^5.1.5",
    "vite-plugin-electron": "^0.28.4",
    "vite-plugin-electron-renderer": "^0.14.5",
    "vite-plugin-router-warn": "^1.0.0",
    vue: "^3.4.21",
    "vue-router": "^4.4.0",
    "vue-tsc": "^2.0.6"
  },
  "simple-git-hooks": {
    "pre-commit": "yarn lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
};

// vite.config.ts
var typedPkg = package_default;
var vite_config_default = defineConfig(({ command }) => {
  fs.rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  const viteDevServerUrl = process.env.VSCODE_DEBUG ? typedPkg.debug?.env?.VITE_DEV_SERVER_URL || "" : "http://192.168.88.12:6102";
  return {
    // ===== 插件配置 =====
    plugins: [
      // Vue Router 自动路由
      VueRouter({
        extensions: [".vue"],
        dts: "src/typed-router.d.ts"
      }),
      // Vue Macros（增强 Vue 功能）
      VueMacros({
        plugins: {
          vue: Vue()
        }
      }),
      // API 自动导入
      AutoImport({
        imports: [
          "vue",
          "@vueuse/head",
          "@vueuse/core",
          VueRouterAutoImports,
          {
            "vue-router/auto": ["useLink"]
          }
        ],
        dts: "src/auto-imports.d.ts",
        dirs: ["src/composables"],
        vueTemplate: true
      }),
      // 组件自动导入
      Components({
        resolvers: [NaiveUiResolver()],
        dts: false
      }),
      // UnoCSS
      Unocss(),
      // Electron 构建
      electron({
        main: {
          entry: "electron/main/index.ts",
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log("[startup] Electron App");
            } else {
              startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys(typedPkg.dependencies || {})
              }
            }
          }
        },
        preload: {
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys(typedPkg.dependencies || {})
              }
            }
          }
        },
        renderer: {}
      }),
      // 移除路由警告
      removeNoMatch()
    ],
    // ===== 路径别名 =====
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
        "~": path.resolve(process.cwd())
      }
    },
    // ===== 开发服务器 =====
    server: process.env.VSCODE_DEBUG ? (() => {
      const url = new URL(typedPkg.debug?.env?.VITE_DEV_SERVER_URL || "http://localhost:6102");
      return {
        host: url.hostname,
        port: Number(url.port)
      };
    })() : void 0,
    // ===== 构建配置 =====
    clearScreen: false,
    build: {
      chunkSizeWarningLimit: 1024,
      target: "esnext"
    },
    // ===== 全局变量 =====
    define: {
      __SERVER_URL__: JSON.stringify(viteDevServerUrl)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcdnVlLXByb2plY3RcXFxcZHMtbGljXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx2dWUtcHJvamVjdFxcXFxkcy1saWNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Z1ZS1wcm9qZWN0L2RzLWxpYy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSc7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcclxuaW1wb3J0IFZ1ZU1hY3JvcyBmcm9tICd1bnBsdWdpbi12dWUtbWFjcm9zL3ZpdGUnO1xyXG5pbXBvcnQgeyBWdWVSb3V0ZXJBdXRvSW1wb3J0cyB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXInO1xyXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJztcclxuaW1wb3J0IHJlbW92ZU5vTWF0Y2ggZnJvbSAndml0ZS1wbHVnaW4tcm91dGVyLXdhcm4nO1xyXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJztcclxuXHJcbmludGVyZmFjZSBJUGFja2FnZUpzb24ge1xyXG4gIGRlYnVnPzoge1xyXG4gICAgZW52Pzoge1xyXG4gICAgICBWSVRFX0RFVl9TRVJWRVJfVVJMPzogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIGRlcGVuZGVuY2llcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbiAgZGV2RGVwZW5kZW5jaWVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxufVxyXG5cclxuY29uc3QgdHlwZWRQa2cgPSBwa2cgYXMgSVBhY2thZ2VKc29uO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT0gXHU5MTREXHU3RjZFXHU1QkZDXHU1MUZBID09PT09PT09PT09PT09PT09PT09XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KTogVXNlckNvbmZpZyA9PiB7XHJcbiAgLy8gXHU2RTA1XHU3NDA2XHU2NUU3XHU3Njg0XHU2Nzg0XHU1RUZBXHU0RUE3XHU3MjY5XHJcbiAgZnMucm1TeW5jKCdkaXN0LWVsZWN0cm9uJywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xyXG5cclxuICBjb25zdCBpc1NlcnZlOiBib29sZWFuID0gY29tbWFuZCA9PT0gJ3NlcnZlJztcclxuICBjb25zdCBpc0J1aWxkOiBib29sZWFuID0gY29tbWFuZCA9PT0gJ2J1aWxkJztcclxuICBjb25zdCBzb3VyY2VtYXA6IGJvb2xlYW4gfCAnaW5saW5lJyA9IGlzU2VydmUgfHwgISFwcm9jZXNzLmVudi5WU0NPREVfREVCVUc7XHJcblxyXG4gIC8vIFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OCBVUkxcclxuICBjb25zdCB2aXRlRGV2U2VydmVyVXJsOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5WU0NPREVfREVCVUcgPyB0eXBlZFBrZy5kZWJ1Zz8uZW52Py5WSVRFX0RFVl9TRVJWRVJfVVJMIHx8ICcnIDogJ2h0dHA6Ly8xOTIuMTY4Ljg4LjEyOjYxMDInO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLy8gPT09PT0gXHU2M0QyXHU0RUY2XHU5MTREXHU3RjZFID09PT09XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIC8vIFZ1ZSBSb3V0ZXIgXHU4MUVBXHU1MkE4XHU4REVGXHU3NTMxXHJcbiAgICAgIFZ1ZVJvdXRlcih7XHJcbiAgICAgICAgZXh0ZW5zaW9uczogWycudnVlJ10sXHJcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBWdWUgTWFjcm9zXHVGRjA4XHU1ODlFXHU1RjNBIFZ1ZSBcdTUyOUZcdTgwRkRcdUZGMDlcclxuICAgICAgVnVlTWFjcm9zKHtcclxuICAgICAgICBwbHVnaW5zOiB7XHJcbiAgICAgICAgICB2dWU6IFZ1ZSgpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gQVBJIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAndnVlJyxcclxuICAgICAgICAgICdAdnVldXNlL2hlYWQnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgICBWdWVSb3V0ZXJBdXRvSW1wb3J0cyxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJ3Z1ZS1yb3V0ZXIvYXV0byc6IFsndXNlTGluayddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgICAgZGlyczogWydzcmMvY29tcG9zYWJsZXMnXSxcclxuICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTdFQzRcdTRFRjZcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbTmFpdmVVaVJlc29sdmVyKCldLFxyXG4gICAgICAgIGR0czogZmFsc2UsXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gVW5vQ1NTXHJcbiAgICAgIFVub2NzcygpLFxyXG5cclxuICAgICAgLy8gRWxlY3Ryb24gXHU2Nzg0XHU1RUZBXHJcbiAgICAgIGVsZWN0cm9uKHtcclxuICAgICAgICBtYWluOiB7XHJcbiAgICAgICAgICBlbnRyeTogJ2VsZWN0cm9uL21haW4vaW5kZXgudHMnLFxyXG4gICAgICAgICAgb25zdGFydCh7IHN0YXJ0dXAgfSkge1xyXG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tzdGFydHVwXSBFbGVjdHJvbiBBcHAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdGFydHVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB2aXRlOiB7XHJcbiAgICAgICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgICAgc291cmNlbWFwLFxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL21haW4nLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cyh0eXBlZFBrZy5kZXBlbmRlbmNpZXMgfHwge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJlbG9hZDoge1xyXG4gICAgICAgICAgaW5wdXQ6ICdlbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzJyxcclxuICAgICAgICAgIHZpdGU6IHtcclxuICAgICAgICAgICAgYnVpbGQ6IHtcclxuICAgICAgICAgICAgICBzb3VyY2VtYXA6IHNvdXJjZW1hcCA/ICdpbmxpbmUnIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL3ByZWxvYWQnLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cyh0eXBlZFBrZy5kZXBlbmRlbmNpZXMgfHwge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVuZGVyZXI6IHt9LFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFx1NzlGQlx1OTY2NFx1OERFRlx1NzUzMVx1OEI2Nlx1NTQ0QVxyXG4gICAgICByZW1vdmVOb01hdGNoKCksXHJcbiAgICBdLFxyXG5cclxuICAgIC8vID09PT09IFx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRCA9PT09PVxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKSxcclxuICAgICAgICAnfic6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gPT09PT0gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4ID09PT09XHJcbiAgICBzZXJ2ZXI6IHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVR1xyXG4gICAgICA/ICgoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHR5cGVkUGtnLmRlYnVnPy5lbnY/LlZJVEVfREVWX1NFUlZFUl9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6NjEwMicpO1xyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaG9zdDogdXJsLmhvc3RuYW1lLFxyXG4gICAgICAgICAgICBwb3J0OiBOdW1iZXIodXJsLnBvcnQpLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KSgpXHJcbiAgICAgIDogdW5kZWZpbmVkLFxyXG5cclxuICAgIC8vID09PT09IFx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RSA9PT09PVxyXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDI0LFxyXG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyA9PT09PSBcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0YgPT09PT1cclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX1NFUlZFUl9VUkxfXzogSlNPTi5zdHJpbmdpZnkodml0ZURldlNlcnZlclVybCksXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcInRzcy14aWFvaG9uZ3lhblwiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjMuMTMuMlwiLFxyXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJiYXNlIG9uIEVsZWN0cm9uICsgVnVlICsgTmFpdmUgVUkgY3JlYXRlZCBwcm9qZWN0LlwiLFxyXG4gIFwiYXV0aG9yXCI6IFwiRGFzY29tIDx4eHh4eEBkYXNjb20uY24+XCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJrZXl3b3Jkc1wiOiBbXHJcbiAgICBcImVsZWN0cm9uXCIsXHJcbiAgICBcInJvbGx1cFwiLFxyXG4gICAgXCJ2aXRlXCIsXHJcbiAgICBcInZ1ZTNcIixcclxuICAgIFwidnVlXCJcclxuICBdLFxyXG4gIFwibWFpblwiOiBcImRpc3QtZWxlY3Ryb24vbWFpbi9pbmRleC5qc1wiLFxyXG4gIFwiZGVidWdcIjoge1xyXG4gICAgXCJlbnZcIjoge1xyXG4gICAgICBcIlZJVEVfREVWX1NFUlZFUl9VUkxcIjogXCJodHRwOi8vMTI3LjAuMC4xOjMzNDQvXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiYnVpbGRcIjogXCJ2dWUtdHNjIC0tbm9FbWl0ICYmIHZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlclwiLFxyXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImxpbnRcIjogXCJlc2xpbnRcIixcclxuICAgIFwibGludDpmaXhcIjogXCJlc2xpbnQgLS1maXhcIixcclxuICAgIFwidHlwZWNoZWNrXCI6IFwibnBtIHJ1biB0eXBlY2hlY2s6bm9kZSAmJiBucG0gcnVuIHR5cGVjaGVjazp3ZWJcIixcclxuICAgIFwic3RhcnRcIjogXCJlbGVjdHJvbi12aXRlIHByZXZpZXdcIixcclxuICAgIFwicG9zdGluc3RhbGxcIjogXCJlbGVjdHJvbi1idWlsZGVyIGluc3RhbGwtYXBwLWRlcHNcIixcclxuICAgIFwiYnVpbGQ6dW5wYWNrXCI6IFwibnBtIHJ1biBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyIC0tZGlyXCIsXHJcbiAgICBcImJ1aWxkOndpblwiOiBcInZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLXdpblwiLFxyXG4gICAgXCJidWlsZDptYWNcIjogXCJ2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS1tYWNcIixcclxuICAgIFwiZWxlY3Ryb24tdXBkYXRlclwiOiBcIl42LjYuMlwiLFxyXG4gICAgXCJsb2Rhc2guZXNjYXBlcmVnZXhwXCI6IFwiXjQuMS4yXCIsXHJcbiAgICBcImxvZGFzaC5pc2VxdWFsXCI6IFwiXjQuNS4wXCIsXHJcbiAgICBcImJ1aWxkOmxpbnV4XCI6IFwidml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyIC0tbGludXhcIixcclxuICAgIFwidXBcIjogXCJ0YXplIG1ham9yIC1JXCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjIuMTUuMlwiLFxyXG4gICAgXCJhbnQtZGVzaWduLXZ1ZVwiOiBcIl40LjIuNVwiLFxyXG4gICAgXCJheGlvc1wiOiBcIl4xLjkuMFwiLFxyXG4gICAgXCJzaW1wbGUta2V5Ym9hcmRcIjogXCJeMy44LjQzXCIsXHJcbiAgICBcInRzLW1kNVwiOiBcIl4xLjMuMVwiLFxyXG4gICAgXCJ2LXZpZXdlclwiOiBcIl4zLjAuMjJcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCI5LjkuMFwiLFxyXG4gICAgXCJ2dWUzLWNvdW50LXRvXCI6IFwiXjEuMS4yXCIsXHJcbiAgICBcInZ1ZTMtc2VhbWxlc3Mtc2Nyb2xsXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcInZ4ZS1wYy11aVwiOiBcIjQuMy42XCIsXHJcbiAgICBcInZ4ZS10YWJsZVwiOiBcIjQuOS44XCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGFudGZ1L2VzbGludC1jb25maWdcIjogXCJeNC4xMi4wXCIsXHJcbiAgICBcIkBhcmNvLWRlc2lnbi9jb2xvclwiOiBcIl4wLjQuMFwiLFxyXG4gICAgXCJAdW5vY3NzL2VzbGludC1wbHVnaW5cIjogXCJeMC42MS41XCIsXHJcbiAgICBcIkB1bm9jc3MvcHJlc2V0LXJlbS10by1weFwiOiBcIl4wLjYxLjVcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjUuMC40XCIsXHJcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIl4xMC4xMS4wXCIsXHJcbiAgICBcImVsZWN0cm9uXCI6IFwiXjM1LjIuMVwiLFxyXG4gICAgXCJlbGVjdHJvbi1idWlsZGVyXCI6IFwiXjI0LjEzLjNcIixcclxuICAgIFwiZXNsaW50XCI6IFwiXjkuMjUuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLWZvcm1hdFwiOiBcIl4xLjAuMVwiLFxyXG4gICAgXCJsZXNzXCI6IFwiXjQuMy4wXCIsXHJcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjUuMVwiLFxyXG4gICAgXCJuYWl2ZS11aVwiOiBcIl4yLjM5LjBcIixcclxuICAgIFwicGluaWFcIjogXCJeMy4wLjJcIixcclxuICAgIFwic2Fzc1wiOiBcIl4xLjg3LjBcIixcclxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy40LjEzXCIsXHJcbiAgICBcInRhemVcIjogXCJeMTkuMC40XCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS40LjJcIixcclxuICAgIFwidW5vY3NzXCI6IFwiXjAuNjEuNVwiLFxyXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE3LjZcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNy4yXCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1tYWNyb3NcIjogXCJeMi4xMC4wXCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1yb3V0ZXJcIjogXCJeMC4xMC4xXCIsXHJcbiAgICBcInZpdGVcIjogXCJeNS4xLjVcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb25cIjogXCJeMC4yOC40XCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXCI6IFwiXjAuMTQuNVwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1yb3V0ZXItd2FyblwiOiBcIl4xLjAuMFwiLFxyXG4gICAgXCJ2dWVcIjogXCJeMy40LjIxXCIsXHJcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC40LjBcIixcclxuICAgIFwidnVlLXRzY1wiOiBcIl4yLjAuNlwiXHJcbiAgfSxcclxuICBcInNpbXBsZS1naXQtaG9va3NcIjoge1xyXG4gICAgXCJwcmUtY29tbWl0XCI6IFwieWFybiBsaW50LXN0YWdlZFwiXHJcbiAgfSxcclxuICBcImxpbnQtc3RhZ2VkXCI6IHtcclxuICAgIFwiKlwiOiBcImVzbGludCAtLWZpeFwiXHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFDdEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sY0FBYztBQUNyQixPQUFPLG1CQUFtQjs7O0FDYjFCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFRO0FBQUEsRUFDUixPQUFTO0FBQUEsSUFDUCxLQUFPO0FBQUEsTUFDTCxxQkFBdUI7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULEtBQU87QUFBQSxJQUNQLE9BQVM7QUFBQSxJQUNULFNBQVc7QUFBQSxJQUNYLE1BQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFdBQWE7QUFBQSxJQUNiLE9BQVM7QUFBQSxJQUNULGFBQWU7QUFBQSxJQUNmLGdCQUFnQjtBQUFBLElBQ2hCLGFBQWE7QUFBQSxJQUNiLGFB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
