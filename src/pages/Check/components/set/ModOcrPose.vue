<template>
  <div class="bgDefend_item no-first-bar">
    <template v-for="(item, idx) in (cur.ocrPose || [])" :key="idx">
      <div class="bgDefend_tit">证本姿态检测<span v-if="(cur.ocrPose || []).length > 1">{{ idx + 1 }}</span></div>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-wrap: wrap; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.isEnable" />
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">曝光时间:</div>
            <a-input v-model:value="item.usExposureTime" :class="keyInput === `ocrPose.${idx}.usExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrPose.${idx}.usExposureTime`, 12)" />
            <span class="val-desc">us</span>
          </div>
        </div>
      </section>
      <section v-if="item.targetRoi" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">搜索区域(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="item.targetRoi.x" :class="keyInput === `ocrPose.${idx}.targetRoi.x` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrPose.${idx}.targetRoi.x`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="item.targetRoi.y" :class="keyInput === `ocrPose.${idx}.targetRoi.y` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrPose.${idx}.targetRoi.y`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">宽:</div>
              <a-input v-model:value="item.targetRoi.width" :class="keyInput === `ocrPose.${idx}.targetRoi.width` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrPose.${idx}.targetRoi.width`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">高:</div>
              <a-input v-model:value="item.targetRoi.height" :class="keyInput === `ocrPose.${idx}.targetRoi.height` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrPose.${idx}.targetRoi.height`, 5)" />
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';

const props = defineProps<{ cur: any }>();
const cur = toRef(props, 'cur');
const onInputFocus = inject<(e: any, key: string, limit?: number) => void>('onInputFocus')!;
const keyInput = inject<Ref<string>>('keyInput')!;
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
</style>
