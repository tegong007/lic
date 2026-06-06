<template>
  <div>
    <SimpleKeyboard
      v-if="showKeyboard"
      :transform="transformValue"
      :input="getKeyboardValue()"
      :max-length="limitInput"
      @on-change="onChangeKeyboard"
      @closekeyboard="hideKeyboard"
    />

    <div class="bgDefend_item no-first-bar">
      <section class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">下发数据立刻启动:</div>
          <a-switch v-model:checked="data.systemConfig.startAfterAddTask" />
        </div>
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">启用提前配号:</div>
          <a-switch v-model:checked="data.docTypeConfig.isPreDocID" />
        </div>
      </section>

      <section class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">初始化时清洗喷头:</div>
          <a-switch v-model:checked="data.systemConfig.isCleanUvWhenInit" />
        </div>
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">历史记录保留时间:</div>
          <a-input
            v-model:value="data.systemConfig.historyAliveDays"
            :class="keyInput === 'historyAliveDays' ? 'keyInput' : ''"
            class="w-14vw"
            placeholder="7~90天"
            :maxlength="2"
            @click.stop="onInputFocus($event, 'historyAliveDays', 2)"
          />
          <div class="ml-1vw" style="color: #989ca1; font-size: 1.6vw">天</div>
        </div>
      </section>

      <section class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">TMS ip地址:</div>
          <a-input
            v-model:value="data.systemConfig.ipTMS"
            :class="keyInput === 'ipTMS' ? 'keyInput' : ''"
            class="w-20vw"
            placeholder="请输入"
            :maxlength="15"
            @click.stop="onInputFocus($event, 'ipTMS', 15)"
          />
        </div>
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">本机IP:</div>
          <a-input
            v-model:value="data.systemConfig.ipLocal"
            :class="keyInput === 'ipLocal' ? 'keyInput' : ''"
            class="w-20vw"
            placeholder="请输入"
            :maxlength="15"
            @click.stop="onInputFocus($event, 'ipLocal', 15)"
          />
        </div>
      </section>

      <section class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">支持护照类型:</div>
          <div class="flex gap-2vw">
            <div v-if="data.docTypeConfig.isSupportNormal"><span class="passport-dot" />普通护照</div>
            <div v-if="data.docTypeConfig.isSupportPublic"><span class="passport-dot" />公务护照</div>
            <div v-if="data.docTypeConfig.isSupportDiplomatic"><span class="passport-dot" />外交护照</div>
            <div v-if="data.docTypeConfig.isSupportNormalPublic"><span class="passport-dot" />因公普通护照</div>
            <div v-if="data.docTypeConfig.isSupportConsular"><span class="passport-dot" />领事护照</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { setMoule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();

const data = ref<any>({
  systemConfig: {
    startAfterAddTask: false,
    isCleanUvWhenInit: false,
    historyAliveDays: '',
    ipTMS: '',
    ipLocal: '',
  },
  docTypeConfig: {
    isPreDocID: false,
    isSupportNormal: false,
    isSupportPublic: false,
    isSupportDiplomatic: false,
    isSupportNormalPublic: false,
    isSupportConsular: false,
  },
});

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
  if (!keyInput.value) return '';
  return String(data.value.systemConfig[keyInput.value] ?? '');
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
  if (keyInput.value && data.value.systemConfig) {
    data.value.systemConfig[keyInput.value] = input;
  }
}

// --- API ---
async function load() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await setMoule.getGeneral();
    const respData = res.respData || { systemConfig: {}, docTypeConfig: {} };
    data.value = respData;
    if (data.value.systemConfig) {
      const sc = data.value.systemConfig;
      if (sc.ipTMS != null) sc.ipTMS = String(sc.ipTMS);
      if (sc.ipLocal != null) sc.ipLocal = String(sc.ipLocal);
      if (sc.historyAliveDays != null) sc.historyAliveDays = String(sc.historyAliveDays);
    }
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
    await setMoule.setGeneral(reqData);
    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

defineExpose({ load, save });

onMounted(() => {
  load();
});
</script>

<style scoped lang="less">
.passport-dot {
  display: inline-block;
  width: 0.5vw;
  height: 0.5vw;
  background-color: #3662ec;
  border-radius: 50%;
  margin: 0 0.3vw;
  vertical-align: middle;
}
.keyInput {
  border-color: #3662ec;
}
</style>
