<template>
  <div>
    <TheConfirm title="舍弃当前修改" :open="showConfirm" :handle-ok="onConfirmDiscard" :handle-cancel="onConfirmCancel" />

    <SimpleKeyboard v-if="showKeyboard" layout="num" keyboard-width="w-30vw" :transform="transformValue" :input="getKeyboardValue()" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />

    <!-- 激光定位 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">激光定位</div>

      <!-- 模板选择 -->
      <section v-if="templates.length" class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">模板:</div>
          <a-select :value="selectedTemplateCode" style="width: 22vw" @change="onTemplateChange">
            <a-select-option v-for="t in templates" :key="t.code" :value="t.code">{{ t.code }}</a-select-option>
          </a-select>
        </div>
      </section>

      <!-- 高平台基准 -->
      <template v-if="currentLaserBaseHigh.length">
        <div class="inkjet-platform-label">高平台基准</div>
        <section v-for="(_item, idx) in currentLaserBaseHigh" :key="`high-${idx}`" class="bg_listItem" style="display: block">
          <div class="bgDefend_itemIn mb-1vh">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">
              激光器{{ Number(idx) + 1 }}<template v-if="_item.position"> ({{ _item.position }})</template>:
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X坐标:</div>
              <a-input v-model:value="_item.x" :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.x` ? 'keyInput' : ''" class="w-14vw" placeholder="0~30000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.x`, 6)" />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y坐标:</div>
              <a-input v-model:value="_item.y" :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.y` ? 'keyInput' : ''" class="w-14vw" placeholder="0~30000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.y`, 6)" />
              <span class="val-desc">0.001mm</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">角度:</div>
              <a-input v-model:value="_item.angle" :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.angle` ? 'keyInput' : ''" class="w-8vw" placeholder="" :maxlength="8" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.angle`, 8)" />
              <span class="val-desc">0.001度</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X偏移:</div>
              <a-input v-model:value="_item.offsetX" :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.offsetX` ? 'keyInput' : ''" class="w-14vw" placeholder="-10000~10000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.offsetX`, 6)" />
              <span class="val-desc">0.001mm(向左为负/向右为正)</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y偏移:</div>
              <a-input v-model:value="_item.offsetY" :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.offsetY` ? 'keyInput' : ''" class="w-14vw" placeholder="-10000~10000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.offsetY`, 6)" />
              <span class="val-desc">0.001mm(向上为负/向下为正)</span>
            </div>
          </div>
        </section>
      </template>

      <!-- 低平台基准 -->
      <template v-if="currentLaserBaseLow.length">
        <div class="inkjet-platform-label">低平台基准</div>
        <section v-for="(_item, idx) in currentLaserBaseLow" :key="`low-${idx}`" class="bg_listItem" style="display: block">
          <div class="bgDefend_itemIn mb-1vh">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">
              激光器{{ Number(idx) + 1 }}<template v-if="_item.position"> ({{ _item.position }})</template>:
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X坐标:</div>
              <a-input v-model:value="_item.x" :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.x` ? 'keyInput' : ''" class="w-14vw" placeholder="0~30000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.x`, 6)" />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y坐标:</div>
              <a-input v-model:value="_item.y" :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.y` ? 'keyInput' : ''" class="w-14vw" placeholder="0~30000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.y`, 6)" />
              <span class="val-desc">0.001mm</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">角度:</div>
              <a-input v-model:value="_item.angle" :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.angle` ? 'keyInput' : ''" class="w-8vw" placeholder="" :maxlength="8" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.angle`, 8)" />
              <span class="val-desc">0.001度</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X偏移:</div>
              <a-input v-model:value="_item.offsetX" :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.offsetX` ? 'keyInput' : ''" class="w-14vw" placeholder="-10000~10000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.offsetX`, 6)" />
              <span class="val-desc">0.001mm(向左为负/向右为正)</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y偏移:</div>
              <a-input v-model:value="_item.offsetY" :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.offsetY` ? 'keyInput' : ''" class="w-14vw" placeholder="-10000~10000" :maxlength="6" @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.offsetY`, 6)" />
              <span class="val-desc">0.001mm(向上为负/向下为正)</span>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 激光高度 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">激光高度</div>
      <template v-if="data.laserHeight && data.laserHeight.length">
        <section class="bg_listItem">
          <div class="w-full flex flex-wrap" style="row-gap: 1vh">
            <div v-for="(_val, idx) in data.laserHeight" :key="idx" class="bgDefend_itemIn" style="width: calc(50% - 2vw)">
              <div class="bgDefend_itemIn_tit">激光器{{ Number(idx) + 1 }}:</div>
              <a-input v-model:value="data.laserHeight[idx]" :class="keyInput === `laserHeight.${idx}` ? 'keyInput' : ''" class="w-14vw" placeholder="0~4000" :maxlength="5" @click.stop="onInputFocus($event, `laserHeight.${idx}`, 5)" />
              <span class="val-desc">0.1mm</span>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { setMoule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();

const data = ref<any>({});

// --- Template management ---
const selectedTemplateCode = ref('');
let originalDataStr = '';

const templates = computed(() => {
  return (data.value.laserLocation || []).map((loc: any) => ({ code: loc.templateCode }));
});

const currentTemplateIdx = computed(() => {
  return data.value.laserLocation?.findIndex((l: any) => l.templateCode === selectedTemplateCode.value) ?? 0;
});

const currentLaserBaseHigh = computed(() => {
  return data.value.laserLocation?.find((l: any) => l.templateCode === selectedTemplateCode.value)?.laserBaseHigh || [];
});

const currentLaserBaseLow = computed(() => {
  return data.value.laserLocation?.find((l: any) => l.templateCode === selectedTemplateCode.value)?.laserBaseLow || [];
});

// --- Unsaved changes confirm ---
const showConfirm = ref(false);
const pendingTemplateCode = ref<string | null>(null);

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
  const original = JSON.parse(originalDataStr);
  data.value = original;

  selectedTemplateCode.value = pendingTemplateCode.value!;
  pendingTemplateCode.value = null;
  showConfirm.value = false;

  convertAllToStrings();
}

