<template>
  <SimpleKeyboard v-if="showKeyboard" keyboard-width="w-30vw" layout="num" :transform="transformValue" :input="formData[keyInput]" :max-length="4" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div class="bgItem text-1.1vw" @click="hideKeyboard">
    <div class="bgItem_tit">任务添加</div>
    <section class="bg_jianbian mb-2vh ml-2vw flex">
      <div class="mr-3vw flex items-center">
        <div class="flex items-center">
          <div class="ml-2vw pr-0.5vw">总人数:</div>
          <a-input v-model:value="formData.num" :class="keyInput === 'num' ? 'keyInput' : ''" class="w-9vw" placeholder="请输入1~3000" :maxlength="4" @click.stop="onInputFocus($event, 'num')" />
        </div>
        <div class="flex items-center">
          <div class="ml-2vw pr-0.5vw">加急程度:</div>
          <a-select v-model:value="formData.urgentType" class="w-7.5vw">
            <a-select-option v-for="option in urgencyOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
          </a-select>
        </div>
        <a-button type="link" class="btn_search ml-3vw" @click="() => (modal = { open: true, title: '任务添加', data: {} })">确认添加</a-button>
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
.bgItem {
  margin-top: 3vh;
  .bgItem_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
}
::v-deep(.ant-input),
::v-deep(.ant-select-selector) {
  font-size: 1.2vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 2px !important;
  height: 4vh !important;
  border-radius: 0;
  min-width: 7.5vw;
}
::v-deep(.ant-select-selection-item) {
  line-height: 3.5vh !important;
}
::v-deep(.ant-select-selection-item) {
  font-size: 1.2vw;
  color: #ffffff !important;
}
::v-deep(.ant-input::placeholder),
::v-deep(.ant-select-selection-placeholder) {
  color: #989ca1;
}
::v-deep(.anticon svg) {
  color: #e2e5eb;
}
</style>
