<template>
  <div>
    <!-- 固件模块配置 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">固件模块配置</div>
      <template v-if="data.fwModuleEnable?.settings?.length">
        <section class="bg_listItem">
          <div class="w-full flex flex-wrap" style="row-gap: 1vh">
            <div v-for="setting in data.fwModuleEnable.settings" :key="setting.module" class="bgDefend_itemIn" style="width: calc((100% - 6vw) / 3)">
              <div class="bgDefend_itemIn_tit">{{ moduleNameMap[setting.module] || `模块${setting.module}` }}:</div>
              <a-switch :checked="setting.isEnable" @update:checked="(val: boolean) => (setting.isEnable = val)" />
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 固件工位配置 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">固件工位配置</div>
      <!-- 非 M7_SLOT 的工位逐个显示 -->
      <template v-for="setting in fwJobSettings.otherSettings" :key="setting.jobUid">
        <div class="bgDefend_itemIn mb-1vh">
          <div class="bgDefend_itemIn_tit inkjet-loc-tit">{{ jobNameMap[setting.jobUid] || setting.jobUid }}:</div>
        </div>
        <section class="bg_listItem">
          <div class="w-full flex flex-wrap" style="row-gap: 1vh">
            <div v-for="place in setting.places" :key="`${setting.jobUid}-${place.no}`" class="bgDefend_itemIn" style="width: calc((100% - 8vw) / 4)">
              <div class="bgDefend_itemIn_tit">工位{{ place.no }}:</div>
              <a-switch :checked="place.isEnable" @update:checked="(val: boolean) => (place.isEnable = val)" />
            </div>
          </div>
        </section>
      </template>
      <!-- M7_SLOT 合并为一个收本工位 -->
      <template v-if="fwJobSettings.slotPlaces.length">
        <div class="bgDefend_itemIn mb-1vh">
          <div class="bgDefend_itemIn_tit inkjet-loc-tit">收本工位:</div>
        </div>
        <section class="bg_listItem">
          <div class="w-full flex flex-wrap" style="row-gap: 1vh">
            <div v-for="place in fwJobSettings.slotPlaces" :key="`slot-${place._no}`" class="bgDefend_itemIn" style="width: calc((100% - 8vw) / 4)">
              <div class="bgDefend_itemIn_tit">工位{{ place._no }}:</div>
              <a-switch :checked="place.ref.isEnable" @update:checked="(val: boolean) => (place.ref.isEnable = val)" />
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 软件工位配置 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">软件工位配置</div>
      <template v-if="data.positionConfig">
        <section class="bg_listItem">
          <div class="w-full flex flex-wrap" style="row-gap: 1vh">
            <div v-for="item in softPositionItems" :key="item.key" class="bgDefend_itemIn" style="width: calc(50% - 5vw)">
              <div class="bgDefend_itemIn_tit" style="text-align: right; min-width: 18vw; flex-shrink: 0">{{ item.label }}:</div>
              <a-switch :checked="data.positionConfig[item.key]" @update:checked="(val: boolean) => (data.positionConfig[item.key] = val)" />
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
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();

const data = ref<any>({
  fwModuleEnable: null,
  fwJobPositionEnable: null,
  positionConfig: null,
});

const moduleNameMap: Record<number, string> = {
  1: '激光模块',
  2: '喷墨模块',
  3: '加注模块',
};

const jobNameMap: Record<string, string> = {
  M1_BELT_JOB: '模块1皮带工位',
  M1_LOAD_JOB: '模块1装本工位',
  M1_WASTE_JOB: '模块1废本仓工位',
  M1_TURN1_JOB: '模块1翻页1工位',
  M1_PHOTO_JOB: '模块1照相工位',
  M1_LS_DELIVER_JOB: '模块1激光送本工位',
  M2_BELT_JOB: '模块2皮带工位',
  M2_TRANSITION_JOB: '模块2过渡位',
  M2_DUMMY_JOB: '模块2预留工位',
  M2_IJ_DELIVER_JOB: '模块2喷墨送本工位',
  M2_INKJET_JOB: '模块2喷墨工位',
  M2_CHECK_JOB: '模块2检查工位',
  M2_SLOT1_JOB: '模块2仓槽1待入仓工位',
  M2_SLOT2_JOB: '模块2仓槽2待入仓工位',
  RFID_BOOK_STORE: '写芯片工位',
  M2_LASER_JOB: '激光工位',
  M3_INKJET_JOB: '主副页喷墨工位',
  M5_INKJET_JOB: '加注页喷墨工位',
  M7_SLOT1_JOB: '模块7仓槽1待入仓工位',
  M7_SLOT2_JOB: '模块7仓槽2待入仓工位',
  M7_SLOT3_JOB: '模块7仓槽3待入仓工位',
  M7_SLOT4_JOB: '模块7仓槽4待入仓工位',
  M7_SLOT5_JOB: '模块7仓槽5待入仓工位',
};

const softPositionItems: { key: string; label: string }[] = [
  { key: 'isUseDocPose', label: '启用正反本检测工位' },
  { key: 'isUseReaderRead', label: '启用读芯片工位' },
  { key: 'isUseOcrPos', label: '启用OCR工位' },
  { key: 'isUseReaderWrite', label: '启用写芯片工位' },
  { key: 'isUseLaserLocation', label: '启用激光定位工位' },
  { key: 'isUseLaserPrint', label: '启用激光标刻工位' },
  { key: 'isUseUVLocation', label: '启用喷墨定位工位' },
  { key: 'isUseUVPrint', label: '启用喷墨打印工位' },
  { key: 'isUseQuality', label: '启用质检工位' },
  { key: 'isUseReaderVerify', label: '启用芯片校验工位' },
];

const fwJobSettings = computed(() => {
  const settings = data.value.fwJobPositionEnable?.settings || [];
  const slotSettings = settings.filter((s: any) => s.jobUid?.includes('M7_SLOT'));
  const otherSettings = settings.filter((s: any) => !s.jobUid?.includes('M7_SLOT'));
  // 把所有 M7_SLOT 的 places 合并并按序号重新编号
  const slotPlaces: any[] = [];
  for (const s of slotSettings) {
    for (const p of s.places || []) {
      slotPlaces.push({ ref: p, _no: slotPlaces.length + 1 });
    }
  }
  return { slotPlaces, otherSettings };
});

// --- API ---
async function load() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await setMoule.getPosition();
    data.value = res.respData || { fwModuleEnable: null, fwJobPositionEnable: null, positionConfig: null };
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
    await setMoule.setPosition(reqData);
    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

function hideKeyboard() {
  // 工位设置无键盘，占位供父组件统一调用
}

defineExpose({ load, save, hideKeyboard });

onMounted(() => {
  load();
});
</script>

<style scoped lang="less">
.bgDefend_item {
  margin-top: 4vh;
  &.no-first-bar {
    margin-top: 0;
  }
  .bgDefend_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
  .bgDefend_itemIn {
    display: flex;
    align-items: center;
    margin: 0.5vh 1vw;
    .bgDefend_itemIn_tit {
      text-wrap: nowrap;
    }
  }
}
.bg_listItem {
  background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
  padding: 1vh 0;
  margin: 0.5vh 0;
}
.inkjet-loc-tit {
  position: relative;
  padding-left: 1.5vw;
  font-size: 1.2vw;
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
::v-deep(.ant-switch-checked .ant-switch-inner) {
  background: #3662ec;
}
::v-deep(.ant-switch-inner) {
  background: #d8d8d8;
}
</style>