function onConfirmCancel() {
  pendingTemplateCode.value = null;
  showConfirm.value = false;
}

// --- Validation ---
// Range rules from API doc: LaserBase x/y 0~30000, offsetX/offsetY -10000~10000; laserHeight 0~4000
const BASE_X_RANGE = { min: 0, max: 30000 };
const BASE_Y_RANGE = { min: 0, max: 30000 };
const BASE_OFFSET_X_RANGE = { min: -10000, max: 10000 };
const BASE_OFFSET_Y_RANGE = { min: -10000, max: 10000 };
const LASER_HEIGHT_RANGE = { min: 0, max: 4000 };

function validateField(rawVal: any, range: { min: number; max: number }, label: string): string | null {
  if (rawVal == null || String(rawVal).trim() === '') return `${label}不能为空`;
  const val = Number(rawVal);
  if (!isFinite(val)) return `${label}的值无效`;
  if (val < range.min || val > range.max) return `${label}超出范围（${range.min}~${range.max}），当前值：${val}`;
  return null;
}

function validateLaserBaseItems(items: any[], templateCode: string, platform: string): string[] {
  const errors: string[] = [];
  if (!Array.isArray(items)) return errors;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pos = item.position || `激光器${i + 1}`;
    const prefix = `[${templateCode}] ${platform} ${pos}`;
    const vx = validateField(item.x, BASE_X_RANGE, `${prefix} X坐标`);
    if (vx) errors.push(vx);
    const vy = validateField(item.y, BASE_Y_RANGE, `${prefix} Y坐标`);
    if (vy) errors.push(vy);
    const vox = validateField(item.offsetX, BASE_OFFSET_X_RANGE, `${prefix} X偏移`);
    if (vox) errors.push(vox);
    const voy = validateField(item.offsetY, BASE_OFFSET_Y_RANGE, `${prefix} Y偏移`);
    if (voy) errors.push(voy);
  }
  return errors;
}

function validateAll(): string[] {
  const errors: string[] = [];
  const laser = data.value;
  if (!laser) return errors;

  // 激光定位基准
  if (laser.laserLocation) {
    for (const loc of laser.laserLocation) {
      const tc = loc.templateCode || '未知模板';
      errors.push(...validateLaserBaseItems(loc.laserBaseHigh, tc, '高平台'));
      errors.push(...validateLaserBaseItems(loc.laserBaseLow, tc, '低平台'));
    }
  }

  // 激光高度
  if (laser.laserHeight) {
    for (let i = 0; i < laser.laserHeight.length; i++) {
      const v = validateField(laser.laserHeight[i], LASER_HEIGHT_RANGE, `激光高度 激光器${i + 1}`);
      if (v) errors.push(v);
    }
  }

  return errors;
}

