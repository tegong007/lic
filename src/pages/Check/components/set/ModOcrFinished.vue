<template>
  <div class="bgDefend_item no-first-bar">
    <template v-for="(item, idx) in cur.ocrFinished || []" :key="idx">
      <div class="bgDefend_tit">
        {{ title }}<span v-if="(cur.ocrFinished || []).length > 1">{{ idx + 1 }}</span>
      </div>
      <section class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.isEnable" />
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="item.usExposureTime" :class="keyInput === `ocrFinished.${idx}.usExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrFinished.${idx}.usExposureTime`, 12)" />
              <span class="val-desc">us</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">红外曝光:</div>
              <a-input v-model:value="item.irUsExposureTime" :class="keyInput === `ocrFinished.${idx}.irUsExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrFinished.${idx}.irUsExposureTime`, 12)" />
              <span class="val-desc">us</span>
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">紫外曝光:</div>
              <a-input v-model:value="item.uvUsExposureTime" :class="keyInput === `ocrFinished.${idx}.uvUsExposureTime` ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, `ocrFinished.${idx}.uvUsExposureTime`, 12)" />
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
        </div>
      </section>

      <!-- 红外光源 -->
      <section v-if="item.irlDev" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">红外光源:</div>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.irlDev.isEnable" />
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口1:</div>
              <a-select v-model:value="item.irlDev.l1Port" style="width: 15vw" placeholder="COM1">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道1:</div>
              <a-input v-model:value="item.irlDev.l1ChannelNo" :class="keyInput === `ocrFinished.${idx}.irlDev.l1ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.irlDev.l1ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度1:</div>
              <a-input v-model:value="item.irlDev.l1Brightness" :class="keyInput === `ocrFinished.${idx}.irlDev.l1Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.irlDev.l1Brightness`, 3)" />
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口2:</div>
              <a-select v-model:value="item.irlDev.l2Port" style="width: 15vw" placeholder="COM2">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道2:</div>
              <a-input v-model:value="item.irlDev.l2ChannelNo" :class="keyInput === `ocrFinished.${idx}.irlDev.l2ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.irlDev.l2ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度2:</div>
              <a-input v-model:value="item.irlDev.l2Brightness" :class="keyInput === `ocrFinished.${idx}.irlDev.l2Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.irlDev.l2Brightness`, 3)" />
            </div>
          </div>
        </div>
      </section>

      <!-- 紫外光源 -->
      <section v-if="item.uvlDev" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">紫外光源:</div>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.uvlDev.isEnable" />
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口1:</div>
              <a-select v-model:value="item.uvlDev.l1Port" style="width: 15vw" placeholder="COM1">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道1:</div>
              <a-input v-model:value="item.uvlDev.l1ChannelNo" :class="keyInput === `ocrFinished.${idx}.uvlDev.l1ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.uvlDev.l1ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度1:</div>
              <a-input v-model:value="item.uvlDev.l1Brightness" :class="keyInput === `ocrFinished.${idx}.uvlDev.l1Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.uvlDev.l1Brightness`, 3)" />
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口2:</div>
              <a-select v-model:value="item.uvlDev.l2Port" style="width: 15vw" placeholder="COM2">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道2:</div>
              <a-input v-model:value="item.uvlDev.l2ChannelNo" :class="keyInput === `ocrFinished.${idx}.uvlDev.l2ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.uvlDev.l2ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度2:</div>
              <a-input v-model:value="item.uvlDev.l2Brightness" :class="keyInput === `ocrFinished.${idx}.uvlDev.l2Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.uvlDev.l2Brightness`, 3)" />
            </div>
          </div>
        </div>
      </section>

      <!-- 白光光源 -->
      <section v-if="item.wlDev" class="bg_listItem" style="display: block">
        <div style="display: flex; flex-direction: column; gap: 1vh">
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit inkjet-loc-tit">白光光源:</div>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit">是否启用:</div>
            <a-switch v-model:checked="item.wlDev.isEnable" />
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口1:</div>
              <a-select v-model:value="item.wlDev.l1Port" style="width: 15vw" placeholder="COM1">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道1:</div>
              <a-input v-model:value="item.wlDev.l1ChannelNo" :class="keyInput === `ocrFinished.${idx}.wlDev.l1ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.wlDev.l1ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度1:</div>
              <a-input v-model:value="item.wlDev.l1Brightness" :class="keyInput === `ocrFinished.${idx}.wlDev.l1Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.wlDev.l1Brightness`, 3)" />
            </div>
          </div>
          <div class="flex">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">端口2:</div>
              <a-select v-model:value="item.wlDev.l2Port" style="width: 15vw" placeholder="COM2">
                <a-select-option v-for="n in 15" :key="n" :value="`COM${n}`">COM{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">通道2:</div>
              <a-input v-model:value="item.wlDev.l2ChannelNo" :class="keyInput === `ocrFinished.${idx}.wlDev.l2ChannelNo` ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.wlDev.l2ChannelNo`, 3)" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">亮度2:</div>
              <a-input v-model:value="item.wlDev.l2Brightness" :class="keyInput === `ocrFinished.${idx}.wlDev.l2Brightness` ? 'keyInput' : ''" class="w-8vw" placeholder="0~999" :maxlength="3" @click.stop="onInputFocus($event, `ocrFinished.${idx}.wlDev.l2Brightness`, 3)" />
            </div>
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
const title = props.title ?? '成品检测';
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
