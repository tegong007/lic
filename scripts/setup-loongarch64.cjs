#!/usr/bin/env node
/**
 * 龙芯 3A6000 (LoongArch64) Electron 二进制安装脚本
 *
 * 背景：Electron 官方不发布 loong64 二进制，npm install 时
 *      node_modules/electron/install.js 会去下载不存在的产物而失败。
 *
 * 做法：从社区移植版 darkyzhou/electron-loong64 下载
 *      electron-v<version>-linux-loong64.zip，解压到 node_modules/electron/dist，
 *      并写好 path.txt。
 *
 * 为什么不用 install.js 的镜像机制：
 *      install.js 会拿本地 checksums.json 做 sha256 校验，而该文件里没有任何
 *      loong64 条目，校验必然失败（sumchecker 直接抛错）。所以走独立下载逻辑。
 *
 * 用法：
 *   node scripts/setup-loongarch64.cjs                    # 优先用 vendor/ 离线包，没有才联网下载
 *   node scripts/setup-loongarch64.cjs --force            # 已装过也强制重装
 *   node scripts/setup-loongarch64.cjs --mirror <前缀>     # 指定 GitHub 镜像
 *   node scripts/setup-loongarch64.cjs --from-cache        # 只用本地包，绝不联网
 *
 * 离线包位置：vendor/electron-v<version>-linux-loong64.zip
 *             （项目已随带该文件时，龙芯机器上无需联网）
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const ELECTRON_DIR = path.join(ROOT, 'node_modules', 'electron');
const DIST_DIR = path.join(ELECTRON_DIR, 'dist');
const CACHE_DIR = path.join(ROOT, '.cache');
const VENDOR_DIR = path.join(ROOT, 'vendor');

const REPO = 'darkyzhou/electron-loong64';
const DEFAULT_MIRROR = 'https://github.com';

function parseArgs(argv) {
  const args = { mirror: DEFAULT_MIRROR, force: false, version: null, fromCache: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--from-cache') args.fromCache = true;
    else if (a === '--mirror') args.mirror = argv[++i];
    else if (a === '--version') args.version = argv[++i];
  }
  return args;
}

const log = (m) => console.log(`[loongarch64] ${m}`);

function fail(m) {
  console.error(`[loongarch64] 错误: ${m}`);
  process.exit(1);
}

/**
 * 解析目标 Electron 版本。
 * 优先读项目 package.json 的 devDependencies.electron（这才是我们锁定的版本），
 * 其次才读 node_modules 里实际装的版本。
 */
function resolveVersion(explicit) {
  if (explicit) return explicit;
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const declared = (pkg.devDependencies && pkg.devDependencies.electron) || (pkg.dependencies && pkg.dependencies.electron);
    if (declared) {
      // 支持 "35.4.0" 这类精确版本；带 ^ ~ 时取其中数字部分
      const m = String(declared).match(/\d+\.\d+\.\d+/);
      if (m) return m[0];
    }
  } catch {}
  try {
    return JSON.parse(fs.readFileSync(path.join(ELECTRON_DIR, 'package.json'), 'utf8')).version;
  } catch {}
  return null;
}

