<template>
  <a-modal width="44vw" :get-container="false" :open="open" :closable="false" centered force-render>
    <!-- 标题装饰：3 个色块 + 左右线 + 模块X动作 -->

    <div class="action-tit">
      <span class="tit-line left"></span>
      <span class="tit-text">模块{{ moduleCn }}动作</span>
      <span class="tit-line right"></span>
    </div>

    <!-- 动作内容：按视觉工位分组，每组 2 列网格（无分组时直接平铺） -->
    <div class="action-body">
      <div v-for="group in groups" :key="group.name || '_flat'" class="action-group">
        <div v-if="group.name" class="group-tit">
          <span class="group-bar"></span>
          <span class="group-name">{{ group.name }}</span>
        </div>
        <div class="action-grid">
          <div v-for="item in group.items" :key="`${item.jobUid}-${item.motion}`" class="grid-cell">
            <span class="cell-label">{{ item.label }}：</span>
            <a-button class="execute-btn" :loading="loadingKey === `${item.jobUid}-${item.motion}`" :disabled="!!loadingKey" @click="handleMotion(item.jobUid, item.motion)">执行</a-button>
          </div>
        </div>
      </div>
      <div v-if="!groups.length" class="empty">该模块暂无动作</div>
    </div>

    <template #footer>
      <a-flex justify="center" align="center">
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="handleClose">返回</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { ErrorModule } from '@/apis/proApi';

const props = defineProps({ open: Boolean, moduleUid: String, handleCancel: Function });
const { notification } = App.useApp();

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const moduleNum = computed(() => String(props.moduleUid || 'm1').match(/m(\d+)/i)?.[1] || '1');
const moduleCn = computed(() => CN_NUM[Number(moduleNum.value)] ?? moduleNum.value);

/**
 * 各模块固定动作配置（按视觉工位分组，每个动作含 jobUid + motion + 中文 label）：
 * - jobUid：用于接口调用 /tss/deal-err-command
 * - motion：动作编号
 * - label：按钮左侧中文展示名
 *
 * 注：固件工位 uid 前缀与 UI 模块号不对齐，此处按 UI 模块归组。
 * 模块一已按截图填好；模块二/三/四/六/七待用户给截图后补全中文 label。
 */
interface ActionItem {
  jobUid: string;
  motion: number;
  label: string;
}
interface ActionGroup {
  /** 工位显示名（可选，不传则无组标题，直接平铺 items） */
  name?: string;
  items: ActionItem[];
}

