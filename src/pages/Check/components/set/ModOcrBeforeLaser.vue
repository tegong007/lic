<template>
  <div class="bgDefend_item no-first-bar">
    <template v-for="(item, idx) in (cur.ocrBeforeLaser || [])" :key="idx">
      <div class="bgDefend_tit">激光前检测<span v-if="(cur.ocrBeforeLaser || []).length > 1">{{ idx + 1 }}</span></div>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-wrap: wrap; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.isEnable" />
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">曝光时间:</div>
            <a-input v-model:value="item.usExposureTime" :class="keyInput === `ocrBeforeLaser.${idx}.usExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.usExposureTime`, 12)" />
            <span class="val-desc">us</span>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">旋转角度:</div>
            <a-input v-model:value="item.rotationCorrectionAngle" :class="keyInput === `ocrBeforeLaser.${idx}.rotationCorrectionAngle` ? 'keyInput' : ''" class="w-9vw" placeholder="-5000~5000" :maxlength="6" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.rotationCorrectionAngle`, 6)" />
          </div>
        </div>
      </section>
      <section v-if="item.markTopLeftRegion" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记左上角(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="item.markTopLeftRegion.x" :class="keyInput === `ocrBeforeLaser.${idx}.markTopLeftRegion.x` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markTopLeftRegion.x`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="item.markTopLeftRegion.y" :class="keyInput === `ocrBeforeLaser.${idx}.markTopLeftRegion.y` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markTopLeftRegion.y`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">宽:</div>
              <a-input v-model:value="item.markTopLeftRegion.width" :class="keyInput === `ocrBeforeLaser.${idx}.markTopLeftRegion.width` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markTopLeftRegion.width`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">高:</div>
              <a-input v-model:value="item.markTopLeftRegion.height" :class="keyInput === `ocrBeforeLaser.${idx}.markTopLeftRegion.height` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markTopLeftRegion.height`, 5)" />
            </div>
          </div>
        </div>
      </section>
      <section v-if="item.markBottomRightRegion" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记右下角(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="item.markBottomRightRegion.x" :class="keyInput === `ocrBeforeLaser.${idx}.markBottomRightRegion.x` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markBottomRightRegion.x`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="item.markBottomRightRegion.y" :class="keyInput === `ocrBeforeLaser.${idx}.markBottomRightRegion.y` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markBottomRightRegion.y`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">宽:</div>
              <a-input v-model:value="item.markBottomRightRegion.width" :class="keyInput === `ocrBeforeLaser.${idx}.markBottomRightRegion.width` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markBottomRightRegion.width`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">高:</div>
              <a-input v-model:value="item.markBottomRightRegion.height" :class="keyInput === `ocrBeforeLaser.${idx}.markBottomRightRegion.height` ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeLaser.${idx}.markBottomRightRegion.height`, 5)" />
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
