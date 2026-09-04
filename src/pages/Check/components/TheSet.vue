<template>
  <div class="set-wrap flex">
    <TheConfirm title="舍弃当前修改" :open="showConfirm" :handle-ok="onConfirmDiscard" :handle-cancel="onConfirmCancel" />

    <SimpleKeyboard v-if="showKeyboard" :layout="isFloatKey ? 'fNum' : 'num'" keyboard-width="w-30vw" :transform="transformValue" :input="getKeyboardValue()" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />

    <!-- 左侧模块导航（一贯 bgNav 样式） -->
    <div class="set-nav">
      <div v-for="m in modules" :key="m.key" class="bgNav" :class="{ actived: activeModule === m.key }" @click="onMenuClick(m.key)">
        <span>{{ m.label }}</span>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="bgDefend_item set-content">
      <!-- 模板类型（每个标题下都显示） -->
      <section v-if="templates.length" class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">模板类型:</div>
          <a-select :value="selectedTemplateCode" style="width: 22vw" @change="onTemplateChange">
            <a-select-option v-for="t in templates" :key="t.code" :value="t.code">{{ t.code }}</a-select-option>
          </a-select>
        </div>
      </section>

      <!-- 按选中标题渲染对应 section 子组件 -->
      <component :is="s.comp" v-for="(s, si) in activeSections" :key="si" :cur="cur" v-bind="s.props || {}" />
    </div>

    <!-- 底部按钮 -->
    <div class="fixed bottom-10vh left-3vw right-3vw flex justify-between py-2vh">
      <div></div>
      <div>
        <a-button type="link" class="btn_normal mr-2vw w-18.5vw" @click="saveData">保存设置</a-button>
        <a-button type="link" class="btn_normal w-18.5vw" @click="getData">读取</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { checkModule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import ModObsvQualityControl from '@/pages/Check/components/set/ModObsvQualityControl.vue';
import ModOcrBeforeLaser from '@/pages/Check/components/set/ModOcrBeforeLaser.vue';
import ModOcrBeforeUv from '@/pages/Check/components/set/ModOcrBeforeUv.vue';
import ModOcrBlank from '@/pages/Check/components/set/ModOcrBlank.vue';
import ModOcrFinished from '@/pages/Check/components/set/ModOcrFinished.vue';
import ModOcrPose from '@/pages/Check/components/set/ModOcrPose.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();

// --- 模块导航（左侧总标题） ---
// 每个标题下显示一组 section 子组件；模板类型公共块固定在每个标题顶部
const modules = [
  {
    key: 'blank',
    label: '空白检测设置',
    sections: [{ comp: ModOcrBlank }, { comp: ModOcrPose }],
  },
  {
    key: 'laser',
    label: '激光定位设置',
    sections: [{ comp: ModOcrBeforeLaser }],
  },
  {
    key: 'uvHigh',
    label: '喷墨定位设置（高）',
    sections: [{ comp: ModOcrBeforeUv, props: { range: [0, 4] } }],
  },
  {
    key: 'uvLow',
    label: '喷墨定位设置（低）',
    sections: [{ comp: ModOcrBeforeUv, props: { range: [4, 999] } }],
  },
  {
    key: 'quality',
    label: '质检设置',
    sections: [
      { comp: ModObsvQualityControl, props: { title: '加注页质量检测' } },
      { comp: ModOcrFinished, props: { title: '主副页检测' } },
    ],
  },
];
const activeModule = ref('blank');
const activeSections = computed(() => modules.find(m => m.key === activeModule.value)?.sections || []);

// 切换模块未保存确认
const pendingModule = ref<string | null>(null);
const showConfirm = ref(false);
const pendingTemplateCode = ref<string | null>(null);

function onMenuClick(key: string) {
  if (key === activeModule.value) return;
  if (hasUnsavedChanges()) {
    pendingModule.value = key;
    showConfirm.value = true;
  } else {
    activeModule.value = key;
  }
}

const data = ref<any>({ mvIn: [] });

// --- 模板管理 ---
const selectedTemplateCode = ref('');
let originalDataStr = '';

const templates = computed(() => {
  return (data.value.mvIn || []).map((item: any) => ({ code: item.templateCode }));
});

const currentTemplateIdx = computed(() => {
  return data.value.mvIn?.findIndex((m: any) => m.templateCode === selectedTemplateCode.value) ?? 0;
});

const cur = computed(() => {
  const idx = currentTemplateIdx.value;
  if (idx < 0 || !data.value.mvIn?.[idx]) return {};
  return data.value.mvIn[idx].paraMv || {};
});

function hasUnsavedChanges(): boolean {
  return JSON.stringify(data.value) !== originalDataStr;
}

function onTemplateChange(code: string) {
  if (code === selectedTemplateCode.value) return;
  if (hasUnsavedChanges()) {
    pendingTemplateCode.value = code;
    showConfirm.value = true;
  } else {
    selectedTemplateCode.value = code;
  }
}

function onConfirmDiscard() {
  // 还原到原始数据
  const original = JSON.parse(originalDataStr);
  data.value = original;

  // 切换到待选模板或待选模块
  if (pendingTemplateCode.value) {
    selectedTemplateCode.value = pendingTemplateCode.value;
    pendingTemplateCode.value = null;
  }
  if (pendingModule.value) {
    activeModule.value = pendingModule.value;
    pendingModule.value = null;
  }
  showConfirm.value = false;

  // 重新字符串化所有数值字段
  if (data.value.mvIn) {
    for (const mv of data.value.mvIn) {
      convertParaMvToStrings(mv.paraMv);
    }
  }
  originalDataStr = JSON.stringify(data.value);
}

function onConfirmCancel() {
  pendingTemplateCode.value = null;
  pendingModule.value = null;
  showConfirm.value = false;
}

// --- 键盘 ---
const showKeyboard = ref(false);
const keyInput = ref('');
const limitInput = ref(0);
const cursorPosition = ref<any>(null);
const transformValue = ref<any>(null);

// 需要 fNum（可负号）的字段
const FLOAT_KEY_FIELDS = ['rotationCorrectionAngle'];
const isFloatKey = computed(() => {
  if (!keyInput.value) return false;
  const lastPart = keyInput.value.split('.').pop() || '';
  return FLOAT_KEY_FIELDS.includes(lastPart);
});

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function getKeyboardValue(): string {
  if (!keyInput.value || !cur.value) return '';
  const parts = keyInput.value.split('.');
  // 第一部分 section，第二部分可能是数组索引（数字），其后为字段路径
  const [section, maybeIdx, ...rest] = parts;
  const arr = cur.value[section];
  if (!arr || !Array.isArray(arr)) return '';
  const idx = /^\d+$/.test(maybeIdx) ? Number(maybeIdx) : 0;
  if (!arr[idx]) return '';
  let val: any = arr[idx];
  for (const p of rest) {
    if (val == null || typeof val !== 'object') return '';
    val = val[p];
  }
  return String(val ?? '');
}

function onInputFocus(event: any, key: string, limit = 0) {
  if (keyInput.value !== key) {
    showKeyboard.value = true;
    keyInput.value = key;
    limitInput.value = limit;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [0, top - 100];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null && cursorPosition.value) {
    setTimeout(() => {
      if (cursorPosition.value.setSelectionRange) {
        cursorPosition.value.focus();
        cursorPosition.value.setSelectionRange(caretPosition, caretPosition);
      }
    }, 100);
  }
  if (!keyInput.value || !cur.value) return;
  const parts = keyInput.value.split('.');
  const [section, maybeIdx, ...rest] = parts;
  const arr = cur.value[section];
  if (!arr || !Array.isArray(arr)) return;
  const idx = /^\d+$/.test(maybeIdx) ? Number(maybeIdx) : 0;
  if (!arr[idx]) return;
  if (rest.length === 0) {
    arr[idx] = input;
    return;
  }
  let target: any = arr[idx];
  for (let i = 0; i < rest.length - 1; i++) {
    if (target == null || typeof target !== 'object') return;
    target = target[rest[i]];
  }
  const lastKey = rest[rest.length - 1];
  if (target && typeof target === 'object') {
    target[lastKey] = input;
  }
}

// --- 数值字段转换 ---
// 需要转为 number 发送的字段（不含 COM 端口等文本字段）
const NUM_LEAF_FIELDS = new Set(['usExposureTime', 'irUsExposureTime', 'uvUsExposureTime', 'x', 'y', 'width', 'height', 'stdPortraitX', 'stdPortraitY', 'rotationCorrectionAngle', 'l1ChannelNo', 'l2ChannelNo', 'l1Brightness', 'l2Brightness', 'qualityControl', 'platform']);

function convertValue(val: any, key: string): any {
  if (val == null) return val;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val;
  if (NUM_LEAF_FIELDS.has(key)) {
    const n = Number(val);
    return Number.isFinite(n) ? n : val;
  }
  return val;
}

function convertParaMvToNumbers(pmv: any) {
  if (!pmv) return;
  for (const section of Object.keys(pmv)) {
    const arr = pmv[section];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          // 嵌套对象如 targetRoi, markTopLeftRegion, irlDev 等
          for (const subKey of Object.keys(val)) {
            val[subKey] = convertValue(val[subKey], subKey);
          }
        } else {
          item[key] = convertValue(val, key);
        }
      }
    }
  }
}