// --- Helpers ---
const NUM_FIELDS = ['x', 'y', 'angle', 'offsetX', 'offsetY'];

function convertArrayFields(arr: any[], toNum: boolean) {
  if (!Array.isArray(arr)) return;
  for (const item of arr) {
    for (const f of NUM_FIELDS) {
      if (item[f] != null) {
        item[f] = toNum ? Number(item[f]) : String(item[f]);
      }
    }
  }
}

function convertAllToStrings() {
  if (data.value.laserHeight) {
    data.value.laserHeight = data.value.laserHeight.map((v: any) => String(v));
  }
  if (data.value.laserLocation) {
    for (const loc of data.value.laserLocation) {
      convertArrayFields(loc.laserBaseHigh, false);
      convertArrayFields(loc.laserBaseLow, false);
    }
  }
}

// --- Keyboard ---
const showKeyboard = ref(false);
const keyInput = ref('');
const limitInput = ref(0);
const cursorPosition = ref<any>(null);
const transformValue = ref<any>(null);

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function getKeyboardValue(): string {
  if (!keyInput.value || !data.value) return '';
  const path = keyInput.value;

  if (path.startsWith('laserHeight.')) {
    const idx = Number(path.split('.')[1]);
    return String(data.value.laserHeight?.[idx] ?? '');
  }

  if (path.startsWith('base.')) {
    const [, locIdx, platform, idx, field] = path.split('.');
    const loc = data.value.laserLocation?.[Number(locIdx)];
    const baseArr = platform === 'high' ? loc?.laserBaseHigh : loc?.laserBaseLow;
    if (baseArr?.[Number(idx)]) {
      return String(baseArr[Number(idx)][field] ?? '');
    }
    return '';
  }

  return '';
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
  const path = keyInput.value;
  if (!data.value) return;

  if (path.startsWith('laserHeight.')) {
    const idx = Number(path.split('.')[1]);
    if (data.value.laserHeight) {
      data.value.laserHeight[idx] = input;
    }
    return;
  }

  if (path.startsWith('base.')) {
    const [, locIdx, platform, idx, field] = path.split('.');
    const loc = data.value.laserLocation?.[Number(locIdx)];
    const baseArr = platform === 'high' ? loc?.laserBaseHigh : loc?.laserBaseLow;
    if (baseArr?.[Number(idx)]) {
      baseArr[Number(idx)][field] = input;
    }
  }
}

// --- API ---
async function load() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await setMoule.getLaser();
    data.value = res.respData || {};

    if (data.value.laserLocation?.length) {
      selectedTemplateCode.value = data.value.laserLocation[0].templateCode;
    }

    convertAllToStrings();
    originalDataStr = JSON.stringify(data.value);
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function save() {
  try {
    useAppStore().setSpinning(true);
    const reqData = JSON.parse(JSON.stringify(data.value));

    // 先验证范围
    const errors = validateAll();
    if (errors.length) {
      notification.error({ message: '参数范围错误', description: errors[0], placement: 'bottomRight', class: 'notificationE-custom-class' });
      return;
    }

    if (reqData.laserHeight) {
      reqData.laserHeight = reqData.laserHeight.map((v: any) => Number(v));
    }
    if (reqData.laserLocation) {
      for (const loc of reqData.laserLocation) {
        convertArrayFields(loc.laserBaseHigh, true);
        convertArrayFields(loc.laserBaseLow, true);
      }
    }

    await setMoule.setLaser(reqData);

    convertAllToStrings();
    originalDataStr = JSON.stringify(data.value);

    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

defineExpose({ load, save, hideKeyboard });

onMounted(() => {
  load();
});
</script>

<style scoped lang="less">
.val-desc {
  margin-left: 0.5vw;
  color: #989ca1;
  font-size: 1.6vw;
}
.keyInput {
  border-color: #3662ec;
}
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
.inkjet-platform-label {
  color: #989ca1;
  font-size: 2vw;
  padding: 0.5vh 0;
  margin-left: 2vw;
}
</style>