/** 用 curl 下载（能自动读取 HTTP_PROXY / HTTPS_PROXY 环境变量） */
function downloadWithCurl(url, outFile) {
  log('下载中（curl）...');
  try {
    execFileSync(
      'curl',
      ['-fL', '--retry', '3', '--retry-delay', '2', '--connect-timeout', '30', '-o', outFile, url],
      { stdio: ['ignore', 'inherit', 'inherit'] },
    );
  } catch (e) {
    throw new Error(`curl 下载失败（退出码 ${e.status ?? '?'}）`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (process.platform !== 'linux') {
    log(`提示: 当前平台 ${process.platform}，不是 linux。脚本仍可下载并解压，但产物只能在龙芯上运行。`);
  }
  if (process.arch !== 'loong64') {
    log(`提示: 当前架构 ${process.arch}，不是 loong64。若在本机准备产物可忽略。`);
  }

  if (!fs.existsSync(path.join(ELECTRON_DIR, 'package.json'))) {
    fail(`未找到 node_modules/electron，请先执行: npm install --ignore-scripts`);
  }

  const version = resolveVersion(args.version);
  if (!version) fail('无法确定 Electron 版本，请用 --version 指定，例如 --version 35.4.0');
  log(`目标 Electron 版本: ${version}`);

  const pathTxt = path.join(ELECTRON_DIR, 'path.txt');
  const distVersionFile = path.join(DIST_DIR, 'version');
  const distExe = path.join(DIST_DIR, 'electron');

  // 已安装且版本匹配则跳过
  if (!args.force && fs.existsSync(distExe)) {
    let installed = '';
    try {
      installed = fs.readFileSync(distVersionFile, 'utf8').replace(/^v/, '').trim();
    } catch {}
    if (installed === version && fs.existsSync(pathTxt)) {
      log(`已安装 v${version}，跳过。需要重装请加 --force`);
      return;
    }
    if (installed && installed !== version) {
      log(`检测到已装 v${installed}，与目标 v${version} 不符，将重装`);
    }
  }

  const fileName = `electron-v${version}-linux-loong64.zip`;
  const cacheFile = path.join(CACHE_DIR, fileName);
  const vendorFile = path.join(VENDOR_DIR, fileName);

  // 取 zip 的优先级：--from-cache > vendor/ 本地包 > 联网下载 > .cache
  let zipPath = null;
  if (args.fromCache) {
    if (!fs.existsSync(cacheFile) && !fs.existsSync(vendorFile)) {
      fail(
        `缓存中不存在 ${fileName}\n` +
        `  请把它放到以下任一路径后重试:\n` +
        `    ${vendorFile}\n` +
        `    ${cacheFile}`
      );
    }
    zipPath = fs.existsSync(vendorFile) ? vendorFile : cacheFile;
    log(`使用缓存的 zip: ${zipPath}`);
  } else if (fs.existsSync(vendorFile)) {
    zipPath = vendorFile;
    log(`发现本地离线包，直接使用: ${zipPath}`);
  } else {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const base = args.mirror.replace(/\/+$/, '');
    const url = `${base}/${REPO}/releases/download/v${version}/${fileName}`;
    log(`未找到本地离线包(${vendorFile})，改为联网下载`);
    log(`下载地址: ${url}`);
    downloadWithCurl(url, cacheFile);
    zipPath = cacheFile;
  }

  const size = fs.statSync(zipPath).size;
  log(`zip 大小: ${(size / 1048576).toFixed(1)}MB`);

  // 校验 zip 头，防止下到 HTML 错误页
  const fd = fs.openSync(zipPath, 'r');
  const head = Buffer.alloc(4);
  fs.readSync(fd, head, 0, 4, 0);
  fs.closeSync(fd);
  if (head[0] !== 0x50 || head[1] !== 0x4b) {
    fail('下载内容不是有效 zip（可能是错误页/403），请换镜像或用 --from-cache');
  }
  log(`sha256: ${crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex')}`);

  // 解压：先解到临时目录，再用重命名切换，避免递归删除旧文件
  const extract = require(path.join(ROOT, 'node_modules', 'extract-zip'));
  const stagingDir = `${DIST_DIR}.new`;
  const backupDir = `${DIST_DIR}.old`;

  if (fs.existsSync(stagingDir)) {
    for (const name of fs.readdirSync(stagingDir)) {
      fs.rmSync(path.join(stagingDir, name), { recursive: true, force: true });
    }
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  log('解压中...');
  await extract(zipPath, { dir: stagingDir });

  // 切换：旧 dist -> .old，新 -> dist
  if (fs.existsSync(DIST_DIR)) {
    if (fs.existsSync(backupDir)) {
      for (const name of fs.readdirSync(backupDir)) {
        fs.rmSync(path.join(backupDir, name), { recursive: true, force: true });
      }
    }
    fs.renameSync(DIST_DIR, backupDir);
  }
  fs.renameSync(stagingDir, DIST_DIR);
  log('已切换到新的 dist');
  await extract(zipPath, { dir: DIST_DIR });

  // 写 path.txt（install.js 靠它定位可执行文件）
  fs.writeFileSync(pathTxt, 'electron');

  // electron.d.ts 上移，与官方 install.js 行为一致
  const srcTypeDef = path.join(DIST_DIR, 'electron.d.ts');
  if (fs.existsSync(srcTypeDef)) {
    fs.renameSync(srcTypeDef, path.join(ELECTRON_DIR, 'electron.d.ts'));
  }

  if (fs.existsSync(distExe)) {
    fs.chmodSync(distExe, 0o755);
    log('已赋予 electron 可执行权限');
  } else {
    log('警告: dist 中未找到 electron 可执行文件，请检查压缩包结构');
  }

  log(`完成。产物目录: ${DIST_DIR}`);
}

main().catch((e) => fail(e.stack || String(e)));
