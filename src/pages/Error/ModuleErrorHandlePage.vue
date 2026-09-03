<template>
  <div class="relative h-100vh w-full flex flex-col pb-[2vh] pt-[10vh]" style="background: url('@/assets/image/bg.png') center / 100% 100% no-repeat">
    <!-- 虚拟键盘：点击证本号输入框时唤起（参考维护设置页），证本号含字母，用 default 全键盘 -->
    <SimpleKeyboard v-if="showKeyboard" ref="kbRef" layout="default" :enable-chinese="false" keyboard-width="w-30vw" :transform="keyboardTransform" :input="newDocID" :max-length="20" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <!-- 标题：贴左 + 只右线，中文模块名「模块一错误处理」 -->
    <div class="handle-tit w-100%">
      <span class="handle-tit-text">模块{{ moduleCn }}错误处理</span>
    </div>

    <!-- 中部：左侧图片栏（含查看动作）+ 右侧表单（含底部按钮） -->
    <div class="content mt-2vh w-full flex flex-1 gap-2vw overflow-hidden px-4vw">
      <!-- 左侧：图片 + 查看动作（图片下方居中） -->
      <div class="img-left">
        <!-- 左图上方错误描述条：只显示 msg（本页仅在出错时进入） -->
        <div v-if="errorMsg" class="module-err-tip">{{ errorMsg }}</div>
        <div class="img-wrap">
          <div v-for="img in imageItems" :key="img.key" class="img-item">
            <img :src="img.src" :alt="img.key" />
          </div>
        </div>
        <a-button type="link" class="btn_normal view-action-btn mb1vh !mr-0" @click="handleViewAction">查看动作</a-button>
      </div>

      <!-- 右侧：表单 + 底部按钮 -->
      <div class="form-right flex flex-col flex-1 overflow-hidden">
        <!-- 顶部输入框 + 添加按钮（同一行、高度一致） -->
        <div class="add-row mb-1vh flex items-center justify-end">
          <span class="mr-1vw whitespace-nowrap text-1.2vw">手动输入证本号（默认已取走）：</span>
          <!-- <a-input v-model:value="newDocID" class="doc-input mr-1vw" placeholder="请输入" allow-clear /> -->
          <a-input v-model:value="newDocID" placeholder="请输入证本号" :maxlength="20" class="mr-1vw flex-1" @click.stop="onInputFocus($event, 'docID')" @input="filterDigits" />

          <a-button type="link" class="btn_normal add-btn !mr-0" :disabled="!newDocID.trim()" @click="handleAdd">添加</a-button>
        </div>

        <!-- 列表：div + flex 行渲染，单行单色（透明），不描边 -->
        <div class="list-wrap flex-1 overflow-auto">
          <div class="list-header">
            <div class="cell col-seq">序号</div>
            <div class="cell col-fwDoc">内部流水号</div>
            <div class="cell col-doc">证本号</div>
            <div class="cell col-action">处理方式</div>
          </div>
          <div v-for="(row, index) in exDocList" :key="row.key" class="list-row">
            <div class="cell col-seq">{{ String(index + 1).padStart(3, '0') }}</div>
            <div class="cell col-fwDoc">{{ row.fwDocSn }}</div>
            <div class="cell col-doc">{{ row.docID }}</div>
            <div class="cell col-action">
              <a-checkbox :checked="row.removed === 1" @change="(e: any) => updateRemoved(row, 1, e.target.checked)">已取走</a-checkbox>
              <a-checkbox class="ml-2vw" :checked="row.removed === 0" @change="(e: any) => updateRemoved(row, 0, e.target.checked)">不处理</a-checkbox>
            </div>
          </div>
        </div>

        <!-- 底部按钮：返回 + 确认提交（右对齐） -->
        <div class="footer flex gap-2vw">
          <a-button type="link" class="btn_normal !mr-0" @click="handleReturn">返回</a-button>
          <a-button type="link" class="btn_normal !mr-0" @click="handleSubmit">确认提交</a-button>
        </div>
      </div>
    </div>

    <!-- 查看动作弹框（TheConfirm 同款样式，按当前模块 uid 渲染固定动作） -->
    <ViewActionModal :open="showActionModal" :module-uid="moduleUid" :handle-cancel="closeActionModal" />
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ErrorModule } from '@/apis/proApi';
import m1Bottom from '@/assets/image/bigScreen/error/m1-bottom.png';

