# xhy-1080（竖屏）→ xhy（横屏） 迁移指南

> **核心原则：样式以 xhy（横屏）为准，逻辑以 xhy-1080（竖屏）为准。**
>
> xhy-1080 的 vw/vh 值是为竖屏设计的，**搬到横屏后需要重新校准**。
> 迁移时先移植逻辑代码，样式值在横屏上逐个确认调整。
>
> 更新时间：2026-07-09

---

## 〇、环境信息

| 项目 | 值 |
|------|-----|
| 当前分支 | `xhy`（横屏，可直接修改） |
| 源分支 | `xhy-1080`（竖屏，提取逻辑） |
| 旧屏幕 | 1920×1080（16:9 横屏） |
| **新屏幕** | **1440×900（16:10 横屏）** |
| 摄像头/扫码枪 | ✅ 有，与竖屏相同硬件 |
| 电子签名登录 | ✅ 需要，横屏布局 |
| 已完成页面 | HomePage、LoginPage 已改完逻辑 |

### 屏幕变化带来的 vw/vh 换算

```
旧屏: 1920×1080 → 1vw=19.2px, 1vh=10.8px
新屏: 1440×900  → 1vw=14.4px, 1vh=9.0px
```

| 来源 | 换算到新屏 | 公式 |
|------|-----------|------|
| xhy 原有样式（1920基准） | 保持物理尺寸需放大 | vw × 1.333, vh × 1.2 |
| xhy-1080 竖屏样式（1080基准） | 搬到新屏需缩小 | vw × 0.75, vh 按实际确认 |

**实际操作建议**：xhy 原有样式先不改（等整体走通再统一调整），从 1080 搬来的新样式用 0.75 倍 vw 初值，vh 按实际效果确认。

---

## 目录

