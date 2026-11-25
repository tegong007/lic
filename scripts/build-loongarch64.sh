#!/usr/bin/env bash
#
# 龙芯 3A6000 (LoongArch64) 打包脚本
#
# 用途：不用 electron-builder（它不支持 loong64），而是：
#   1. vite build 产出与架构无关的前端资源
#   2. 以 loong64 版 Electron 为运行时，组装成应用目录
#   3. 用 dpkg-deb 打成 deb 包（无需 fpm / ruby）
#
# 前置条件（在龙芯机器上执行）：
#   - 已 node scripts/setup-loongarch64.cjs 装好 loong64 Electron
#   - 已 npm install
#
# 用法：
#   bash scripts/build-loongarch64.sh            # 构建 + 打 deb
#   bash scripts/build-loongarch64.sh --no-deb   # 只构建应用目录，不打 deb
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PRODUCT_NAME="Light-Ink-Craftsman"
APP_ID="com.dascom.cabinet"
VERSION="$(node -p "require('./package.json').version")"
MAINTAINER="dascom.com"

STAGE="$ROOT/release/loongarch64"
APPDIR="$STAGE/opt/$APP_ID"
DEB_ROOT="$STAGE/deb"
DEB_OUT="$ROOT/release"

MAKE_DEB=1
for arg in "$@"; do
  case "$arg" in
    --no-deb) MAKE_DEB=0 ;;
    *) echo "未知参数: $arg"; exit 1 ;;
  esac
done

log()  { printf '\033[36m[build-loongarch64]\033[0m %s\n' "$*"; }
fail() { printf '\033[31m[build-loongarch64] 错误:\033[0m %s\n' "$*" >&2; exit 1; }

# ---------- 0. 环境检查 ----------
ELECTRON_DIST="$ROOT/node_modules/electron/dist"
[ -x "$ELECTRON_DIST/electron" ] || fail "未找到 loong64 Electron，请先执行: node scripts/setup-loongarch64.cjs"
log "Electron 运行时: $ELECTRON_DIST"

# ---------- 1. 构建前端 ----------
log "构建前端 (vite build)..."
npx vite build
[ -f "$ROOT/dist/index.html" ] || fail "vite build 未产出 dist/index.html"

# ---------- 2. 组装应用目录 ----------
log "组装应用目录..."
rm -rf "$STAGE"
mkdir -p "$APPDIR/resources"

# 复制 Electron 运行时（整个 dist）
cp -a "$ELECTRON_DIST/." "$APPDIR/"

# 应用代码放进 resources/app（与 electron-builder 的默认布局一致）
mkdir -p "$APPDIR/resources/app"
cp -a "$ROOT/dist"            "$APPDIR/resources/app/dist"
cp -a "$ROOT/dist-electron"   "$APPDIR/resources/app/dist-electron"
cp -a "$ROOT/public"          "$APPDIR/resources/app/public"
cp    "$ROOT/package.json"    "$APPDIR/resources/app/package.json"

# 主进程用 resources/app/public/configProd.json 读配置（见 electron/main/index.ts readConfig）
[ -f "$APPDIR/resources/app/public/configProd.json" ] || fail "缺少 configProd.json"

# 重命名可执行文件为产品名，并写 path.txt
mv "$APPDIR/electron" "$APPDIR/$PRODUCT_NAME"
ln -sf "$PRODUCT_NAME" "$APPDIR/electron"

# 清理 launch 默认入口（可能存在 conflict）
[ -f "$APPDIR/resources/default_app.asar" ] && rm -f "$APPDIR/resources/default_app.asar"

log "应用目录: $APPDIR"

if [ "$MAKE_DEB" -eq 0 ]; then
  log "已跳过 deb 打包（--no-deb）"
  exit 0
fi

# ---------- 3. 打 deb ----------
log "生成 deb 包..."
rm -rf "$DEB_ROOT"
mkdir -p "$DEB_ROOT/DEBIAN"
mkdir -p "$DEB_ROOT/opt"
mkdir -p "$DEB_ROOT/usr/share/applications"
mkdir -p "$DEB_ROOT/usr/share/icons/hicolor/256x256/apps"

cp -a "$APPDIR" "$DEB_ROOT/opt/$APP_ID"

# 注意：Node 的 process.arch 是 loong64，但 dpkg 认的是 loongarch64
cat > "$DEB_ROOT/DEBIAN/control" <<EOF
Package: ${APP_ID}
Version: ${VERSION}
Section: utils
Priority: optional
Architecture: loongarch64
Maintainer: ${MAINTAINER}
Installed-Size: $(du -sk "$DEB_ROOT" | cut -f1)
Description: Light-Ink-Craftsman desktop application
 Electron based desktop client for Dascom label printing.
EOF

# 桌面快捷方式
cat > "$DEB_ROOT/usr/share/applications/${APP_ID}.desktop" <<EOF
[Desktop Entry]
Name=${PRODUCT_NAME}
Exec=/opt/${APP_ID}/${PRODUCT_NAME} %U
Terminal=false
Type=Application
Icon=${APP_ID}
StartupWMClass=${PRODUCT_NAME}
Categories=Utility;
EOF

# 图标（256x256）
if [ -f "$ROOT/public/icon/256x256.png" ]; then
  cp "$ROOT/public/icon/256x256.png" "$DEB_ROOT/usr/share/icons/hicolor/256x256/apps/${APP_ID}.png"
fi

# 权限
chmod 755 "$DEB_ROOT/DEBIAN"
find "$DEB_ROOT/opt" -type d -exec chmod 755 {} +
chmod 755 "$DEB_ROOT/opt/$APP_ID/$PRODUCT_NAME"

DEB_FILE="$DEB_OUT/${PRODUCT_NAME}-linux-loongarch64-v${VERSION}.deb"

# fakeroot 存在则用它，保证 control 文件权限正确
if command -v fakeroot >/dev/null 2>&1; then
  fakeroot dpkg-deb --build --root-owner-group "$DEB_ROOT" "$DEB_FILE"
else
  dpkg-deb --build "$DEB_ROOT" "$DEB_FILE"
fi

log "完成: $DEB_FILE"
log "安装: sudo dpkg -i \"$DEB_FILE\""
