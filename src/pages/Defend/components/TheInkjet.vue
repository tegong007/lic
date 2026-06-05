<template>
  <SimpleKeyboard v-if="showKeyboard" keyboard-width="w-30vw" layout="floatNum" :transform="transformValue" :input="formData[keyInput]" :max-length="3" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div class="bgDefend_item">
    <template v-for="(inkjet, index) in props.data" :key="index">
      <div class="bgDefend_tit">{{ inkjet.printerName }}</div>
      <section v-if="inkjet.positionItems" class="bg_listItem">
        <div class="bgDefend_itemIn" style="display: block">
          <div v-for="(value, index2) in inkjet.positionItems" :key="index2" class="mb-1vh flex items-center">
            <div class="bgDefend_itemIn_tit w-20vw">{{ value.label }}:</div>
            <a-select v-if="value.option.length" v-model:value="formData[value.label + index]" class="w-20vw">
              <a-select-option v-for="option in value.option" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
            </a-select>
            <a-input v-else v-model:value="formData[value.label + index]" :class="keyInput === value.label ? 'keyInput' : ''" class="w-20vw" placeholder="请输入" :maxlength="3" @click.stop="onInputFocus($event, value.label + index)" />
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit w-19vw"></div>
            <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/moto-reposition', index, inkjet)">复位</a-button>
            <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/moto-move', index, inkjet, { axisType: Number(formData[`轴选择${index}`]), target: Number(formData[`目标位置(mm)${index}`]) })">移动</a-button>
          </div>
        </div>
      </section>
      <section class="bg_listItem">
        <div class="bgDefend_itemIn" style="display: block">
          <div v-for="(value, index2) in inkjet.cleanItems" :key="index2" class="mb-1vh flex items-center">
            <div class="bgDefend_itemIn_tit w-20vw">{{ value.label }}:</div>
            <a-select v-model:value="formData[value.label + index]" class="w-20vw">
              <a-select-option v-for="option in value.option" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
            </a-select>
          </div>
          <div class="bgDefend_itemIn">
            <div class="bgDefend_itemIn_tit w-19vw"></div>
            <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/clean-head', index, inkjet, { headID: Number(formData[`清洗组合${index}`]), intension: Number(formData[`清洗强度${index}`]) })">清洗</a-button>
          </div>
        </div>
      </section>
      <section v-if="inkjet.printItems && inkjet.printItems.length > 0" class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div v-for="(value, index2) in inkjet.printItems" :key="index2" class="flex items-center">
            <div class="bgDefend_itemIn_tit w-20vw">{{ value.label }}:</div>
            <a-select v-model:value="formData[value.label + index]" class="w-10vw">
              <a-select-option v-for="option in value.option" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
            </a-select>
          </div>
          <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/print', index, inkjet, { platform: Number(formData[`打印平台${index}`]), isUseData: false })">打印测试页</a-button>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { defendModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const props: any = defineProps({ data: Object, updateItem: Function, showKeyboard: Boolean, setShowKeyboard: Function, currentPage: String, currentModel: String });
const { notification } = App.useApp();

const formData: any = ref({ 轴选择0: '0', '目标位置(mm)0': '0', 清洗组合0: '0', 清洗强度0: '0', 打印平台0: '0' });
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);

async function transferApi(url: string, index: any, inkjetObj = { deviceIndex: null, dev: '' }, inputData: any = {}) {
  try {
    useAppStore().setSpinning(true);
    if (url === '/uvpdps/moto-move') {
      if (inputData.target <= 0 || Number.isNaN(inputData.target)) throw new Error('请输入目标位置');
    }
    const params = { transURI: url, paraIn: { objs: [{ deviceIndex: inkjetObj.deviceIndex, dev: inkjetObj.dev, ...inputData }] } };
    const data: any = await defendModule.getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
    } else {
      throw data.rslts[0].msg || '未知错误';
    }
  } catch (error) {
    if (props.updateItem) props.updateItem('readers', index, undefined);
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
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
    transformValue.value = [500, top - 460];
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
// 喷墨打印机不需要左侧小竖条
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
  min-width: 10vw;
}
::v-deep(.ant-select-selection-item) {
  line-height: 3vh !important;
  font-size: 2vw;
  color: #ffffff !important;
}
::v-deep(.ant-input::placeholder),
:v-deep(.ant-select-selection-placeholder) {
  color: #989ca1;
}
</style>