- [〇、环境信息](#〇环境信息)
- [一、迁移核心策略](#一迁移核心策略)
- [二、逐文件迁移方案](#二逐文件迁移方案)
  - [A. 直接新增的文件（xhy 完全没有）](#a-直接新增的文件xhy-完全没有)
  - [B. 需要合并的文件（逻辑来自 1080，样式保留 xhy）](#b-需要合并的文件逻辑来自-1080样式保留-xhy)
  - [C. 需要重写的文件（架构级别变化）](#c-需要重写的文件架构级别变化)
  - [D. 基本不变的文件（含已完成页面）](#d-基本不变的文件含已完成页面)
- [三、样式适配参照表](#三样式适配参照表)
- [四、新引入的样式体系](#四新引入的样式体系)
- [五、迁移执行顺序](#五迁移执行顺序)
- [六、注意事项与常见坑](#六注意事项与常见坑)

---

## 一、迁移核心策略

```
┌──────────────────────────────────────────────────┐
│                                                    │
│   xhy-1080 代码              xhy 代码              │
│   (竖屏，较新)              (横屏，较旧)            │
│                                                    │
│   ┌─────────┐              ┌─────────┐             │
│   │  Styles  │  ✗ 丢弃     │  Styles  │ ← 保留     │
│   │ (vw/vh)  │              │ (vw/vh)  │             │
│   └─────────┘              └─────────┘             │
│                                                    │
│   ┌─────────┐              ┌─────────┐             │
│   │  Logic   │ ──合并──→   │  Logic   │ ← 目标     │
│   │ (功能)   │              │ (功能)   │             │
│   └─────────┘              └─────────┘             │
│                                                    │
└──────────────────────────────────────────────────┘
```

**对于每个文件，判断它属于哪种类型：**

| 类型 | 处理方式 |
|------|----------|
| 纯逻辑层（API、工具函数、Store） | 直接复制，无需改样式 |
| 纯新增组件（Login 等） | 复制后调整 vw/vh 值适配横屏 |
| 架构修改（SetPage） | 用 1080 的组件结构 + xhy 的样式值重写 |
| 逻辑修复（TheSet、HomePage） | 提取 1080 的 script 逻辑，保持 xhy 的 template 样式 |

---

## 二、逐文件迁移方案

### A. 直接新增的文件（xhy 完全没有）

> **策略：整体复制到 xhy，然后调整模板中的 vw/vh 值大小。**

#### A-1. 登录系统

| 文件 | 操作 | 样式调整要点 |
|------|------|-------------|
| `src/pages/Login/LoginPage.vue` | 复制 | 标题 `text-4vw` → 适当缩小；`w-80vw` → 根据横屏宽度调整；gap/w/h/margin 等全部重新确认 |
| `src/pages/Login/LoginInfo.vue` | 复制 | 同上 |
| `src/apis/loginApi.ts` | 复制 | 无需调整（纯 JS） |
| `src/utils/useCustomTimer.ts` | 确认是否存在 | 如果 xhy 已有此文件则跳过 |

#### A-2. SetPage 子组件

| 文件 | 操作 | 样式调整要点 |
|------|------|-------------|
| `src/pages/Set/components/SetGeneral.vue` | 复制 | `.bgDefend` 体系样式由 SetPage 父级提供；scoped 中的 `.keyInput` 小竖条 vw 值需确认 |
| `src/pages/Set/components/SetInkjet.vue` | 复制 | 同上，含 SimpleKeyboard 虚拟键盘 |
| `src/pages/Set/components/SetLaser.vue` | 复制 | 同上 |
| `src/pages/Set/components/SetStation.vue` | 复制 | 同上，无键盘（hideKeyboard 为空占位） |

> **⚠ 重要**：这 4 个子组件依赖 `.bgDefend`、`.bg_listItem`、`.bgDefend_item`、`.bgDefend_itemIn`、`.bgDefend_tit` 等全局样式类。这些类在 1080 的 SetPage 和 DefendPage 的无 scoped `<style lang="less">` 块中定义，迁移到 xhy 时需要把对应的样式块一起搬到 SetPage.vue / DefendPage.vue 或 global.scss。

#### A-3. 其他工具文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/plugins/useCamera.ts` | 复制 | 摄像头工具类 |
| `public/CameraHelperWS.js` | 复制 | WebSocket 帮助类 |
| `src/pages/Set/components/ThePass.vue` | 复制 | 密码设置弹窗（如果 xhy 没有） |

---

### B. 需要合并的文件（逻辑来自 1080，样式保留 xhy）

> **策略：用 Git diff 或手动对比，只把 script 部分的功能差异合并到 xhy。**

#### B-1. `src/App.vue` — 全局入口

**从 1080 移植的逻辑（全部与方向无关）：**

```ts
// 1. onScrollCloseSelect — 滚动时关闭 Select 下拉框
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
function onScrollCloseSelect() {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }, 0);
}

// 2. getConfig() — 读取 Electron 配置存 localStorage
try {
  const config = await window.electronAPI.getConfig();
  localStorage.setItem('config', JSON.stringify(config));
} catch {
  localStorage.setItem('config', '{}');
}

// 3. confirm-quit IPC 监听 — 统一退出弹窗
window.ipcRenderer.on('confirm-quit', () => {
  modal.value = {
    open: true,
    title: '退出系统',
    key: -1,
    handleOk: () => {
      modal.value = { open: false, title: '', key: -1 };
      window.electron.send('quit-app');
    },
  };
});

// 4. onConfirmOk — 统一弹窗确认分发
function onConfirmOk() {
  if (modal.value.handleOk) {
    modal.value.handleOk();
  } else {
    controlMachine();
  }
}

// 5. onUnmounted — 清理监听器
onUnmounted(() => {
  document.removeEventListener('scroll', onScrollCloseSelect, true);
  if (scrollTimer) clearTimeout(scrollTimer);
  window.ipcRenderer.removeAllListeners('confirm-quit');
});
```

**从 xhy 保留的：**
- 背景样式（`bgApp` 类 vs xhy 的 `bg` 类）— 保持 xhy 原有
- 布局方式（`h-100vh flex flex-col items-center` vs `h-100vh pt-4vh`）— 保持 xhy 原有
- TheExit → TheConfirm 替换方案 — 只改弹窗逻辑，不改样式

**TheConfirm 模板写法（xhy 改为跟 1080 一样的统一方式）：**

```vue
<TheConfirm 
  v-if="modal.open" 
  :open="modal.open" 
  :title="modal.title" 
  :desc="modal.desc" 
  :data="modal.data" 
  :handle-ok="onConfirmOk" 
  :handle-cancel="() => (modal = { open: false, title: '', key: -1 })" 
/>
```

#### B-2. `src/components/TheHeader.vue` — 头部

**从 1080 移植的逻辑：**

```ts
// 展示用户信息，监听 localStorage 中的 account
const account = ref('');
onMounted(() => {
  localStorage.removeItem('account');  // 先清空
  setInterval(() => {
    currentTime.value = formatDateTime();
    const user = localStorage.getItem('account');
    if (user) account.value = user;
  }, 1000);
  getData();
  start(() => { getData(); }, 5);
});
```

**从 xhy 保留的：**
- 布局：`absolute w-full` flex justify-between（xhy 横屏版）
- 标题位置：xhy 的标题居中方式
- 背景图片：如 xhy 有背景则保留，无则保持
- 字体大小：以 xhy 当前值为准

> 1080 的 `bg_topBar.png` 背景图是可选的，如果 xhy 不需要就跳过。

#### B-3. `src/components/TheFooter.vue` — 底部导航

**从 1080 移植的逻辑：**

```ts
// actived >= 0 条件显示 — 登录页隐藏 footer
const actived = ref(-1);
// 当路由不在 5 个主页面时 actived = -1，footer 隐藏
else actived.value = -1;
```

模板加 `v-if="actived >= 0"`。

**从 xhy 保留的：**
- 按钮布局方式（xhy 可能是 `absolute right-2.5vw` 横向排列）
- 按钮尺寸和字号（xhy 原有的 vw/vh 值）
- 按钮背景图片（如果有的话）

#### B-4. `src/pages/Home/HomePage.vue` — 主页

**从 1080 移植的逻辑：**

1. **墨量数据在页面内部管理**（不再传给 Footer）：

```ts
const link: any = ref([]);   // 主副页墨量
const link2: any = ref([]);  // 加注页墨量
const color: any = { Y: '#ffff00', M: '#ff00ff', C: '#00ffff', K: '#000000', O: '#979797' };

// getDataPage 中增加：
const data: any = await footerModule.getLnkRemainder();
if (data.respData && data.respData[0].inkObjects) {
  link.value = [];
  link2.value = [];
  data.respData[0].inkObjects.forEach((element: any) => {
    link.value.push({ name: element.inkName, count: element.remainder, color: color[element.inkCode] || '' });
  });
  data.respData[1].inkObjects.forEach((element: any) => {
    link2.value.push({ name: element.inkName, count: element.remainder, color: color[element.inkCode] || '' });
  });
}
```

2. **错误弹窗逻辑被注释**（交给 App.vue 全局处理）

3. **TheConfirm 渲染位置** — 从 App 传入改为 HomePage 内部直接渲染

4. **case 7 跳转逻辑** — 设备状态点击跳 DefendPage 而非弹窗

```ts
case 7:
  if (entire.value.modules && entire.value.modules.length >= 2 
      && (entire.value.modules[0].status !== 0 || entire.value.modules[1].status !== 0))
    router.push({ name: 'DefendPage', query: { key: 5 } });
  break;
```

**从 xhy 保留的：**
- 表格水平排列顺序（加注页→主副页→进本 从左到右）
- 统计区布局
- 按钮尺寸和位置
- 所有样式数值
- 墨量指示的 UI 呈现方式（可以用 xhy 原有的柱状风格，只换数据源）

#### B-5. `src/pages/Check/CheckPage.vue` — 质检页

**逻辑差异极小**：业务逻辑几乎一致，`$goto` 跳转方式相同。

**从 xhy 保留全部样式** — 装饰图、字号、列宽全部按 xhy 原样。

> 此文件可能不需要修改，确认下 `qualityCheckLast()` API 的调用方式是否完全一致即可。

#### B-6. `src/pages/Defend/DefendPage.vue` — 设备维护

**从 1080 移植的逻辑：**

1. **导航按钮样式改为 bgNav**（统一与 SetPage 一样）：

```less
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: cover;
  width: 19.5vw;     // ← 注意：这是 1080 竖屏值，横屏可能需要调整
  height: 2.8vh;     // ← 同上
  line-height: 2.8vh;
  margin-bottom: 3vh;
  &.actived { background-image: url('@/assets/image/bg_navBtn_hov.png'); }
}
```

2. **Light 组件注释掉**（第 47 行）：

```vue
<!-- <Light v-if="options.lamps" :data="options.lamps" :act="actived" @update-item="handleUpdateItem" /> -->
```

3. **工位操作 tab（key=5）注释掉**：

```vue
<!-- <div class="bgNav animation" :class="actived === 5 ? 'actived' : ''" @click="$goto('DefendPage', { key: 5 })">
  <span>工位操作</span>
</div> -->
```

4. **版本号改为动态读取**：

```ts
const config = JSON.parse(localStorage.getItem('config') || '{}');
// 模板中：{{ config.version }}
```

**从 xhy 保留的：**
- 子组件引用名称（Reader/Camera/Laser/Inkjet）— 保持 xhy 已有的，不需要改名
- 如果 xhy 有 Light 组件且需要保留 → 不要注释
- 内容区样式的 xhy 版本

---

### C. 需要重写的文件（架构级别变化）

> **策略：整体替换为 1080 版本，然后逐行调整样式值适配横屏。**

#### C-1. `src/pages/Set/SetPage.vue` — **完全重写**

xhy 是单体页面（所有设置段在一个文件中），1080 是 tab 导航 + 4 个子组件架构。

**迁移方式：**

1. **用 1080 的 SetPage.vue 替换 xhy 版本**
2. **调整样式值适配横屏新屏 1440×900**：

| 样式项 | 1080 竖屏值 | 横屏初值(×0.75) | 说明 |
|--------|------------|-----------------|------|
| `.bgNav` width | `19.5vw` | `14.6vw` | |
| `.bgNav` height | `2.8vh` | `2.8vh` (不变) | vh 方向差异小 |
| `.bgNav` margin-bottom | `3vh` | `3vh` (不变) | |
| 内容区 `h-78vh` | `78vh` | 按横屏可用高度调整 | |
| 底部按钮 `bottom-5vh` | `5vh` | `5vh` | |
| 按钮宽度 `w-18.5vw` | `18.5vw` | `14vw` | |

3. **📋 子组件协同机制（关键，必须理解）：**

```
SetPage.vue
├── <SetGeneral ref="setGeneralRef" />    ← load() / save() / hideKeyboard()
├── <SetInkjet ref="setInkjetRef" />      ← load() / save() / hideKeyboard()
├── <SetLaser ref="setLaserRef" />        ← load() / save() / hideKeyboard()
└── <SetStation ref="setStationRef" />    ← load() / save() / hideKeyboard()

switchTab(tab):
  1. 关闭所有子组件的虚拟键盘 (comp.hideKeyboard())
  2. 切换 actived
  3. 调用当前子组件的 comp.load()

getData()  → getActiveComponent()?.load()
saveData() → getActiveComponent()?.save()
```

每个子组件必须 `defineExpose({ load, save, hideKeyboard })`。

4. **ThePass 密码设置**：确认 xhy 是否需要。如果 xhy 有别的密码机制，可以保留。

#### C-2. `src/pages/Check/components/TheSet.vue` — **整体替换**

xhy-1080 版本从简单的参数设置页变成了复杂的 6 模块配置页（1004 行）。

**迁移方式：**

1. **整体用 1080 版本替换 xhy 版本**
2. **需要调整的样式值**（全部是 vw/vh，初值 = 1080值 × 0.75）：

| 部位 | 1080 值 | ×0.75 初值 | 说明 |
|------|---------|-----------|------|
| 模板下拉宽度 | `22vw` | `16.5vw` | |
| 输入框宽度 | `12vw`/`10vw`/`8vw`/`14vw` | `9vw`/`7.5vw`/`6vw`/`10.5vw` | |
| Select 宽度 | `15vw` / `12vw` | `11vw` / `9vw` | |
| 字体大小 | `1.8vw`/`2.5vw`/`1.6vw` | `1.4vw`/`1.9vw`/`1.2vw` | |
| `.bgDefend_tit` font-size | `2.5vw` | `1.9vw` | |
| `.bg_listItem` font-size | `1.8vw` | `1.4vw` | |
| antd input 高度 | `2.5vh` | `2.5vh` (不变) | |
| 底部按钮 `w-18.5vw` | `18.5vw` | `14vw` | |
| 键盘宽度 `w-30vw` | `30vw` | `22.5vw` | |

3. **📋 1025 行的完整功能清单**（迁移后需要验证）：

| 功能 | 说明 |
|------|------|
| 模板选择 | `a-select` + `onTemplateChange`，切换时检查 `hasUnsavedChanges()` |
| 证本姿态检测 | `ocrPose[0]` → 启用开关 + 曝光时间 + 搜索区域(x,y,w,h) |
| OCR空白页检测 | `ocrBlank[0]` → 启用 + 曝光 + 质量要求 |
| 检测质量控制 | `obsvQualityControl[0]` → 启用 + 曝光 + 质量要求 |
| 激光前检测 | `ocrBeforeLaser[0]` → 启用 + 曝光 + 旋转角度 + 标记左上角/右下角 |
| 喷墨前检测 | `ocrBeforeUv[0]` → 启用 + 曝光 + 平台 + 人像位置 + 旋转角度 + 标记区域 |
| 成品检测 | `ocrFinished[0]` → 启用 + 三种曝光 + 质量 + 红外/紫外/白光光源(端口,通道,亮度) |
| 虚拟键盘 | SimpleKeyboard 集成，浮点数/整数两种 layout |
| 数值转换 | `convertParaMvToStrings/Numbers` → 接口返回 number 转 string 显示，保存时转回 number |
| 校验 | `validateAll()` → 所有数值字段范围校验 |
| 保存确认 | `hasUnsavedChanges()` → 未保存切换模板时弹窗确认 |

---

### D. 基本不变的文件（含已完成页面）

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/pages/Home/HomePage.vue` | ✅ 已完成 | 逻辑已从 1080 合并 |
| `src/pages/Login/LoginPage.vue` | ✅ 已完成 | 登录页逻辑已迁移 |
| `src/pages/Login/LoginInfo.vue` | ✅ 已完成 | 注册页逻辑已迁移 |
| `src/pages/Search/SearchPage.vue` | 不变 | 两个分支无差异 |
| `src/pages/Home/StationPage.vue` | 不变 | 无差异 |
| `src/apis/proApi.ts` | 检查 | 确认 loginApi 相关 API 是否已引入 |
| `src/store/*` | 不变 | 无差异 |
| `src/pages/Check/SelectPage.vue` | 检查 | 微调确认 |

---

## 三、样式适配参照表

> **新屏幕 1440×900 (16:10)**。以下公式用于把 1080 竖屏 vw 值转换成横屏初值，实际以肉眼确认为准。

### 3.1 从 xhy-1080 竖屏搬来的 vw 值换算

```
1080竖屏: 1vw = 10.8px → 搬到 1440横屏: 1vw = 14.4px
保持物理大小: 1080_vw × 0.75 = 新屏_xhy_vw
```

| 元素 | 1080 竖屏 vw | ×0.75 初值 | 说明 |
|------|-------------|-----------|------|
| 标题字号 | `5.5vw` (≈59px) | `4.1vw` | 参考横屏现有标题 |
| 表格字号 | `2vw` (≈22px) | `1.5vw` | 参考横屏现有表格 |
| 按钮字号 | `3vw` (≈32px) | `2.3vw` | 参考横屏现有按钮 |
| bgNav 宽度 | `19.5vw` (≈211px) | `14.6vw` | 可按比例再调 |
| bgNav 高度 | `2.8vh` (≈30px) | 保留 vh | vh 变化小(×1.2) |
| bgDefend_tit | `2.5vw` (≈27px) | `1.9vw` | |
| bg_listItem | `2vw` / `1.8vw` | `1.5vw` / `1.4vw` | |
| Select 宽 | `15vw` / `12vw` | `11vw` / `9vw` | |
| 输入框宽 | `12vw` / `10vw` | `9vw` / `7.5vw` | |
| 底部按钮宽 | `18.5vw` | `14vw` | |
| 键盘宽 | `30vw` | `22.5vw` | |

### 3.2 xhy 原有横屏样式（1920基准 → 1440）

```
旧屏: 1vw=19.2px, 新屏: 1vw=14.4px
保持物理大小: 旧vw × 1.333, 旧vh × 1.2
```

| 元素 | 旧 xhy 值 | 换算新值 | 调整方向 |
|------|----------|---------|---------|
| 标题 | `text-3.4vw` (≈65px) | `4.5vw` | 太大，可能保持 3.4vw |
| 表格字号 | `text-1vw` (≈19px) | `1.3vw` | 参考 1.5vw |
| 按钮字号 | `text-1.7vw` (≈33px) | `2.3vw` | OK |
| 底部按钮 | `13vw × 7vh` | `17vw × 8.4vh` | 可能太宽 |
| 导航按钮 | `15vw × 9vh` | `20vw × 11vh` | 可能太大 |
| Footer 高度 | `7vh` | `8.4vh` | OK |
| 结果标签 | `0.8vw` | `1.1vw` | OK |

**实际策略**：xhy 原有样式大概率视觉上可用（vw 值不变或微调），不需要全部 ×1.333。先完成逻辑迁移，样式最后统一调。

---

## 四、新引入的样式体系

xhy-1080 引入了一套 `.bgDefend` 样式体系，被 SetPage 和 DefendPage 共用：

```less
// 这些样式需要置入 SetPage.vue 和 DefendPage.vue 的无 scoped <style lang="less"> 块

.bgDefend {
  .bg_listItem {
    padding: 2vh 0;      // ← vh 值需横屏确认
    margin: 1vh 0;
    font-size: 2vw;      // ← 横屏可能改为 1.2vw~1.5vw
    // 隔行变色
    &:nth-of-type(odd)  { background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%); }
    &:nth-of-type(even) { background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%); }
  }
  .bgDefend_item {
    margin-bottom: 3vh;
    .bgDefend_tit {
      font-size: 2.5vw;  // ← 横屏可能改为 1.5vw
      font-weight: bold;
      display: flex; align-items: center; justify-content: center; white-space: nowrap;
      &::before, &::after {
        content: ''; flex: 1; height: 1px; min-width: 2vw;
      }
      &::before { background: linear-gradient(270deg, #ffffff 0%, #ffffff00 100%); margin-right: 1vw; }
      &::after  { background: linear-gradient(90deg, #ffffff 0%, #ffffff00 100%); margin-left: 1vw; }
    }
    .bg_listItem {
      padding: 1vh 0; margin: 1vh 0; display: flex; font-size: 1.8vw;  // ← 横屏调整
      .bgDefend_itemIn {
        display: flex; align-items: center; margin-right: 2vw;
        .bgDefend_itemIn_tit {
          margin-left: 2vw; padding-right: 0.5vw; min-width: 7vw; white-space: nowrap;
        }
        &:first-of-type .bgDefend_itemIn_tit:first-of-type {
          position: relative; padding-left: 1.5vw;
          &::before {
            content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            width: 6px; height: 1.2em; border-radius: 50px; background: #ffffff;
          }
        }
      }
      .ant-input, .ant-select-selector {
        font-size: 1.8vw;       // ← 横屏调整
        background-color: #ffffff15 !important;
        color: #ffffff; border-width: 0px !important;
        height: 2.5vh !important;  // ← 横屏确认
        border-radius: 0; min-width: 15vw;
      }
      .ant-select-selector { min-width: 12vw !important; }
      .ant-select-selection-item { line-height: 2.5vh !important; font-size: 1.8vw; color: #ffffff !important; }
      .ant-input::placeholder, .ant-select-selection-placeholder { color: #989ca1; }
      .ant-select-arrow { right: 0.5vw !important; }
      .ant-switch-checked .ant-switch-inner { background: #3662ec; }
      .ant-switch-inner { background: #d8d8d8; }
      .keyInput { border-color: #3662ec; }
    }
    &.no-first-bar .bg_listItem .bgDefend_itemIn:first-of-type .bgDefend_itemIn_tit:first-of-type:not(.inkjet-loc-tit) {
      padding-left: 0; &::before { display: none; }
    }
  }
}

// 下拉菜单全局样式
.ant-select-dropdown {
  .ant-select-item-option-content { font-size: 1.8vw; }  // ← 横屏调整
  .ant-select-item-option {
    min-height: unset !important; height: 2.5vh !important;
    padding: 0 12px !important; display: flex !important; align-items: center !important;
  }
}
```

**迁移要点：**
- 这些样式是 **无 scoped** 的，会影响全局
- SetPage 和 DefendPage 各有一份几乎相同的副本，确保两边同步
- 字体值为 1080 竖屏值，横屏按 ×0.75 换算（`1.8vw→1.4vw`、`2.5vw→1.9vw`、`2vw→1.5vw`）
- antd input/select 高度 `2.5vh` 在 900px 新屏约 `22.5px`，基本可用
- 新屏幕 1440×900，旧 xhy 屏 1920×1080，整体像素密度下降，样式最终需肉眼确认

---

## 五、迁移执行顺序

> ✅ = 已完成，🔲 = 待执行（样式调整），🔵 = 待样式确认

```
第1步：基础设施（不影响 UI）
├── src/apis/loginApi.ts            → ✅ 已拉取
├── src/utils/useCustomTimer.ts     → ✅ 已拉取
├── src/plugins/useCamera.ts        → ✅ 已拉取
├── public/CameraHelperWS.js        → ✅ 已拉取
├── src/router/index.ts             → ✅ 已拉取（redirect→/login, +login/+register 路由）
├── src/App.vue                     → ✅ 已拉取（退出简化、getConfig、scrollClose、渐变背景）
├── src/main.ts                     → ✅ 已拉取（ts cast fix）
├── electron/main/index.ts          → ✅ 已拉取（移除Tray、F11屏蔽、移除Exit_Window关机、+camera-helper-path）
├── public/configDev.json           → ✅ 已拉取 + 宽高改为1440×900
├── public/configProd.json          → ✅ 已拉取 + 宽高改为1440×900
├── src/global.d.ts                 → ✅ 已拉取
├── src/shims.d.ts                  → ✅ 已拉取
├── src/typed-router.d.ts           → ✅ 已拉取
├── src/plugins/request.ts          → ✅ 已拉取
├── src/apis/proApi.ts              → ✅ 已拉取
├── src/apis/webApi.ts              → ✅ 已拉取
└── src/utils/index.ts              → ✅ 已拉取

第2步：新增页面（独立模块）
├── src/pages/Login/LoginPage.vue   → ✅ 已完成
└── src/pages/Login/LoginInfo.vue   → ✅ 已完成

第3步：组件库 & 全局样式
├── src/components/TheHeader.vue    → ✅ 已拉取（用户信息、bg_topBar背景、移除TheExit）
├── src/components/TheFooter.vue    → ✅ 已拉取
├── src/components/TheConfirm.vue   → ✅ 已拉取（+handleOk回调）
├── src/components/TheNaver.vue     → ✅ 已拉取（新增组件）
├── src/components/TheExit.vue      → ✅ 已拉取（已不被App.vue引用，备用）
├── src/components/base/TheButton.vue   → ✅ 已拉取
├── src/components/base/simpleKeyboard.vue → ✅ 已拉取
├── src/styles/global.scss          → ✅ 已拉取
└── 图片资源                         → ✅ 22新增 + 5更新 全部拉取

第4步：页面组件（逻辑已拉取，样式待调）
├── src/pages/Home/HomePage.vue     → ✅ 已完成（用户之前已改）
├── src/pages/Home/StationPage.vue  → ✅ 已拉取 🔵
├── src/pages/Home/components/TheTable.vue → ✅ 已拉取 🔵
├── src/pages/Set/SetPage.vue       → ✅ 已拉取 🔵
├── src/pages/Set/components/SetGeneral.vue  → ✅ 已拉取 🔵
├── src/pages/Set/components/SetInkjet.vue   → ✅ 已拉取 🔵
├── src/pages/Set/components/SetLaser.vue    → ✅ 已拉取 🔵
├── src/pages/Set/components/SetStation.vue  → ✅ 已拉取 🔵
├── src/pages/Set/components/ThePass.vue     → ✅ 已拉取 🔵
├── src/pages/Defend/DefendPage.vue  → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheCamera.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheFw.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheInkjet.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheLaser.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheLight.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/ThePrint.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheReader.vue → ✅ 已拉取 🔵
├── src/pages/Defend/components/TheTest.vue → ✅ 已拉取 🔵
├── src/pages/Check/CheckPage.vue    → ✅ 已拉取 🔵
├── src/pages/Check/SelectPage.vue   → ✅ 已拉取 🔵
├── src/pages/Check/components/TheSet.vue → ✅ 已拉取 🔵
├── src/pages/Check/components/TheRecord.vue → ✅ 已拉取 🔵
├── src/pages/Search/SearchPage.vue  → ✅ 已拉取 🔵
├── src/pages/Search/components/TheDetail.vue → ✅ 已拉取 🔵
├── src/pages/Search/components/TheDoc.vue → ✅ 已拉取 🔵
├── src/pages/Search/components/TheRecord.vue → ✅ 已拉取 🔵
└── src/pages/Search/components/TheTask.vue → ✅ 已拉取 🔵

第5步：样式适配（1440×900 横屏）
└── 🔵 所有页面 vw/vh 值 ×0.75 调整 + 肉眼确认
```

---

## 六、注意事项与常见坑

### 6.1 bg_navBtn.png / bg_navBtn_hov.png

xhy 的 Footer 可能用的是 `bg_btn.png` / `bg_btnA.png`，而 1080 统一换成了 `bg_navBtn.png` / `bg_navBtn_hov.png`。

- 如果 xhy 横屏图片比例更合适 → 保留 xhy 的图片，只改逻辑
- 如果 1080 的图片风格更新 → 替换图片，但确保横屏显示正常

### 6.2 TheConfirm 组件

xhy 如果已有 TheConfirm 组件，确认其 props 接口与 1080 的用法一致：
- `:open` / `:title` / `:desc` / `:data` / `:handle-ok` / `:handle-cancel`
- `handleOk` 支持传入自定义函数（如 quit-app）

### 6.3 SimpleKeyboard 虚拟键盘

多个页面（TheSet、SetInkjet、SetLaser、SetGeneral）都集成了 SimpleKeyboard。确保：
- `SimpleKeyboard` 组件在 xhy 中已注册（全局或局部导入）
- `simple-keyboard` npm 包已安装

### 6.4 localStorage 依赖

以下数据从 localStorage 读取，确保写入方存在：
- `localStorage.getItem('config')` → App.vue 的 `getConfig()` 写入
- `localStorage.getItem('account')` → TheHeader 读取，LoginPage 写入

### 6.5 window.electron / window.ipcRenderer / window.electronAPI

这些是 Electron 全局对象，类型定义在 `src/shims.d.ts` 或类似文件中。1080 新增了：
- `window.electronAPI.getConfig()` — 读取配置
- `window.electron.send('quit-app')` — 退出应用
- `window.ipcRenderer.on('confirm-quit', ...)` — 监听退出请求

确保 xhy 的 Electron 主进程支持这些 IPC 通道。

### 6.6 vw vs vh 的横竖屏换算（新屏 1440×900）

**从 1080 竖屏搬到 1440 横屏：**

- 竖屏 `1vw` = 10.8px（1080 宽）→ 搬到 1440 宽，保持物理大小需：`1080_vw × 0.75`
- 竖屏 `1vh` = 19.2px（1920 高）→ 搬到 900 高，保持物理大小需：`1080_vh × 2.13`
- ⚠ 竖屏的 vh 值搬到横屏基本不适用（方向翻转了），建议横屏用 vw 为主

**xhy 原有样式在 1440 新屏：**

- 旧屏 `1vw` = 19.2px → 新屏 `1vw` = 14.4px
- 保持物理大小需 `×1.333`，但实际上大部分样式视觉差异不大，建议先不改

### 6.7 图片资源确认

迁移前检查 xhy 的 `src/assets/image/` 目录是否已有以下图片（1080 新增的）：

```
bg_navBtn.png, bg_navBtn_hov.png, bg_topBar.png, bg_statistics.png,
bg_navItem.png, bg_tabMin1/2/3.png, bg_state_ok/work/warn/ng.png,
bg_labelMax.png, ico_left.png, ico_right.png, login_left.png, login_right.png,
ico_bottom.png
```

如果 xhy 缺少这些图片 → 从 1080 复制过去。

### 6.8 API 接口确认

检查 `src/apis/proApi.ts` 中是否有新增 API（如 `setMoule.getGeneral`、`setMoule.getPosition`、`checkModule.qualityCheckGet/Set` 等），确保 xhy 的后端支持这些接口。

---

## 七、xhy-1080 退出/关闭程序改善

### 7.1 改动概览

| 文件 | 改动 | 说明 |
|------|------|------|
| `electron/main/index.ts` | 移除 `Tray` 系统托盘 | 不再用托盘右键退出 |
| `electron/main/index.ts` | 移除 `Exit_Window` (shutdown) IPC handler | 不再通过 Electron 执行系统关机 |
| `electron/main/index.ts` | 移除 `exec` 导入 | 清理（shutdown 已移除） |
| `electron/main/index.ts` | 启用 `F11` globalShortcut 屏蔽 | 阻止 F11 全屏 |
| `electron/main/index.ts` | 新增 `get-camera-helper-path` IPC | 为 CameraHelperWS.js 提供路径 |
| `src/App.vue` | 移除 `TheExit` 密码弹窗组件 | 退出不再输密码 |
| `src/App.vue` | `confirm-quit` → `TheConfirm` modal → `quit-app` | 确认框代替密码框 |
| `src/App.vue` | 新增 `getConfig()` 写 localStorage | 全局可读配置 |
| `src/App.vue` | 新增 `onScrollCloseSelect` | 滚动关闭下拉 |
| `src/App.vue` | 背景改为 CSS 渐变 | 不再用 bg.png 图片 |
| `src/components/TheExit.vue` | 新增 `handleOk` 回调支持 | 但 App.vue 已不再引用 |
| `src/components/TheHeader.vue` | 移除 `TheExit` 引用 + 改 `bg_topBar.png` 背景 + 显示用户名 | |

### 7.2 退出流程对比

```
旧 xhy 流程:
close窗口 → confirm-quit IPC → TheExit密码弹窗 → 输密码 → 
  ├── "系统关机" → Exit_Window IPC → exec('shutdown')
  └── "退出系统" → quit-app IPC → canExit=true → win.close()

新 xhy-1080 流程:
close窗口 → confirm-quit IPC → TheConfirm确认框 → 确认 →
  quit-app IPC → canExit=true → win.close()
```

核心简化：**不需要密码，一键确认退出**。

---

## 附录 A：每个文件的改动摘要

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/apis/loginApi.ts` | 直接复制 | ✅ |
| `src/plugins/useCamera.ts` | 直接复制 | ✅ |
| `public/CameraHelperWS.js` | 直接复制 | ✅ |
| `src/router/index.ts` | +2路由 | ✅ |
| `src/App.vue` | 合并逻辑 | ✅ |
| `src/main.ts` | ts cast fix | ✅ |
| `electron/main/index.ts` | 退出简化+F11+camera | ✅ |
| `public/configDev.json` | 拉取+改1440×900 | ✅ |
| `public/configProd.json` | 拉取+改1440×900 | ✅ |
| `src/components/TheHeader.vue` | 用户信息+背景 | ✅ |
| `src/components/TheFooter.vue` | 合并 | ✅ |
| `src/components/TheConfirm.vue` | +handleOk | ✅ |
| `src/components/TheNaver.vue` | 新增组件 | ✅ |
| `src/components/TheExit.vue` | 备用 | ✅ |
| `src/components/base/*.vue` | 合并 | ✅ |
| `src/styles/global.scss` | 合并工具类 | ✅ |
| `src/global.d.ts / shims.d.ts` | 合并 | ✅ |
| `src/pages/Login/LoginPage.vue` | 用户已完成 | ✅ |
| `src/pages/Login/LoginInfo.vue` | 用户已完成 | ✅ |
| `src/pages/Home/HomePage.vue` | 用户已完成 | ✅ |
| `src/pages/Set/*` (1+5文件) | 拉取待调样式 | 🔵 |
| `src/pages/Defend/*` (1+8文件) | 拉取待调样式 | 🔵 |
| `src/pages/Check/*` (2+2文件) | 拉取待调样式 | 🔵 |
| `src/pages/Search/*` (1+4文件) | 拉取待调样式 | 🔵 |
| 所有图片资源 | 22新增+5更新 | ✅ |
| 横屏样式 vw/vh 调整 | 全页面 1440×900 | 🔵 |

---

## 附录 B：快速 diff 命令参考

```bash
# 查看两分支所有差异文件
git diff --stat xhy..xhy-1080 -- src/

# 查看特定文件差异
git diff xhy..xhy-1080 -- src/App.vue

# 导出 xhy 分支某文件到临时位置
git show xhy:src/pages/Home/HomePage.vue > /tmp/xhy_HomePage.vue

# 比较两分支同名文件
git diff xhy:src/App.vue xhy-1080:src/App.vue
```
