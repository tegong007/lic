<template>
  <div class="bgDefend_item no-first-bar">
    <template v-for="d in displayList" :key="d.idx">
      <div class="bgDefend_tit">
        喷墨前检测<span v-if="displayList.length > 1">{{ d.no + 1 }}（{{ props.range && props.range[0] >= 4 ? '低' : '高' }}）</span>
      </div>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-wrap: wrap; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="d.item.isEnable" />
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">曝光时间:</div>
            <a-input v-model:value="d.item.usExposureTime" :class="keyInput === `ocrBeforeUv.${d.idx}.usExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.usExposureTime`, 12)" />
            <span class="val-desc">us</span>
          </div>
          <!-- <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">平台:</div>
            <a-select v-model:value="d.item.platform" style="width: 12vw">
              <a-select-option value="0">平台0</a-select-option>
              <a-select-option value="1">平台1</a-select-option>
            </a-select>
          </div> -->
        </div>
      </section>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">激光人像预设位置(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="d.item.stdPortraitX" :class="keyInput === `ocrBeforeUv.${d.idx}.stdPortraitX` ? 'keyInput' : ''" class="w-9vw" placeholder="0~90000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.stdPortraitX`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="d.item.stdPortraitY" :class="keyInput === `ocrBeforeUv.${d.idx}.stdPortraitY` ? 'keyInput' : ''" class="w-9vw" placeholder="0~90000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.stdPortraitY`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">旋转角度:</div>
              <a-input v-model:value="d.item.rotationCorrectionAngle" :class="keyInput === `ocrBeforeUv.${d.idx}.rotationCorrectionAngle` ? 'keyInput' : ''" class="w-9vw" placeholder="-5000~5000" :maxlength="6" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.rotationCorrectionAngle`, 6)" />
            </div>
          </div>
        </div>
      </section>
      <section v-if="d.item.markTopLeftRegion" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记左上角(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="d.item.markTopLeftRegion.x" :class="keyInput === `ocrBeforeUv.${d.idx}.markTopLeftRegion.x` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markTopLeftRegion.x`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="d.item.markTopLeftRegion.y" :class="keyInput === `ocrBeforeUv.${d.idx}.markTopLeftRegion.y` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markTopLeftRegion.y`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">宽:</div>
              <a-input v-model:value="d.item.markTopLeftRegion.width" :class="keyInput === `ocrBeforeUv.${d.idx}.markTopLeftRegion.width` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markTopLeftRegion.width`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">高:</div>
              <a-input v-model:value="d.item.markTopLeftRegion.height" :class="keyInput === `ocrBeforeUv.${d.idx}.markTopLeftRegion.height` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markTopLeftRegion.height`, 5)" />
            </div>
          </div>
        </div>
      </section>
      <section v-if="d.item.markBottomRightRegion" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记右下角(像素):</div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">X:</div>
              <a-input v-model:value="d.item.markBottomRightRegion.x" :class="keyInput === `ocrBeforeUv.${d.idx}.markBottomRightRegion.x` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markBottomRightRegion.x`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">Y:</div>
              <a-input v-model:value="d.item.markBottomRightRegion.y" :class="keyInput === `ocrBeforeUv.${d.idx}.markBottomRightRegion.y` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markBottomRightRegion.y`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">宽:</div>
              <a-input v-model:value="d.item.markBottomRightRegion.width" :class="keyInput === `ocrBeforeUv.${d.idx}.markBottomRightRegion.width` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markBottomRightRegion.width`, 5)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit short-label">高:</div>
              <a-input v-model:value="d.item.markBottomRightRegion.height" :class="keyInput === `ocrBeforeUv.${d.idx}.markBottomRightRegion.height` ? 'keyInput' : ''" class="w-9vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, `ocrBeforeUv.${d.idx}.markBottomRightRegion.height`, 5)" />
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';

const props = defineProps<{ cur: any; range?: [number, number] }>();
const cur = toRef(props, 'cur');
const onInputFocus = inject<(e: any, key: string, limit?: number) => void>('onInputFocus')!;
const keyInput = inject<Ref<string>>('keyInput')!;

// 按 range 切片（前四个 / 后四个），保留原数组元素引用与真实索引
const displayList = computed(() => {
  const all: any[] = cur.value.ocrBeforeUv || [];
  if (!props.range) return all.map((item, idx) => ({ item, idx, no: idx }));
  const [start, end] = props.range;
  const list: { item: any; idx: number; no: number }[] = [];
  let no = 0;
  all.forEach((item, idx) => {
    if (idx >= start && idx < end) list.push({ item, idx, no: no++ });
  });
  return list;
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
</style>