// 图片资源（按目录实际命名；m4 文件名拼写为 bttom，按原样导入）
import m1Top from '@/assets/image/bigScreen/error/m1-top.png';
import m2 from '@/assets/image/bigScreen/error/m2.png';
import m3Bottom from '@/assets/image/bigScreen/error/m3-bottom.png';
import m3Top from '@/assets/image/bigScreen/error/m3-top.png';
import m4Bottom from '@/assets/image/bigScreen/error/m4-bttom.png';
import m4Top from '@/assets/image/bigScreen/error/m4-top.png';
import m6Bottom from '@/assets/image/bigScreen/error/m6-bottom.png';
import m6Top from '@/assets/image/bigScreen/error/m6-top.png';
import m7 from '@/assets/image/bigScreen/error/m7.png';
import ViewActionModal from '@/components/ViewActionModal.vue';

interface ExDoc {
  fwBookSn?: number;
  fwDocSn?: number;
  docID: string;
}

interface ModuleItem {
  uid: string;
  code: number;
  msg: string;
  mainCode: number;
  subCode: number;
  exDoc: ExDoc[];
}

interface ExDocRow extends ExDoc {
  key: string;
  /** 0=不处理；1=已取走 */
  removed: 0 | 1;
  isAdded: boolean;
}

/** 左侧待渲染的模块细节图（只渲染一张） */
interface ImageItem {
  key: string;
  src: string;
}

const route = useRoute();
const router = useRouter();
const { notification } = App.useApp();

/** 来自 query 的 moduleUid，如 m1 */
const moduleUid = computed(() => String(route.query.uid || 'm1'));
const moduleNum = computed(() => moduleUid.value.match(/m(\d+)/i)?.[1] || '1');

/** 阿拉伯数字 → 中文数字，标题用「模块一错误处理」而非「1模块错误处理」 */
const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const moduleCn = computed(() => CN_NUM[Number(moduleNum.value)] ?? moduleNum.value);

/** 图片映射：模块 → top/bottom/单图 */
const MODULE_IMAGES: Record<string, { top?: string; bottom?: string; single?: string }> = {
  m1: { top: m1Top, bottom: m1Bottom },
  m2: { single: m2 },
  m3: { top: m3Top, bottom: m3Bottom },
  m4: { top: m4Top, bottom: m4Bottom },
  m6: { top: m6Top, bottom: m6Bottom },
  m7: { single: m7 },
};

const items = ref<ModuleItem[]>([]);
/** 用 reactive 让行内属性变更触发重渲染 */
const exDocList = reactive<ExDocRow[]>([]);
const newDocID = ref('');
/** 查看动作弹框显隐 */
const showActionModal = ref(false);

// --- 虚拟键盘（参考维护设置页 SetGeneral）---
const showKeyboard = ref(false);
const kbRef = ref<any>(null);
const keyboardTransform = ref<any>([0, 0]);

function hideKeyboard() {
  showKeyboard.value = false;
}

/** 物理键盘兜底：只允许字母 + 数字，过滤中文与符号 */
function filterDigits(e: any) {
  const v = e.target?.value ?? '';
  const cleaned = String(v).replace(/[^a-z0-9]/gi, '');
  if (cleaned !== v) newDocID.value = cleaned;
}

function onInputFocus(event: any, key: string) {
  showKeyboard.value = true;
  // 渲染后实测键盘当前位置，把补偿量换算成相对位移，精确贴到输入框正下方、水平居中于输入框
  nextTick(() => {
    requestAnimationFrame(() => {
      const kbEl = (kbRef.value?.$el || kbRef.value?.parentRef) as HTMLElement | undefined;
      const inputEl = event?.target as HTMLElement | undefined;
      if (!kbEl || !inputEl) return;
      const kbRect = kbEl.getBoundingClientRect();
      const inputRect = inputEl.getBoundingClientRect();
      const deltaY = inputRect.bottom + 8 - kbRect.top;
      const deltaX = inputRect.left + inputRect.width / 2 - (kbRect.left + kbRect.width / 2);
      keyboardTransform.value = [deltaX, deltaY > 0 ? deltaY : 0];
    });
  });
}

function onChangeKeyboard(input: string, keyboard: any) {
  // 证本号含字母：过滤掉中文与符号，仅保留字母 + 数字
  const cleaned = input.replace(/[^a-z0-9]/gi, '');
  newDocID.value = cleaned;
  // 同步光标位置
  const caret = keyboard?.caretPosition;
  if (caret !== null && caret !== undefined) {
    setTimeout(() => {
      const el = document.querySelector('.add-row .ant-input') as any;
      if (el?.setSelectionRange) {
        el.focus();
        el.setSelectionRange(caret, caret);
      }
    }, 100);
  }
}