function convertParaMvToStrings(pmv: any) {
  if (!pmv) return;
  for (const section of Object.keys(pmv)) {
    const arr = pmv[section];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          for (const subKey of Object.keys(val)) {
            if (typeof val[subKey] !== 'boolean' && val[subKey] != null) {
              val[subKey] = String(val[subKey]);
            }
          }
        } else if (typeof val !== 'boolean' && val != null) {
          item[key] = String(val);
        }
      }
    }
  }
}

// --- 校验 ---
function validateField(rawVal: any, min: number, max: number, label: string): string | null {
  if (rawVal == null || String(rawVal).trim() === '') return `${label}不能为空`;
  const val = Number(rawVal);
  if (!Number.isFinite(val)) return `${label}的值无效`;
  if (val < min || val > max) return `${label}超出范围（${min}~${max}），当前值：${val}`;
  return null;
}

function validateDevice(nestedObj: any, prefix: string): string[] {
  const errs: string[] = [];
  if (!nestedObj) return errs;
  const e1 = validateField(nestedObj.l1ChannelNo, 0, 255, `${prefix}通道1`);
  if (e1) errs.push(e1);
  const e2 = validateField(nestedObj.l2ChannelNo, 0, 255, `${prefix}通道2`);
  if (e2) errs.push(e2);
  const e3 = validateField(nestedObj.l1Brightness, 0, 999, `${prefix}亮度1`);
  if (e3) errs.push(e3);
  const e4 = validateField(nestedObj.l2Brightness, 0, 999, `${prefix}亮度2`);
  if (e4) errs.push(e4);
  return errs;
}

