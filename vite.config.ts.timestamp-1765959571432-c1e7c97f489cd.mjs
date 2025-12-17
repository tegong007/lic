// vite.config.ts
import fs from "node:fs";
import path from "node:path";
import Vue from "file:///D:/TSS_Xiaohongyan/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Unocss from "file:///D:/TSS_Xiaohongyan/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-auto-import/dist/vite.js";
import { NaiveUiResolver } from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-vue-components/dist/vite.js";
import VueMacros from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-vue-macros/dist/vite.js";
import { VueRouterAutoImports } from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-vue-router/dist/index.js";
import VueRouter from "file:///D:/TSS_Xiaohongyan/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig } from "file:///D:/TSS_Xiaohongyan/node_modules/vite/dist/node/index.js";
import electron from "file:///D:/TSS_Xiaohongyan/node_modules/vite-plugin-electron/dist/simple.mjs";
import removeNoMatch from "file:///D:/TSS_Xiaohongyan/node_modules/vite-plugin-router-warn/dist/index.mjs";

// package.json
var package_default = {
  name: "tss-xiaohongyan",
  type: "module",
  version: "1.0.13.4",
  private: true,
  description: "base on Electron + Vue + Naive UI created project.",
  author: "Dascom",
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
var vite_config_default = defineConfig(({ command }) => {
  fs.rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  const viteDevServerUrl = process.env.VSCODE_DEBUG ? package_default.debug.env.VITE_DEV_SERVER_URL : "http://192.168.88.12:6102";
  return {
    plugins: [
      VueRouter({ extensions: [".vue"], dts: "src/typed-router.d.ts" }),
      VueMacros({ plugins: { vue: Vue() } }),
      AutoImport({
        imports: [
          "vue",
          "@vueuse/head",
          "@vueuse/core",
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            "vue-router/auto": ["useLink"]
          }
        ],
        dts: "src/auto-imports.d.ts",
        dirs: ["src/composables"],
        vueTemplate: true
      }),
      Components({ resolvers: [NaiveUiResolver()], dts: false }),
      Unocss(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
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
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {}
      }),
      removeNoMatch()
      // vueI18nPlugin({
      //   include: path.resolve(__dirname, "./src/i18n/locales"),
      //   runtimeOnly: false,
      // }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
        "~": path.resolve(process.cwd())
      }
    },
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(package_default.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port
      };
    })(),
    clearScreen: false,
    build: {
      chunkSizeWarningLimit: 1024,
      // chunk 大小警告的限制（单位kb）
      target: "esnext"
    },
    define: {
      __SERVER_URL__: JSON.stringify(viteDevServerUrl)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVFNTX1hpYW9ob25neWFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxUU1NfWGlhb2hvbmd5YW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1RTU19YaWFvaG9uZ3lhbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcclxuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJztcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XHJcbmltcG9ydCB7IE5haXZlVWlSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xyXG5pbXBvcnQgVnVlTWFjcm9zIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZSc7XHJcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcic7XHJcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJztcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnO1xyXG5pbXBvcnQgcmVtb3ZlTm9NYXRjaCBmcm9tICd2aXRlLXBsdWdpbi1yb3V0ZXItd2Fybic7XHJcbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xyXG4vLyBpbXBvcnQgdnVlSTE4blBsdWdpbiBmcm9tIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZVwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIC8vIGNvbnN0IHZpdGVFbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xyXG4gIGZzLnJtU3luYygnZGlzdC1lbGVjdHJvbicsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KTtcclxuXHJcbiAgY29uc3QgaXNTZXJ2ZSA9IGNvbW1hbmQgPT09ICdzZXJ2ZSc7XHJcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCc7XHJcbiAgY29uc3Qgc291cmNlbWFwID0gaXNTZXJ2ZSB8fCAhIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRztcclxuXHJcbiAgLy8gXHU1QjlBXHU0RTQ5XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcbiAgY29uc3Qgdml0ZURldlNlcnZlclVybCA9IHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRyA/IHBrZy5kZWJ1Zy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCA6ICdodHRwOi8vMTkyLjE2OC44OC4xMjo2MTAyJztcclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBWdWVSb3V0ZXIoeyBleHRlbnNpb25zOiBbJy52dWUnXSwgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyB9KSxcclxuICAgICAgVnVlTWFjcm9zKHsgcGx1Z2luczogeyB2dWU6IFZ1ZSgpIH0gfSksXHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAgICd2dWUnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvaGVhZCcsXHJcbiAgICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcclxuICAgICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBhZGQgYW55IG90aGVyIGltcG9ydHMgeW91IHdlcmUgcmVseWluZyBvblxyXG4gICAgICAgICAgICAndnVlLXJvdXRlci9hdXRvJzogWyd1c2VMaW5rJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgICBkaXJzOiBbJ3NyYy9jb21wb3NhYmxlcyddLFxyXG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7IHJlc29sdmVyczogW05haXZlVWlSZXNvbHZlcigpXSwgZHRzOiBmYWxzZSB9KSxcclxuICAgICAgVW5vY3NzKCksXHJcbiAgICAgIGVsZWN0cm9uKHtcclxuICAgICAgICBtYWluOiB7XHJcbiAgICAgICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQubGliLmVudHJ5YFxyXG4gICAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluL2luZGV4LnRzJyxcclxuICAgICAgICAgIG9uc3RhcnQoeyBzdGFydHVwIH0pIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKC8qIEZvciBgLnZzY29kZS8uZGVidWcuc2NyaXB0Lm1qc2AgKi8gJ1tzdGFydHVwXSBFbGVjdHJvbiBBcHAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdGFydHVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB2aXRlOiB7XHJcbiAgICAgICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgICAgc291cmNlbWFwLFxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL21haW4nLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIC8vIFNvbWUgdGhpcmQtcGFydHkgTm9kZS5qcyBsaWJyYXJpZXMgbWF5IG5vdCBiZSBidWlsdCBjb3JyZWN0bHkgYnkgVml0ZSwgZXNwZWNpYWxseSBgQy9DKytgIGFkZG9ucyxcclxuICAgICAgICAgICAgICAgIC8vIHdlIGNhbiB1c2UgYGV4dGVybmFsYCB0byBleGNsdWRlIHRoZW0gdG8gZW5zdXJlIHRoZXkgd29yayBjb3JyZWN0bHkuXHJcbiAgICAgICAgICAgICAgICAvLyBPdGhlcnMgbmVlZCB0byBwdXQgdGhlbSBpbiBgZGVwZW5kZW5jaWVzYCB0byBlbnN1cmUgdGhleSBhcmUgY29sbGVjdGVkIGludG8gYGFwcC5hc2FyYCBhZnRlciB0aGUgYXBwIGlzIGJ1aWx0LlxyXG4gICAgICAgICAgICAgICAgLy8gT2YgY291cnNlLCB0aGlzIGlzIG5vdCBhYnNvbHV0ZSwganVzdCB0aGlzIHdheSBpcyByZWxhdGl2ZWx5IHNpbXBsZS4gOilcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJlbG9hZDoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxyXG4gICAgICAgICAgLy8gUHJlbG9hZCBzY3JpcHRzIG1heSBjb250YWluIFdlYiBhc3NldHMsIHNvIHVzZSB0aGUgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgIGluc3RlYWQgYGJ1aWxkLmxpYi5lbnRyeWAuXHJcbiAgICAgICAgICBpbnB1dDogJ2VsZWN0cm9uL3ByZWxvYWQvaW5kZXgudHMnLFxyXG4gICAgICAgICAgdml0ZToge1xyXG4gICAgICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICAgIHNvdXJjZW1hcDogc291cmNlbWFwID8gJ2lubGluZScgOiB1bmRlZmluZWQsIC8vICMzMzJcclxuICAgICAgICAgICAgICBtaW5pZnk6IGlzQnVpbGQsXHJcbiAgICAgICAgICAgICAgb3V0RGlyOiAnZGlzdC1lbGVjdHJvbi9wcmVsb2FkJyxcclxuICAgICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoJ2RlcGVuZGVuY2llcycgaW4gcGtnID8gcGtnLmRlcGVuZGVuY2llcyA6IHt9KSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFBsb3lmaWxsIHRoZSBFbGVjdHJvbiBhbmQgTm9kZS5qcyBBUEkgZm9yIFJlbmRlcmVyIHByb2Nlc3MuXHJcbiAgICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cclxuICAgICAgICAvLyBTZWUgXHVEODNEXHVEQzQ5IGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXHJcbiAgICAgICAgcmVuZGVyZXI6IHt9LFxyXG4gICAgICB9KSxcclxuICAgICAgcmVtb3ZlTm9NYXRjaCgpLFxyXG4gICAgICAvLyB2dWVJMThuUGx1Z2luKHtcclxuICAgICAgLy8gICBpbmNsdWRlOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2kxOG4vbG9jYWxlc1wiKSxcclxuICAgICAgLy8gICBydW50aW1lT25seTogZmFsc2UsXHJcbiAgICAgIC8vIH0pLFxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjJyksXHJcbiAgICAgICAgJ34nOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOlxyXG4gICAgICBwcm9jZXNzLmVudi5WU0NPREVfREVCVUcgJiZcclxuICAgICAgKCgpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBrZy5kZWJ1Zy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGhvc3Q6IHVybC5ob3N0bmFtZSxcclxuICAgICAgICAgIHBvcnQ6ICt1cmwucG9ydCxcclxuICAgICAgICB9O1xyXG4gICAgICB9KSgpLFxyXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDI0LCAvLyBjaHVuayBcdTU5MjdcdTVDMEZcdThCNjZcdTU0NEFcdTc2ODRcdTk2NTBcdTUyMzZcdUZGMDhcdTUzNTVcdTRGNERrYlx1RkYwOVxyXG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX1NFUlZFUl9VUkxfXzogSlNPTi5zdHJpbmdpZnkodml0ZURldlNlcnZlclVybCksXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcInRzcy14aWFvaG9uZ3lhblwiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjEuMC4xMy40XCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcImJhc2Ugb24gRWxlY3Ryb24gKyBWdWUgKyBOYWl2ZSBVSSBjcmVhdGVkIHByb2plY3QuXCIsXHJcbiAgXCJhdXRob3JcIjogXCJEYXNjb21cIixcclxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcclxuICBcImtleXdvcmRzXCI6IFtcclxuICAgIFwiZWxlY3Ryb25cIixcclxuICAgIFwicm9sbHVwXCIsXHJcbiAgICBcInZpdGVcIixcclxuICAgIFwidnVlM1wiLFxyXG4gICAgXCJ2dWVcIlxyXG4gIF0sXHJcbiAgXCJtYWluXCI6IFwiZGlzdC1lbGVjdHJvbi9tYWluL2luZGV4LmpzXCIsXHJcbiAgXCJkZWJ1Z1wiOiB7XHJcbiAgICBcImVudlwiOiB7XHJcbiAgICAgIFwiVklURV9ERVZfU0VSVkVSX1VSTFwiOiBcImh0dHA6Ly8xMjcuMC4wLjE6MzM0NC9cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxyXG4gICAgXCJidWlsZFwiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyXCIsXHJcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcclxuICAgIFwibGludFwiOiBcImVzbGludFwiLFxyXG4gICAgXCJsaW50OmZpeFwiOiBcImVzbGludCAtLWZpeFwiLFxyXG4gICAgXCJ0eXBlY2hlY2tcIjogXCJucG0gcnVuIHR5cGVjaGVjazpub2RlICYmIG5wbSBydW4gdHlwZWNoZWNrOndlYlwiLFxyXG4gICAgXCJzdGFydFwiOiBcImVsZWN0cm9uLXZpdGUgcHJldmlld1wiLFxyXG4gICAgXCJwb3N0aW5zdGFsbFwiOiBcImVsZWN0cm9uLWJ1aWxkZXIgaW5zdGFsbC1hcHAtZGVwc1wiLFxyXG4gICAgXCJidWlsZDp1bnBhY2tcIjogXCJucG0gcnVuIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS1kaXJcIixcclxuICAgIFwiYnVpbGQ6d2luXCI6IFwidml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyIC0td2luXCIsXHJcbiAgICBcImJ1aWxkOm1hY1wiOiBcInZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLW1hY1wiLFxyXG4gICAgXCJlbGVjdHJvbi11cGRhdGVyXCI6IFwiXjYuNi4yXCIsXHJcbiAgICBcImxvZGFzaC5lc2NhcGVyZWdleHBcIjogXCJeNC4xLjJcIixcclxuICAgIFwibG9kYXNoLmlzZXF1YWxcIjogXCJeNC41LjBcIixcclxuICAgIFwiYnVpbGQ6bGludXhcIjogXCJ2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS1saW51eFwiLFxyXG4gICAgXCJ1cFwiOiBcInRhemUgbWFqb3IgLUlcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMi4xNS4yXCIsXHJcbiAgICBcImFudC1kZXNpZ24tdnVlXCI6IFwiXjQuMi41XCIsXHJcbiAgICBcImF4aW9zXCI6IFwiXjEuOS4wXCIsXHJcbiAgICBcInNpbXBsZS1rZXlib2FyZFwiOiBcIl4zLjguNDNcIixcclxuICAgIFwidHMtbWQ1XCI6IFwiXjEuMy4xXCIsXHJcbiAgICBcInYtdmlld2VyXCI6IFwiXjMuMC4yMlwiLFxyXG4gICAgXCJ2dWUtaTE4blwiOiBcIjkuOS4wXCIsXHJcbiAgICBcInZ1ZTMtY291bnQtdG9cIjogXCJeMS4xLjJcIixcclxuICAgIFwidnVlMy1zZWFtbGVzcy1zY3JvbGxcIjogXCJeMi4wLjFcIixcclxuICAgIFwidnhlLXBjLXVpXCI6IFwiNC4zLjZcIixcclxuICAgIFwidnhlLXRhYmxlXCI6IFwiNC45LjhcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAYW50ZnUvZXNsaW50LWNvbmZpZ1wiOiBcIl40LjEyLjBcIixcclxuICAgIFwiQGFyY28tZGVzaWduL2NvbG9yXCI6IFwiXjAuNC4wXCIsXHJcbiAgICBcIkB1bm9jc3MvZXNsaW50LXBsdWdpblwiOiBcIl4wLjYxLjVcIixcclxuICAgIFwiQHVub2Nzcy9wcmVzZXQtcmVtLXRvLXB4XCI6IFwiXjAuNjEuNVwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4wLjRcIixcclxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjExLjBcIixcclxuICAgIFwiZWxlY3Ryb25cIjogXCJeMzUuMi4xXCIsXHJcbiAgICBcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCJeMjQuMTMuM1wiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOS4yNS4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tZm9ybWF0XCI6IFwiXjEuMC4xXCIsXHJcbiAgICBcImxlc3NcIjogXCJeNC4zLjBcIixcclxuICAgIFwibGludC1zdGFnZWRcIjogXCJeMTUuNS4xXCIsXHJcbiAgICBcIm5haXZlLXVpXCI6IFwiXjIuMzkuMFwiLFxyXG4gICAgXCJwaW5pYVwiOiBcIl4zLjAuMlwiLFxyXG4gICAgXCJzYXNzXCI6IFwiXjEuODcuMFwiLFxyXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjQuMTNcIixcclxuICAgIFwidGF6ZVwiOiBcIl4xOS4wLjRcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjQuMlwiLFxyXG4gICAgXCJ1bm9jc3NcIjogXCJeMC42MS41XCIsXHJcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTcuNlwiLFxyXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI3LjJcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLW1hY3Jvc1wiOiBcIl4yLjEwLjBcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiOiBcIl4wLjEwLjFcIixcclxuICAgIFwidml0ZVwiOiBcIl41LjEuNVwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1lbGVjdHJvblwiOiBcIl4wLjI4LjRcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcIjogXCJeMC4xNC41XCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLXJvdXRlci13YXJuXCI6IFwiXjEuMC4wXCIsXHJcbiAgICBcInZ1ZVwiOiBcIl4zLjQuMjFcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjQuMFwiLFxyXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjIuMC42XCJcclxuICB9LFxyXG4gIFwic2ltcGxlLWdpdC1ob29rc1wiOiB7XHJcbiAgICBcInByZS1jb21taXRcIjogXCJ5YXJuIGxpbnQtc3RhZ2VkXCJcclxuICB9LFxyXG4gIFwibGludC1zdGFnZWRcIjoge1xyXG4gICAgXCIqXCI6IFwiZXNsaW50IC0tZml4XCJcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0TyxPQUFPLFFBQVE7QUFDM1AsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZUFBZTtBQUN0QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGNBQWM7QUFDckIsT0FBTyxtQkFBbUI7OztBQ1oxQjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsU0FBVztBQUFBLEVBQ1gsVUFBWTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBUTtBQUFBLEVBQ1IsT0FBUztBQUFBLElBQ1AsS0FBTztBQUFBLE1BQ0wscUJBQXVCO0FBQUEsSUFDekI7QUFBQSxFQUNG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