/**
 * 上图工位：命中即显示 top，否则 bottom（m3 / m4 / m6）
 * m1 例外：见 BOTTOM_JOB_UIDS，仅 M1_SLEW_JOB 显示 bottom，其余都 top
 */
const TOP_JOB_UIDS: Record<string, string[]> = {
  m3: ['M2_LASER_JOB'],
  m4: ['M3_INKJET_JOB'],
  m6: ['M5_INKJET_JOB'],
};
/** 下图表工位（仅 m1）：命中即 bottom，其余都 top */
const BOTTOM_JOB_UIDS: Record<string, string[]> = {
  m1: ['M1_SLEW_JOB'],
};

const imageItems = computed<ImageItem[]>(() => {
  const images = MODULE_IMAGES[moduleUid.value];
  if (!images) return [];

  // 单图模块（m2 / m5 / m7 / m8）：直接显示一张
  if (images.single) {
    return [{ key: 'single', src: images.single }];
  }

  // 多图模块（m1 / m3 / m4 / m6）：循环所有 code !== 0 的工位，取第一个出错工位按其 uid 判上/下
  const errItems = items.value.filter(it => it.code !== 0);
  if (errItems.length === 0) {
    // 无出错工位时默认显示上图（便于核对图片资源）
    return images.top ? [{ key: 'top', src: images.top }] : [];
  }

  const uid = errItems[0].uid;
  const bottomUids = BOTTOM_JOB_UIDS[moduleUid.value] || [];
  // m1：命中 bottom 列表 → bottom，否则 → top；其余模块：命中 top 列表 → top，否则 → bottom
  const isTop = bottomUids.length ? !bottomUids.includes(uid) : (TOP_JOB_UIDS[moduleUid.value] || []).includes(uid);
  const target = isTop ? images.top : images.bottom;
  return target ? [{ key: isTop ? 'top' : 'bottom', src: target }] : [];
});

/**
 * 左侧错误描述条内容：汇总所有 code !== 0 的出错工位。
 * 左侧图片上方错误描述条：只显示接口返回的 msg 字段（本页仅出错时进入，取所有 code!=0 工位的 msg 拼接）。
 */
const errorMsg = computed(() => {
  const msgs = items.value
    .filter(it => it.code !== 0)
    .map(it => String(it.msg || '').trim())
    .filter(m => m.length > 0);
  return msgs.length ? msgs.join('；') : '';
});

async function fetchData() {
  try {
    const data: any = await ErrorModule.getModuleStatus({ moduleUid: moduleUid.value });
    if (data.respData && Array.isArray(data.respData)) {
      items.value = data.respData;
      exDocList.splice(0, exDocList.length);
      data.respData.forEach((item: ModuleItem) => {
        (item.exDoc || []).forEach((doc, idx) => {
          exDocList.push({
            ...doc,
            key: `${item.uid}-${idx}-${doc.fwDocSn}`,
            removed: 1,
            isAdded: false,
          });
        });
      });
    }
  } catch {
    items.value = [];
    exDocList.splice(0, exDocList.length);
  }
}

/**
 * 互斥勾选：勾「已取走」自动取消「不处理」，反之亦然。
 * 取消勾选时不做处理 —— removed 不变，受控的 :checked 会把勾选框弹回原状态。
 */
function updateRemoved(record: ExDocRow, target: 0 | 1, checked: boolean) {
  if (checked) record.removed = target;
}

function handleAdd() {
  const sn = newDocID.value.trim();
  if (!sn) return;
  const newRow: ExDocRow = {
    key: `added-${Date.now()}`,
    docID: sn,
    removed: 1,
    isAdded: true,
  };
  exDocList.unshift(newRow);
  newDocID.value = '';
  notification.success({ message: '成功', description: '已添加', class: 'notification-custom-class', placement: 'bottomRight' });
}