function validateRoi(nestedObj: any, prefix: string): string[] {
  const errs: string[] = [];
  if (!nestedObj) return errs;
  const e1 = validateField(nestedObj.x, 0, 30000, `${prefix} X`);
  if (e1) errs.push(e1);
  const e2 = validateField(nestedObj.y, 0, 30000, `${prefix} Y`);
  if (e2) errs.push(e2);
  const e3 = validateField(nestedObj.width, 0, 30000, `${prefix} 宽`);
  if (e3) errs.push(e3);
  const e4 = validateField(nestedObj.height, 0, 30000, `${prefix} 高`);
  if (e4) errs.push(e4);
  return errs;
}

function validateAll(): string[] {
  const errs: string[] = [];
  const pmv = cur.value;
  if (!pmv) return errs;
  const tc = selectedTemplateCode.value || '当前模板';

  // ocrPose
  (pmv.ocrPose || []).forEach((p: any, i: number) => {
    const e = validateField(p.usExposureTime, 62, 9999764, `${tc} 证本姿态${i + 1} 曝光时间`);
    if (e) errs.push(e);
    if (p.targetRoi) errs.push(...validateRoi(p.targetRoi, `${tc} 证本姿态${i + 1}搜索区域`));
  });

  // ocrBlank
  (pmv.ocrBlank || []).forEach((p: any, i: number) => {
    const e = validateField(p.usExposureTime, 62, 9999764, `${tc} OCR空白页${i + 1} 曝光时间`);
    if (e) errs.push(e);
  });

  // obsvQualityControl
  (pmv.obsvQualityControl || []).forEach((p: any, i: number) => {
    const e = validateField(p.usExposureTime, 62, 9999764, `${tc} 检测质量控制${i + 1} 曝光时间`);
    if (e) errs.push(e);
  });

  // ocrBeforeLaser
  (pmv.ocrBeforeLaser || []).forEach((l: any, i: number) => {
    const e1 = validateField(l.usExposureTime, 62, 9999764, `${tc} 激光前检测${i + 1} 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(l.rotationCorrectionAngle, -5000, 5000, `${tc} 激光前检测${i + 1} 旋转角度`);
    if (e2) errs.push(e2);
    if (l.markTopLeftRegion) errs.push(...validateRoi(l.markTopLeftRegion, `${tc} 激光前检测${i + 1} 左上角`));
    if (l.markBottomRightRegion) errs.push(...validateRoi(l.markBottomRightRegion, `${tc} 激光前检测${i + 1} 右下角`));
  });

  // ocrBeforeUv
  (pmv.ocrBeforeUv || []).forEach((uv: any, i: number) => {
    const e1 = validateField(uv.usExposureTime, 62, 9999764, `${tc} 喷墨前检测${i + 1} 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(uv.stdPortraitX, 0, 90000, `${tc} 喷墨前检测${i + 1} X坐标`);
    if (e2) errs.push(e2);
    const e3 = validateField(uv.stdPortraitY, 0, 90000, `${tc} 喷墨前检测${i + 1} Y坐标`);
    if (e3) errs.push(e3);
    const e4 = validateField(uv.rotationCorrectionAngle, -5000, 5000, `${tc} 喷墨前检测${i + 1} 旋转角度`);
    if (e4) errs.push(e4);
    if (uv.markTopLeftRegion) errs.push(...validateRoi(uv.markTopLeftRegion, `${tc} 喷墨前检测${i + 1} 左上角`));
    if (uv.markBottomRightRegion) errs.push(...validateRoi(uv.markBottomRightRegion, `${tc} 喷墨前检测${i + 1} 右下角`));
  });

  // ocrFinished
  (pmv.ocrFinished || []).forEach((f: any, i: number) => {
    const e1 = validateField(f.usExposureTime, 62, 9999764, `${tc} 成品检测${i + 1} 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(f.irUsExposureTime, 62, 9999764, `${tc} 成品检测${i + 1} 红外曝光`);
    if (e2) errs.push(e2);
    const e3 = validateField(f.uvUsExposureTime, 62, 9999764, `${tc} 成品检测${i + 1} 紫外曝光`);
    if (e3) errs.push(e3);
    if (f.irlDev) errs.push(...validateDevice(f.irlDev, `${tc} 成品检测${i + 1} 红外光源`));
    if (f.uvlDev) errs.push(...validateDevice(f.uvlDev, `${tc} 成品检测${i + 1} 紫外光源`));
    if (f.wlDev) errs.push(...validateDevice(f.wlDev, `${tc} 成品检测${i + 1} 白光光源`));
  });

  return errs;
}

// --- API ---
async function getData() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await checkModule.qualityCheckGet();
    const respData = res.respData || { mvIn: [] };
    data.value = respData;

    // 全部数值转字符串（供 input 显示）
    if (data.value.mvIn) {
      for (const mv of data.value.mvIn) {
        convertParaMvToStrings(mv.paraMv);
      }
    }

    if (data.value.mvIn?.length) {
      selectedTemplateCode.value = data.value.mvIn[0].templateCode;
    }
    originalDataStr = JSON.stringify(data.value);
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function saveData() {
  const errors = validateAll();
  if (errors.length) {
    notification.error({ message: '参数范围错误', description: errors[0], placement: 'bottomRight', class: 'notificationE-custom-class' });
    return;
  }
  try {
    useAppStore().setSpinning(true);
    const reqData = JSON.parse(JSON.stringify(data.value));

    // 数值字符串转 number
    if (reqData.mvIn) {
      for (const mv of reqData.mvIn) {
        convertParaMvToNumbers(mv.paraMv);
      }
    }

    await checkModule.qualityCheckSet(reqData);

    // 再转回字符串
    if (data.value.mvIn) {
      for (const mv of data.value.mvIn) {
        convertParaMvToStrings(mv.paraMv);
      }
    }
    originalDataStr = JSON.stringify(data.value);

    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

// provide 键盘逻辑给子组件复用（需在 keyInput 声明之后）
provide('onInputFocus', onInputFocus);
provide('keyInput', keyInput);

defineExpose({ hideKeyboard });

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.inkjet-loc-tit {
  position: relative;
  padding-left: 1.5vw;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 1.2em;
    border-radius: 50px;
    background: #ffffff;
  }
}
.short-label {
  min-width: auto !important;
  margin-left: 2vw !important;
}
.keyInput {
  border-color: #3662ec;
}
.val-desc {
  margin-left: 0.5vw;
  color: #989ca1;
  font-size: 1vw;
}

// --- 左侧模块导航（与质检记录一致的 bgNav 样式） ---
.set-wrap {
  width: 100%;
  align-items: flex-start;
}
.set-nav {
  width: 15vw;
  flex-shrink: 0;
  margin-right: 1vw;
  display: flex;
  flex-direction: column;
  // 左侧标题固定在视口内，随外层容器（SelectPage 的 .bgDefend）统一滚动
  position: sticky;
  top: 0;
}
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 15vw;
  text-align: center;
  height: 10vh;
  line-height: 8vh;
  margin-bottom: 1vh;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 1.3vw;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
.set-content {
  flex: 1;
  // 不再独立滚动，由外层 .bgDefend 统一滚动，避免双滚动条
  margin-bottom: 0;
  padding-right: 1vw;
}
</style>

<style lang="less">
// 用唯一根类限定作用域，避免泄漏到「设备设置 / 设备维护」等其它页面
.select-page-root {
  .bgDefend {
    .bgDefend_item {
      margin-bottom: 3vh;
      .bgDefend_tit {
        font-size: 1.8vw;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        &::before,
        &::after {
          content: '';
          flex: 1;
          height: 1px;
          min-width: 2vw;
        }
        &::before {
          background: linear-gradient(270deg, #ffffff 0%, #ffffff00 100%);
          margin-right: 1vw;
        }
        &::after {
          background: linear-gradient(90deg, #ffffff 0%, #ffffff00 100%);
          margin-left: 1vw;
        }
      }
      .bg_listItem {
        padding: 1vh 0;
        margin: 1vh 0;
        display: flex;
        font-size: 1.3vw;
        .bgDefend_itemIn {
          display: flex;
          align-items: center;
          margin-right: 1vw;
          .bgDefend_itemIn_tit {
            margin-left: 1vw;
            padding-right: 0.3vw;
            min-width: 5vw;
            white-space: nowrap;
          }
          &:first-of-type .bgDefend_itemIn_tit:first-of-type {
            position: relative;
            padding-left: 1.5vw;
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 6px;
              height: 1.2em;
              border-radius: 50px;
              background: #ffffff;
            }
          }
        }
        .ant-input,
        .ant-select-selector {
          font-size: 1.1vw;
          background-color: transparent !important;
          color: #ffffff;
          border-width: 0px !important;
          background-color: #ffffff15 !important;
          height: 5vh !important;
          border-radius: 0;
        }
        .ant-select-selection-item {
          line-height: 5vh !important;
          font-size: 1.1vw;
          color: #ffffff !important;
        }
        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: #989ca1;
        }
        .ant-select-arrow {
          right: 0.5vw !important;
        }
        .ant-switch-checked .ant-switch-inner {
          background: #3662ec;
        }
        .ant-switch-inner {
          background: #d8d8d8;
        }
        .keyInput {
          border-color: #3662ec;
        }
      }
      // 屏蔽默认小竖条，但不影响自定义小竖条（如 .inkjet-loc-tit）
      &.no-first-bar
        .bg_listItem
        .bgDefend_itemIn:first-of-type
        .bgDefend_itemIn_tit:first-of-type:not(.inkjet-loc-tit) {
        padding-left: 0;
        &::before {
          display: none;
        }
      }
    }
  }
}

// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  background-color: #141723;
  border-radius: 0;
  .ant-select-item-option {
    padding: 1.2vh 14px !important;
    min-height: auto !important;
    height: auto !important;
  }
  .ant-select-item-option-content {
    font-size: 1.1vw !important;
    color: #b0b4ba;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(54, 98, 236, 0.3) !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #3662ec !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-state {
    color: #ffffff;
  }
}
.ant-select-arrow {
  color: #e2e5eb !important;
}
</style>