const MODULE_ACTIONS: Record<string, ActionGroup[]> = {
  // ── 模块一 ──
  m1: [
    {
      name: '装本工位',
      items: [
        { jobUid: 'M1_LOAD_JOB', motion: 1, label: '位置1 气缸升起' },
        { jobUid: 'M1_LOAD_JOB', motion: 2, label: '位置1 马达初始化' },
        { jobUid: 'M1_LOAD_JOB', motion: 3, label: '位置2 气缸升起' },
        { jobUid: 'M1_LOAD_JOB', motion: 4, label: '位置2 马达初始化' },
        { jobUid: 'M1_LOAD_JOB', motion: 5, label: '位置3 气缸升起' },
        { jobUid: 'M1_LOAD_JOB', motion: 6, label: '位置3 马达初始化' },
        { jobUid: 'M1_LOAD_JOB', motion: 7, label: '位置4 气缸升起' },
        { jobUid: 'M1_LOAD_JOB', motion: 8, label: '位置4 马达初始化' },
      ],
    },
    {
      name: '旋转工位',
      items: [
        { jobUid: 'M1_SLEW_JOB', motion: 1, label: '马达松开' },
        { jobUid: 'M1_SLEW_JOB', motion: 2, label: '气缸升起' },
        { jobUid: 'M1_SLEW_JOB', motion: 3, label: '气缸下降' },
        { jobUid: 'M1_SUB_BELT_JOB', motion: 1, label: '松开皮带' },
      ],
    },
  ],
  // ── 模块二 ──（按截图：无工位组标题，4 个动作 2x2 平铺）
  // 映射：开门→M1_BELT_JOB、翻页松开1→M1_TURN1_JOB、翻页松开2→M1_TURN2_JOB、皮带松开→M1_PRE_WASTE_JOB
  m2: [
    {
      items: [
        { jobUid: 'M1_BELT_JOB', motion: 1, label: '开门' },
        { jobUid: 'M1_TURN1_JOB', motion: 1, label: '翻页松开1' },
        { jobUid: 'M1_TURN2_JOB', motion: 1, label: '翻页松开2' },
        { jobUid: 'M1_PRE_WASTE_JOB', motion: 1, label: '皮带松开' },
      ],
    },
  ],
  // ── 模块三 ──
  m3: [
    {
      name: '送本工位',
      items: [
        { jobUid: 'M2_DELIVER_JOB', motion: 1, label: '气缸升起' },
        { jobUid: 'M2_DELIVER_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M2_DELIVER_JOB', motion: 3, label: '马达初始化' },
        { jobUid: 'M2_DELIVER_JOB', motion: 4, label: '气缸下降' },
        { jobUid: 'M2_DELIVER_JOB', motion: 5, label: '导轨气缸下降' },
      ],
    },
    {
      name: '激光工位',
      items: [
        { jobUid: 'M2_LASER_JOB', motion: 1, label: '低平台升起' },
        { jobUid: 'M2_LASER_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M2_LASER_JOB', motion: 3, label: '低平台放下' },
        { jobUid: 'M2_LASER_JOB', motion: 4, label: '扣子气缸放下' },
      ],
    },
    { name: '皮带工位', items: [{ jobUid: 'M2_BELT_JOB', motion: 1, label: '皮带松开' }] },
  ],
  // ── 模块四 ──
  m4: [
    {
      name: '送本工位',
      items: [
        { jobUid: 'M3_DELIVER_JOB', motion: 1, label: '气缸升起' },
        { jobUid: 'M3_DELIVER_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M3_DELIVER_JOB', motion: 3, label: '马达初始化' },
        { jobUid: 'M3_DELIVER_JOB', motion: 4, label: '气缸下降' },
        { jobUid: 'M3_DELIVER_JOB', motion: 5, label: '导轨气缸下降' },
      ],
    },
    {
      name: '喷墨工位',
      items: [
        { jobUid: 'M3_INKJET_JOB', motion: 1, label: '低平台升起' },
        { jobUid: 'M3_INKJET_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M3_INKJET_JOB', motion: 3, label: '低平台放下' },
        { jobUid: 'M3_INKJET_JOB', motion: 4, label: '扣子气缸放下' },
      ],
    },
    { name: '皮带工位', items: [{ jobUid: 'M3_BELT_JOB', motion: 1, label: '皮带松开' }] },
  ],
  // ── 模块六 ──
  m6: [
    {
      name: '送本工位',
      items: [
        { jobUid: 'M5_DELIVER_JOB', motion: 1, label: '气缸升起' },
        { jobUid: 'M5_DELIVER_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M5_DELIVER_JOB', motion: 3, label: '马达初始化' },
        { jobUid: 'M5_DELIVER_JOB', motion: 4, label: '气缸下降' },
        { jobUid: 'M5_DELIVER_JOB', motion: 5, label: '导轨气缸下降' },
      ],
    },
    {
      name: '喷墨工位',
      items: [
        { jobUid: 'M5_INKJET_JOB', motion: 1, label: '低平台升起' },
        { jobUid: 'M5_INKJET_JOB', motion: 2, label: '导轨气缸升起' },
        { jobUid: 'M5_INKJET_JOB', motion: 3, label: '低平台放下' },
        { jobUid: 'M5_INKJET_JOB', motion: 4, label: '扣子气缸放下' },
      ],
    },
    { name: '皮带工位', items: [{ jobUid: 'M5_BELT_JOB', motion: 1, label: '皮带松开' }] },
  ],
  // ── 模块七 ──（按截图：2 个动作扁平，无组标题）
  // 映射：开门→M6_WASTE_JOB、皮带松开→M6_BELT_JOB
  m7: [
    {
      items: [
        { jobUid: 'M6_WASTE_JOB', motion: 1, label: '开门' },
        { jobUid: 'M6_BELT_JOB', motion: 1, label: '皮带松开' },
      ],
    },
  ],
};

