<template>
  <SimpleKeyboard v-if="showKeyboard" keyboard-width="w-30vw" layout="num" :transform="transformValue" :input="formData[keyInput]" :max-length="4" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div class="bgDefend_item" @click="hideKeyboard">
    <div class="bgDefend_tit">任务添加</div>
    <section class="bg_listItem" style="display: block">
      <div class="bgDefend_itemIn">
        <div class="bgDefend_itemIn_tit w-9.5vw">总人数:</div>
        <a-input v-model:value="formData.num" :class="keyInput === 'num' ? 'keyInput' : ''" class="w-25vw bg-transparent" placeholder="请输入1~3000" :maxlength="4" @click.stop="onInputFocus($event, 'num')" />
      </div>
      <div class="bgDefend_itemIn my-1vh">
        <div class="bgDefend_itemIn_tit">加急程度:</div>
        <a-select v-model:value="formData.urgentType" class="w-25vw">
          <a-select-option v-for="option in urgencyOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
        </a-select>
      </div>
      <div class="bgDefend_itemIn">
        <div class="bgDefend_itemIn_tit w-10vw"></div>
        <a-button type="link" class="btn_search" @click="() => (modal = { open: true, title: '任务添加', data: {} })">确认添加</a-button>
      </div>
    </section>
  </div>
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :data="modal.data" :handle-ok="controlMachine" :handle-cancel="() => (modal = { open: false, title: '', data: {} })" />
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { defendModule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import { urgencyOptions } from '@/plugins/option';
import { useAppStore } from '@/store/index';

defineProps({ data: Object, updateItem: Function, showKeyboard: Boolean, setShowKeyboard: Function, currentPage: String, currentModel: String });

const { notification } = App.useApp();

const formData: any = ref({ num: '1', urgentType: 0 });
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const modal = ref({ open: false, title: '', data: {} });

async function controlMachine() {
  if (modal.value.title === '任务添加') {
    try {
      useAppStore().setSpinning(true);
      if (!/^(?:[1-9]\d{0,2}|3000|[12]\d{3})$/.test(formData.value.num)) throw new Error('任务范围为1~3000');
      const data: any = await defendModule.addTask({ num: Number(formData.value.num), urgentType: formData.value.urgentType });
      if (data.respData) {
        modal.value = { open: true, title: '任务添加成功', data: data.respData };
        notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
      }
    } catch (error) {
      notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
    } finally {
      useAppStore().setSpinning(false);
    }
  } else {
    modal.value = { open: false, title: '', data: {} };
  }
}
function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function onInputFocus(event: any, text: string) {
  if (keyInput.value !== text) {
    showKeyboard.value = true;
    keyInput.value = text;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [0, top - 150];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  formData.value[keyInput.value] = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}
</script>

<style scoped lang="less">
// 任务添加不需要左侧小竖条
.bgDefend_itemIn_tit::before {
  display: none;
}
::v-deep(.ant-input),
::v-deep(.ant-select-selector) {
  font-size: 1.8vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 0px !important;
  background-color: #ffffff15 !important;
  height: 2.5vh !important;
  border-radius: 0;
  min-width: 12vw;
}
::v-deep(.ant-input::placeholder),
::v-deep(.ant-select-selection-placeholder) {
  color: #989ca1;
}
::v-deep(.ant-select-selection-item) {
  line-height: 2.5vh !important;
  font-size: 1.5vw;
  color: #ffffff !important;
}
::v-deep(.ant-select-arrow) {
  right: 0.5vw !important;
}
</style>