async function handleSubmit() {
  const submitInfo = exDocList.map((row) => {
    const base: any = {
      fwDocSn: row.fwDocSn,
      docID: row.docID,
      isAdded: row.isAdded,
      removed: row.removed,
    };
    if (!row.isAdded) base.fwBookSn = row.fwBookSn;
    return base;
  });
  console.log('🚀 ~ handleSubmit ~ submitInfo:', submitInfo);
  try {
    await ErrorModule.submitError({ submitInfo });
    notification.success({ message: '成功', description: '提交成功', class: 'notification-custom-class', placement: 'bottomRight' });
    // 提交成功后重新查询一次数据，刷新表格
    await fetchData();
  } catch (e) {
    notification.error({ message: '错误', description: `提交失败：${String(e)}`, class: 'notificationE-custom-class', placement: 'bottomRight' });
  }
}

function handleViewAction() {
  showActionModal.value = true;
}

function closeActionModal() {
  showActionModal.value = false;
}

function handleReturn() {
  router.push('/home-machine-error');
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="less">
.handle-tit {
  font-size: 1.8vw;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 4vw;
  white-space: nowrap;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    margin-left: 2vw;
    background: linear-gradient(90deg, #ffffff 0%, #ffffff00 100%);
  }
}

/* 左侧图片栏：图片占 flex-1，「查看动作」在图片下方居中 */
.img-left {
  width: 22%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
}

/* 左图上方错误描述条：只显示 msg，红字红边提示 */
.module-err-tip {
  width: 100%;
  margin-bottom: 1vh;
  padding: 0.6vh 0.8vw;
  font-size: 1.1vw;
  line-height: 1.4;
  color: #ffd2d2;
  text-align: center;
  background: rgba(180, 5, 5, 0.35);
  border: 1px solid rgba(255, 80, 80, 0.6);
  border-radius: 0.3vh;
}

.img-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.img-item {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.view-action-btn {
  /* 沿用 btn_normal，与下方返回/确认提交风格一致 */
  margin-top: 1vh;
}

/* 输入框：透明底 + 浅色细边 + 4vh */
.add-row {
  :deep(.ant-input) {
    font-size: 1.1vw;
    background-color: transparent !important;
    color: #ffffff;
    border: 1px solid #cfdef1;
    border-radius: 0;
    height: 4vh !important;
    width: 15vw;
    padding: 0 0.5vw;
    line-height: calc(4vh - 2px) !important;
  }
  :deep(.ant-input::placeholder) {
    color: #989ca1;
  }
}

/* 添加按钮：白字实心蓝底，高度与输入框对齐 */
.add-btn {
  height: 4.2vh !important;
  line-height: 4vh !important;
  font-size: 1.2vw !important;
  width: 8vw !important;
  margin-right: 0 !important;
  background-color: #3662ec !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 0.3vh !important;
  padding: 0 !important;
}

/* 列表：div + flex 行渲染，单行单色（透明） */
.list-wrap {
  flex: 1;
  overflow: auto;
  margin: 0.5vh 0;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3662ec;
    border-radius: 2px;
  }
}

.list-header {
  display: flex;
  align-items: center;
  padding: 1vh 0;
  font-size: 1.1vw;
  color: #cfdef1;
  font-weight: 600;
  /* 滚动时表头固定：sticky + 不透明背景（半透明会让下方行透出来） */
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #14263f;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 0.75vh 0;
  margin: 0.4vh 0;
  font-size: 1.1vw;
  color: #ffffff;
  /* 蓝色透明行背景（参考设置维护页面） */
  &:nth-of-type(odd) {
    background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%);
  }
  &:nth-of-type(even) {
    background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%);
  }
}

.cell {
  text-align: center;
  padding: 0 0.5vw;
}
.col-seq {
  width: 10%;
}
.col-fwDoc {
  width: 22%;
}
.col-doc {
  flex: 1;
}
.col-action {
  width: 26%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
}

/* 底部按钮区：右对齐，只有「返回 + 确认提交」 */
.footer {
  display: flex;
  justify-content: center;
  gap: 2vw;
  margin-top: 2vh;
}

/* checkbox 勾选绿色 + 放大 */
:deep(.ant-checkbox-wrapper) {
  color: #ffffff;
  font-size: 1.2vw;
}
:deep(.ant-checkbox-inner) {
  width: 20px !important;
  height: 20px !important;
  background-color: transparent;
  border-color: #cfdef1;
}
:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #5fcc34;
  border-color: #5fcc34;
}
:deep(.ant-checkbox-checked .ant-checkbox-inner::after) {
  left: 24% !important;
  top: 45% !important;
  width: 6px !important;
  height: 11px !important;
  border-width: 0 2px 2px 0 !important;
}
</style>