const groups = computed(() => MODULE_ACTIONS[String(props.moduleUid || 'm1')] || []);
/** 当前正在下发指令的按钮（jobUid-motion），用于按钮 loading 与互斥禁用 */
const loadingKey = ref('');

async function handleMotion(jobUid: string, motion: number) {
  const key = `${jobUid}-${motion}`;
  loadingKey.value = key;
  try {
    await ErrorModule.dealErrCommand({ jobUid, motion });
    notification.success({ message: '成功', description: `${jobUid} 动作${motion} 指令已下发`, class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: `执行失败：${String(error)}`, class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    loadingKey.value = '';
  }
}

function handleClose() {
  if (props.handleCancel) props.handleCancel();
}
</script>

<style scoped lang="less">
/* 标题顶部装饰：3 个蓝色长方形色块（截图风格） */

.deco-bar {
  width: 2.6vw;
  height: 0.6vh;
  background: linear-gradient(90deg, #ffffff66 0%, #3662ec 100%);
  border-radius: 1px;
}

/* 标题：文字 + 左右两条渐变线 */
.action-tit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  padding: 2vh 1vw 0;
  margin-bottom: 2vh;
}
.tit-text {
  font-size: 1.3vw;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
  letter-spacing: 0.1em;
}
.tit-line {
  flex: 1;
  height: 1px;
}
.tit-line.left {
  background: linear-gradient(90deg, #ffffff00 0%, #cfdef1 100%);
}
.tit-line.right {
  background: linear-gradient(90deg, #cfdef1 0%, #ffffff00 100%);
}

/* 动作区 */
.action-body {
  padding: 0 2.5vw 1vh;
  height: 41vh;
  max-height: 41vh;
  overflow: auto;
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

/* 工位组：左侧竖线 + 中文名（截图风格） */
.action-group {
  margin-bottom: 1.8vh;
}
.group-tit {
  display: flex;
  align-items: center;
  gap: 0.6vw;
  margin-bottom: 1vh;
  padding-left: 0.2vw;
}
.group-bar {
  width: 0.25vw;
  height: 1.5em;
  background: #ffffff;
  border-radius: 1px;
}
.group-name {
  font-size: 1.1vw;
  color: #ffffff;
  font-weight: 500;
}

/* 动作网格：2 列等宽，单元格 = 标签 + 执行按钮 */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.3vh 5vw;
}
.grid-cell {
  display: flex;
  align-items: center;
  justify-content: start;
  // gap: 1vw;
}
.cell-label {
  font-size: 0.9vw;
  color: #ffffff;
  white-space: nowrap;
  text-align: right;
  width: 9vw;
}
.execute-btn {
  // flex: 1;
  min-width: 4vw;
  height: 3.5vh !important;
  line-height: 3.5vh !important;
  padding: 0 1vw !important;
  font-size: 0.9vw !important;
  background-color: #3662ec !important;
  border: 0 !important;
  border-radius: 2px !important;
  color: #ffffff !important;
}

.empty {
  text-align: center;
  color: #cfdef1;
  font-size: 1.2vw;
  padding: 6vh 0;
}

/* 底部返回按钮（沿用 TheConfirm .btn 风格） */
.btn {
  background: #3662ec;
  border: 0;
  color: #ffffff;
  width: 23%;
  font-size: 2.3vh;
  height: 5vh;
  border-radius: 5px;
  &:hover {
    color: #ffffff;
  }
}
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 58vh;
  background-color: #03163e;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
</style>
