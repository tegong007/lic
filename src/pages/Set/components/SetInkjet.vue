<template>
  <div>
    <TheConfirm title="舍弃当前修改" :open="showConfirm" :handle-ok="onConfirmDiscard" :handle-cancel="onConfirmCancel" />

    <SimpleKeyboard
      v-if="showKeyboard"
      layout="num"
      keyboard-width="w-30vw"
      :transform="transformValue"
      :input="getKeyboardValue()"
      :max-length="limitInput"
      @on-change="onChangeKeyboard"
      @closekeyboard="hideKeyboard"
    />

    <!-- 喷墨起始位置 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">喷墨起始位置</div>

      <!-- 主副页 -->
      <template v-if="data.uvMainOffsetHigh || data.uvMainOffsetLow">
        <section class="bg_listItem">
          <template v-if="data.uvMainOffsetHigh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">主副页-高平台 X轴:</div>
              <a-input
                v-model:value="data.uvMainOffsetHigh.x"
                :class="keyInput === 'off.MainHigh.x' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.MainHigh.x', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y轴:</div>
              <a-input
                v-model:value="data.uvMainOffsetHigh.y"
                :class="keyInput === 'off.MainHigh.y' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.MainHigh.y', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </template>
        </section>
        <section class="bg_listItem">
          <template v-if="data.uvMainOffsetLow">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">主副页-低平台 X轴:</div>
              <a-input
                v-model:value="data.uvMainOffsetLow.x"
                :class="keyInput === 'off.MainLow.x' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.MainLow.x', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y轴:</div>
              <a-input
                v-model:value="data.uvMainOffsetLow.y"
                :class="keyInput === 'off.MainLow.y' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.MainLow.y', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </template>
        </section>
      </template>

      <!-- 加注页 -->
      <template v-if="data.uvObsvOffsetHigh || data.uvObsvOffsetLow">
        <section class="bg_listItem">
          <template v-if="data.uvObsvOffsetHigh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">加注页-高平台 X轴:</div>
              <a-input
                v-model:value="data.uvObsvOffsetHigh.x"
                :class="keyInput === 'off.ObsvHigh.x' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.ObsvHigh.x', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y轴:</div>
              <a-input
                v-model:value="data.uvObsvOffsetHigh.y"
                :class="keyInput === 'off.ObsvHigh.y' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.ObsvHigh.y', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </template>
        </section>
        <section class="bg_listItem">
          <template v-if="data.uvObsvOffsetLow">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">加注页-低平台 X轴:</div>
              <a-input
                v-model:value="data.uvObsvOffsetLow.x"
                :class="keyInput === 'off.ObsvLow.x' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.ObsvLow.x', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y轴:</div>
              <a-input
                v-model:value="data.uvObsvOffsetLow.y"
                :class="keyInput === 'off.ObsvLow.y' ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~20000"
                :maxlength="9"
                @click.stop="onInputFocus($event, 'off.ObsvLow.y', 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </template>
        </section>
      </template>
    </div>

    <!-- 喷墨定位 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">喷墨定位</div>

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
      <template v-if="currentUvBaseHigh.length">
        <div class="inkjet-platform-label">高平台基准</div>
        <section
          v-for="(_item, idx) in currentUvBaseHigh"
          :key="`high-${idx}`"
          class="bg_listItem"
          style="display: block"
        >
          <div class="bgDefend_itemIn mb-1vh">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">
              喷墨定位{{ Number(idx) + 1 }}<template v-if="_item.position"> ({{ _item.position }})</template>:
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X坐标:</div>
              <a-input
                v-model:value="_item.x"
                :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.x` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~30000"
                :maxlength="9"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.x`, 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y坐标:</div>
              <a-input
                v-model:value="_item.y"
                :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.y` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~30000"
                :maxlength="9"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.y`, 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">角度:</div>
              <a-input
                v-model:value="_item.angle"
                :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.angle` ? 'keyInput' : ''"
                class="w-8vw"
                placeholder=""
                :maxlength="8"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.angle`, 8)"
              />
              <span class="val-desc">0.001度</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X偏移:</div>
              <a-input
                v-model:value="_item.offsetX"
                :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.offsetX` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="-10000~10000"
                :maxlength="6"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.offsetX`, 6)"
              />
              <span class="val-desc">0.001mm(向左为负/向右为正)</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y偏移:</div>
              <a-input
                v-model:value="_item.offsetY"
                :class="keyInput === `base.${currentTemplateIdx}.high.${Number(idx)}.offsetY` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="-10000~10000"
                :maxlength="6"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.high.${Number(idx)}.offsetY`, 6)"
              />
              <span class="val-desc">0.001mm(向上为负/向下为正)</span>
            </div>
          </div>
        </section>
      </template>

      <!-- 低平台基准 -->
      <template v-if="currentUvBaseLow.length">
        <div class="inkjet-platform-label">低平台基准</div>
        <section
          v-for="(_item, idx) in currentUvBaseLow"
          :key="`low-${idx}`"
          class="bg_listItem"
          style="display: block"
        >
          <div class="bgDefend_itemIn mb-1vh">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">
              喷墨定位{{ Number(idx) + 1 }}<template v-if="_item.position"> ({{ _item.position }})</template>:
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X坐标:</div>
              <a-input
                v-model:value="_item.x"
                :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.x` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~30000"
                :maxlength="9"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.x`, 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y坐标:</div>
              <a-input
                v-model:value="_item.y"
                :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.y` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="0~30000"
                :maxlength="9"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.y`, 9)"
              />
              <span class="val-desc">0.001mm</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">角度:</div>
              <a-input
                v-model:value="_item.angle"
                :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.angle` ? 'keyInput' : ''"
                class="w-8vw"
                placeholder=""
                :maxlength="8"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.angle`, 8)"
              />
              <span class="val-desc">0.001度</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">X偏移:</div>
              <a-input
                v-model:value="_item.offsetX"
                :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.offsetX` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="-10000~10000"
                :maxlength="6"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.offsetX`, 6)"
              />
              <span class="val-desc">0.001mm(向左为负/向右为正)</span>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">Y偏移:</div>
              <a-input
                v-model:value="_item.offsetY"
                :class="keyInput === `base.${currentTemplateIdx}.low.${Number(idx)}.offsetY` ? 'keyInput' : ''"
                class="w-14vw"
                placeholder="-10000~10000"
                :maxlength="6"
                @click.stop="onInputFocus($event, `base.${currentTemplateIdx}.low.${Number(idx)}.offsetY`, 6)"
              />
              <span class="val-desc">0.001mm(向上为负/向下为正)</span>
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
  return (data.value.uvLocation || []).map((loc: any) => ({ code: loc.templateCode }));
});

const currentTemplateIdx = computed(() => {
  return data.value.uvLocation?.findIndex((l: any) => l.templateCode === selectedTemplateCode.value) ?? 0;
});

const currentUvBaseHigh = computed(() => {
  return data.value.uvLocation?.find((l: any) => l.templateCode === selectedTemplateCode.value)?.uvBaseHigh || [];
});

const currentUvBaseLow = computed(() => {
  return data.value.uvLocation?.find((l: any) => l.templateCode === selectedTemplateCode.value)?.uvBaseLow || [];
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
  // 还原到原始数据
  const original = JSON.parse(originalDataStr);
  // 保留当前模板数据不变，切换后整体还原
  data.value = original;

  // 切换到待选模板，重新转换字符串
  selectedTemplateCode.value = pendingTemplateCode.value!;
  pendingTemplateCode.value = null;
  showConfirm.value = false;

  // 重新字符串化所有数值字段
  convertAllToStrings();
}

function onConfirmCancel() {
  pendingTemplateCode.value = null;
  showConfirm.value = false;
}

// --- Validation ---
// Range rules from API doc: UVBase x/y 0~30000, offsetX/offsetY -10000~10000; Offset x/y 0~20000
const BASE_X_RANGE = { min: 0, max: 30000 };
const BASE_Y_RANGE = { min: 0, max: 30000 };
const BASE_OFFSET_X_RANGE = { min: -10000, max: 10000 };
const BASE_OFFSET_Y_RANGE = { min: -10000, max: 10000 };
const OFFSET_RANGE = { min: 0, max: 20000 };

function validateField(rawVal: any, range: { min: number; max: number }, label: string): string | null {
  if (rawVal == null || String(rawVal).trim() === '') return `${label}不能为空`;
  const val = Number(rawVal);
  if (!isFinite(val)) return `${label}的值无效`;
  if (val < range.min || val > range.max) return `${label}超出范围（${range.min}~${range.max}），当前值：${val}`;
  return null;
}

function validateUvBaseItems(items: any[], templateCode: string, platform: string): string[] {
  const errors: string[] = [];
  if (!Array.isArray(items)) return errors;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pos = item.position || `喷墨定位${i + 1}`;
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

function validateOffset(obj: any, label: string): string[] {
  const errors: string[] = [];
  if (!obj) return errors;
  const vx = validateField(obj.x, OFFSET_RANGE, `${label} X轴`);
  if (vx) errors.push(vx);
  const vy = validateField(obj.y, OFFSET_RANGE, `${label} Y轴`);
  if (vy) errors.push(vy);
  return errors;
}

function validateAll(): string[] {
  const errors: string[] = [];
  const uv = data.value;
  if (!uv) return errors;

  // 偏移量
  for (const key of OFFSET_KEYS) {
    if (uv[key]) {
      const nameMap: Record<string, string> = {
        uvMainOffsetHigh: '主副页-高平台',
        uvMainOffsetLow: '主副页-低平台',
        uvObsvOffsetHigh: '加注页-高平台',
        uvObsvOffsetLow: '加注页-低平台',
      };
      errors.push(...validateOffset(uv[key], nameMap[key] || key));
    }
  }

  // 喷墨定位基准
  if (uv.uvLocation) {
    for (const loc of uv.uvLocation) {
      const tc = loc.templateCode || '未知模板';
      errors.push(...validateUvBaseItems(loc.uvBaseHigh, tc, '高平台'));
      errors.push(...validateUvBaseItems(loc.uvBaseLow, tc, '低平台'));
    }
  }

  return errors;
}

// --- Helper: convert arrays/objects to/from string ---
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

function convertOffsetFields(obj: any, toNum: boolean) {
  if (!obj) return;
  for (const f of ['x', 'y']) {
    if (obj[f] != null) {
      obj[f] = toNum ? Number(obj[f]) : String(obj[f]);
    }
  }
}

const OFFSET_KEYS = ['uvMainOffsetHigh', 'uvMainOffsetLow', 'uvObsvOffsetHigh', 'uvObsvOffsetLow'];

function convertAllToStrings() {
  for (const key of OFFSET_KEYS) {
    convertOffsetFields(data.value[key], false);
  }
  if (data.value.uvLocation) {
    for (const loc of data.value.uvLocation) {
      convertArrayFields(loc.uvBaseHigh, false);
      convertArrayFields(loc.uvBaseLow, false);
    }
  }
}

// --- offset key mapping (for keyboard) ---
const OFFSET_KEY_MAP: Record<string, string> = {
  MainHigh: 'uvMainOffsetHigh',
  MainLow: 'uvMainOffsetLow',
  ObsvHigh: 'uvObsvOffsetHigh',
  ObsvLow: 'uvObsvOffsetLow',
};

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

  if (path.startsWith('off.')) {
    const [, type, field] = path.split('.');
    const dataKey = OFFSET_KEY_MAP[type];
    if (dataKey && data.value[dataKey]) {
      return String(data.value[dataKey][field] ?? '');
    }
    return '';
  }

  if (path.startsWith('base.')) {
    const [, locIdx, platform, idx, field] = path.split('.');
    const loc = data.value.uvLocation?.[Number(locIdx)];
    const baseArr = platform === 'high' ? loc?.uvBaseHigh : loc?.uvBaseLow;
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

  if (path.startsWith('off.')) {
    const [, type, field] = path.split('.');
    const dataKey = OFFSET_KEY_MAP[type];
    if (dataKey && data.value[dataKey]) {
      data.value[dataKey][field] = input;
    }
    return;
  }

  if (path.startsWith('base.')) {
    const [, locIdx, platform, idx, field] = path.split('.');
    const loc = data.value.uvLocation?.[Number(locIdx)];
    const baseArr = platform === 'high' ? loc?.uvBaseHigh : loc?.uvBaseLow;
    if (baseArr?.[Number(idx)]) {
      baseArr[Number(idx)][field] = input;
    }
  }
}

// --- API ---
async function load() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await setMoule.getUv();
    data.value = res.respData || {};

    // 默认选中第一个模板
    if (data.value.uvLocation?.length) {
      selectedTemplateCode.value = data.value.uvLocation[0].templateCode;
    }

    // 数值转字符串供输入框使用
    convertAllToStrings();

    // 保存原始快照
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

    for (const key of OFFSET_KEYS) {
      convertOffsetFields(reqData[key], true);
    }
    if (reqData.uvLocation) {
      for (const loc of reqData.uvLocation) {
        convertArrayFields(loc.uvBaseHigh, true);
        convertArrayFields(loc.uvBaseLow, true);
      }
    }

    await setMoule.setUv(reqData);

    // 保存后更新快照
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
