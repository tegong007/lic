<template>
  <div class="relative h-100vh w-full flex flex-col items-center justify-between pb-[10vh] pt-[12vh]">
    <!-- 标题：维护页风格（文字 + 左右占满的线，无蓝色背景） -->
    <div class="err-page-tit w-90vw">
      <span class="err-page-tit-text">整机错误模块预览</span>
    </div>

    <!-- 图片区：机器图 + 8 区段红色覆盖层（居中于中部） -->
    <div class="w-full flex flex-1 items-center justify-center">
      <div class="relative w-90vw">
        <img class="block w-full" src="@/assets/image/bigScreen/error/machine.png" />
        <!-- 区段覆盖层：仅压机器主体（避开顶部标签区），按各模块实际宽度定位 -->
        <div class="modules-overlay absolute left-0 w-full" :style="{ height: overlayHeight }">
          <div
            v-for="(section, idx) in sections"
            :key="idx"
            class="module-cell absolute top-0 h-full"
            :class="{
              'is-error': section.error,
              'is-clickable': isClickable(section),
            }"
            :style="{ left: `${sectionBounds[idx].start}%`, width: `${sectionBounds[idx].width}%` }"
            @click="handleModuleClick(section)"
          />
        </div>
      </div>
    </div>

    <!-- 返回按钮：维护页 btn_normal 样式 -->
    <a-button type="link" class="btn_normal absolute bottom-2vh !mr-0" @click="handleReturn">返回</a-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { homeModule } from '@/apis/proApi';
import useCustomTimer from '@/utils/useCustomTimer';

const router = useRouter();
const { start, stop } = useCustomTimer();

interface ModuleSection {
  index: number;
  moduleUid: string;
  error: boolean;
}

const SECTION_COUNT = 8;

/**
 * 区段边界（按 machine.png 实际分割线像素位置换算的百分比）
 *  索引 0 = 模块八（最左）→ 索引 7 = 模块一（最右）
 *  数据由 _analyze_machine.py 从图片实际测量得出
 */
const sectionBounds = [
  { start: 0.0, width: 5.82 }, // 模块八
  { start: 5.82, width: 11.22 }, // 模块七
  { start: 17.04, width: 14.44 }, // 模块六
  { start: 31.48, width: 10.29 }, // 模块五
  { start: 41.77, width: 21.71 }, // 模块四
  { start: 63.48, width: 14.49 }, // 模块三
  { start: 77.97, width: 15.74 }, // 模块二
  { start: 93.71, width: 6.29 }, // 模块一
];

/** 8 个区段：左侧为模块八 (i=0)，右侧为模块一 (i=7) */
const sections = ref<ModuleSection[]>(
  Array.from({ length: SECTION_COUNT }, (_, i) => ({
    index: i,
    moduleUid: `m${SECTION_COUNT - i}`,
    error: false,
  })),
);

/** 模块五、模块八飘红也禁止点击跳转 */
const NOT_CLICKABLE_UIDS = new Set(['m5', 'm8']);

function isClickable(section: ModuleSection): boolean {
  return section.error && !NOT_CLICKABLE_UIDS.has(section.moduleUid);
}

/** 区段覆盖层高度 = 图片高度的 92%（从"模块名"下沿开始，填满机器图主体到底部） */
const overlayHeight = ref('92%');

const entire = ref<any>({});

/** 解析 uid 中的数字：m1 -> 1, M3 -> 3 */
function parseModuleNum(uid: any): number | null {
  if (!uid) return null;
  const match = String(uid).match(/^m(\d+)$/i);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return n >= 1 && n <= SECTION_COUNT ? n : null;
}

function refreshOverlay() {
  // 先清空所有 error 标志
  sections.value.forEach((s) => {
    s.error = false;
    s.moduleUid = `m${SECTION_COUNT - s.index}`;
  });
  const list = entire.value.modules || [];
  list.forEach((m: any) => {
    // modules 数组里的 code 非 0 就是出错了
    if (m.code === 0 || m.code === undefined) return;
    const num = parseModuleNum(m.uid);
    if (!num) return;
    // 模块 N → 区段索引 (N=1 时右端 i=7, N=8 时左端 i=0)
    const idx = SECTION_COUNT - num;
    if (sections.value[idx]) {
      sections.value[idx].moduleUid = String(m.uid).toLowerCase();
      sections.value[idx].error = true;
    }
  });
}

async function fetchData() {
  try {
    const data: any = await homeModule.getHomeList();
    if (data.respData && data.respData.entire) {
      entire.value = data.respData.entire;
      refreshOverlay();
    }
  } catch {
    entire.value = {};
  }
}

function startPolling() {
  start(() => {
    fetchData();
  }, 2);
}

function handleReturn() {
  router.push('/home');
}

function handleModuleClick(section: ModuleSection) {
  if (!isClickable(section)) return;
  router.push({ path: '/module-error-handle', query: { uid: section.moduleUid } });
}

onMounted(() => {
  fetchData();
  startPolling();
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="less">
.err-page-tit {
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

.modules-overlay {
  /* 覆盖层从"模块名"下沿（图片顶部 ~8%）开始，一直填满到图片底部 */
  top: 10%;
}

.module-cell {
  /* 图片自带白色分割线且区段已按精确边界定位，这里不画 border 避免重叠 */
  transition:
    background-color 0.4s ease,
    outline 0.2s ease;
}

/* 出错区段：静态红色半透明遮罩 */
.module-cell.is-error {
  background-color: rgba(180, 5, 5, 0.6);
}

/* 飘红且非 m5/m8 时可点击：手型 + hover 加深 + 描边提示 */
.module-cell.is-clickable {
  cursor: pointer;
}
.module-cell.is-clickable:hover {
  background-color: rgba(220, 10, 10, 0.8);
  outline: 2px solid #ff5050;
  outline-offset: -2px;
}
</style>
