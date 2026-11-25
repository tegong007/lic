# 龙芯 3A6000 (LoongArch64) 构建与打包

本文档记录如何把本项目在龙芯 3A6000（LoongArch64，麒麟 V10 / Loongnix）上构建并打包成 deb。

## 一、为什么要特殊处理

Electron 官方**不提供 loong64 二进制**，而本项目依赖 Electron 35.x。具体卡点：

| 卡点 | 现象 | 处理 |
|---|---|---|
| Electron 无 loong64 版 | `npm install` 时报下载失败 / 404 | 用社区移植版 `darkyzhou/electron-loong64` |
| checksums 校验失败 | `install.js` 拿本地 `checksums.json` 校验，里面没有 loong64 条目，sumchecker 直接抛错 | 走自建下载逻辑，跳过官方校验 |
| electron-builder 不支持 | `Arch` 枚举只有 `ia32/x64/armv7l/arm64`，`archFromString('loong64')` 抛 `Unsupported arch loong64` | **不用 electron-builder**，改用 `vite build` + 手工组装 + `dpkg-deb` |
| `app-builder-bin` 缺 loong64 | 只有 `linux/{arm,arm64,ia32,x64}`，找不到 `linux/loong64/app-builder` | 同上，绕开 builder |
| arch 名称不一致 | Node 的 `process.arch` 是 `loong64`，dpkg 认 `loongarch64` | deb 的 `control` 文件里写 `Architecture: loongarch64` |

**好消息**：本项目运行时依赖里**没有任何原生模块**（`.node` 全是构建期工具的），所以不需要 node-gyp 重编。

## 二、前提

- Node.js ≥ 18（建议 22）
- 项目源码（**不要拷贝 `node_modules` 和 `yarn.lock`**，里面锁的是 win32/x64 平台包）

## 三、操作步骤

### 1. 拷贝源码到龙芯机器

排除 `node_modules`、`dist`、`dist-electron`、`release`、`yarn.lock`。

### 2. 一条命令装依赖

```bash
npm run loong64:install
```

这条命令做两件事：
- `npm install --ignore-scripts`：跳过后装脚本（避免 electron postinstall 去下载不存在的官方 loong64 包）
- `node scripts/setup-loongarch64.cjs`：装 loong64 版 Electron

**离线包优先**：脚本会先找 `vendor/electron-v35.4.0-linux-loong64.zip`，存在就直接解压，**完全不联网**。该文件已随项目放在 `vendor/` 下（112MB，gitignore 忽略，需随源码一起拷贝）。

只有在 `vendor/` 里没有时，才会联网下载，可用镜像：

```bash
node scripts/setup-loongarch64.cjs --mirror https://ghfast.top/https://github.com
```

强制只用本地包、绝不联网：

```bash
node scripts/setup-loongarch64.cjs --from-cache
```

### 3. 构建并打包

```bash
npm run loong64:build
```

产出：`release/Light-Ink-Craftsman-linux-loongarch64-v<版本>.deb`

只想构建目录、不打 deb：

```bash
bash scripts/build-loongarch64.sh --no-deb
```

### 4. 安装

```bash
sudo dpkg -i release/Light-Ink-Craftsman-linux-loongarch64-v1.0.13.deb
```

## 四、脚本说明

### `scripts/setup-loongarch64.cjs`

负责装 loong64 版 Electron。

```bash
node scripts/setup-loongarch64.cjs              # 优先 vendor/ 离线包，没有才联网
node scripts/setup-loongarch64.cjs --force      # 强制重装
node scripts/setup-loongarch64.cjs --mirror <前缀>  # 换镜像
node scripts/setup-loongarch64.cjs --from-cache # 只用本地包，绝不联网
```

版本从 `package.json` 的 `devDependencies.electron` 读取（当前锁定 `35.4.0`，与社区移植版一一对应）。

> **注意**：`package.json` 里 electron 必须是**精确版本**（如 `35.4.0`），不能写 `^35.2.1`——社区移植版没有 35.7.5，版本对不上会 404。

### 离线包 `vendor/electron-v35.4.0-linux-loong64.zip`

- 来源：`https://github.com/darkyzhou/electron-loong64/releases/download/v35.4.0/`
- 大小：117,169,801 字节（约 112MB）
- sha256：`37d95342b35c20e36f85ef3cccf8d714e83ca8fd58f8413b0b6b46b251a0f47d`
- 已校验：ELF `e_machine` = 258 (LoongArch)，version 文件为 `35.4.0`
- `vendor/` 在 `.gitignore` 中，**不进 git**，拷贝源码时手动带上

### `scripts/build-loongarch64.sh`

负责构建与打包：

1. `vite build` → 产出 `dist/`（纯前端资源，与架构无关）
2. 以 loong64 Electron 为运行时，把 `dist`、`dist-electron`、`public`、`package.json` 放进 `resources/app/`
3. 用 `dpkg-deb` 打 deb，`Architecture` 写 `loongarch64`

应用的目录结构：

```
opt/com.dascom.cabinet/
├── Light-Ink-Craftsman        # Electron 可执行文件
├── electron -> Light-Ink-Craftsman
├── resources/
│   └── app/
│       ├── dist/              # 前端产物
│       ├── dist-electron/     # 主进程 & preload
│       ├── public/            # 含 configProd.json
│       └── package.json
└── ...                        # Electron 其余文件
```

配置文件按 `electron/main/index.ts` 的 `readConfig()` 读取
`resources/app/public/configProd.json`，脚本已保证该路径存在。

## 五、常见问题

| 现象 | 原因 | 解决 |
|---|---|---|
| `Unsupported arch loong64` | 用了 `electron-builder --linux` | 改用 `npm run loong64:build` |
| `Exec format error` | 用了 x64/arm64 的二进制 | 确认 `node_modules/electron/dist/electron` 是 loong64 版 |
| 下载 404 | 版本在社区移植版里不存在 | 查 [releases](https://github.com/darkyzhou/electron-loong64/releases)，改 `package.json` 的 electron 版本 |
| `dpkg: 架构不匹配` | deb 的 Architecture 写成了 `loong64` | 必须写 `loongarch64`（脚本已处理） |
| 启动白屏 | GPU 问题 | 主进程已 `disable-gpu`；仍不行加 `--disable-software-rasterizer` |
| `Cannot find module '@rollup/rollup-linux-loongarch64-gnu'` | 从 Windows 拷了 `node_modules`/`yarn.lock` | 删掉重新 `npm run loong64:install` |

### 确认 Electron 二进制架构

```bash
file node_modules/electron/dist/electron
# 期望包含 LoongArch 或 64-bit LSB executable
```

## 六、已验证 / 未验证

- ✅ 社区移植版 `electron-v35.4.0-linux-loong64.zip` 已下载到 `vendor/`（112MB），sha256 校验一致
- ✅ 已解包验证：`electron` 二进制 ELF `e_machine`=258（LoongArch），`version` 文件为 `35.4.0`，共 74 个文件
- ✅ 两个脚本语法通过，vendor 优先读取逻辑已就绪
- ⚠️ 未在真实龙芯机器上跑过完整构建，若报错请把日志贴出来
