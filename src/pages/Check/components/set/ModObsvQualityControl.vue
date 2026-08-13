<template>
  <div class="bgDefend_item no-first-bar">
    <template v-for="(item, idx) in (cur.obsvQualityControl || [])" :key="idx">
      <div class="bgDefend_tit">{{ title }}<span v-if="(cur.obsvQualityControl || []).length > 1">{{ idx + 1 }}</span></div>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-wrap: wrap; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.isEnable" />
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">曝光时间:</div>
            <a-input v-model:value="item.usExposureTime" :class="keyInput === `obsvQualityControl.${idx}.usExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `obsvQualityControl.${idx}.usExposureTime`, 12)" />
            <span class="val-desc">us</span>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">质量要求:</div>
            <a-select v-model:value="item.qualityControl" style="width: 15vw">
              <a-select-option value="0">低质量要求</a-select-option>
              <a-select-option value="1">中质量要求</a-select-option>
              <a-select-option value="2">高质量要求</a-select-option>
            </a-select>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';

const props = defineProps<{ cur: any; title?: string }>();
const cur = toRef(props, 'cur');
const title = props.title ?? '检测质量控制';
const onInputFocus = inject<(e: any, key: string, limit?: number) => void>('onInputFocus')!;
const keyInput = inject<Ref<string>>('keyInput')!;
</script>

<style scoped lang="less">
.keyInput {
  border-color: #3662ec;
}
.val-desc {
  margin-left: 0.5vw;
  color: #989ca1;
  font-size: 1vw;
}
</style>
