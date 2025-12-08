<template>
  <SimpleKeyboard v-if="showKeyboard" keyboard-width="w-30vw" layout="floatNum" :transform="transformValue" :input="formData[keyInput]" :max-length="3" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div class="bgItem text-1.1vw">
    <template v-for="(inkjet, index) in props.data" :key="index">
      <div class="bgItem_tit">{{ inkjet.printerName }}</div>
      <section v-if="inkjet.positionItems" class="bg_jianbian mb-2vh ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div v-for="(value, index2) in inkjet.positionItems" :key="index2" class="flex items-center">
            <div class="ml-2vw w-8vw">{{ value.label }}:</div>
            <a-select v-if="value.option.length" v-model:value="formData[value.label + index]" class="w-10vw">
              <a-select-option v-for="option in value.option" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
            </a-select>
            <a-input v-else v-model:value="formData[value.label + index]" :class="keyInput === value.label ? 'keyInput' : ''" class="w-10vw" placeholder="请输入" :maxlength="3" @click.stop="onInputFocus($event, value.label + index)" />
          </div>
          <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/moto-reposition', index, inkjet)">复位</a-button>
          <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/moto-move', index, inkjet, { axisType: Number(formData[`轴选择${index}`]), target: Number(formData[`目标位置(mm)${index}`]) })">移动</a-button>
        </div>
      </section>
      <section class="bg_jianbian mb-2vh ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div v-for="(value, index2) in inkjet.cleanItems" :key="index2" class="flex items-center">
            <div class="ml-2vw w-8vw">{{ value.label }}:</div>
            <a-select v-model:value="formData[value.label + index]" class="w-10vw">
              <a-select-option v-for="option in value.option" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
            </a-select>
          </div>
          <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/uvpdps/clean-head', index, inkjet, { headID: Number(formData[`清洗组合${index}`]), intension: Number(formData[`清洗强度${index}`]) })">清洗</a-button>
        </div>
      </section>
      <section class="bg_jianbian mb-2vh ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div v-for="(value, index2) in inkjet.printItems" :key="index2" class="flex items-center">
            <div class="ml-2vw w-8vw">{{ value.label }}:</div>
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

const props = defineProps({ data: Object, updateItem: Function, showKeyboard: Boolean, setShowKeyboard: Function, currentPage: String, currentModel: String });
const { notification } = App.useApp();

const formData: any = ref({});
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);

async function transferApi(url: string, index: any, inkjetObj = { deviceIndex: null, dev: '' }, inputData = {}) {
  try {
    useAppStore().setSpinning(true);
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
  showKeyboard.value = true;
  keyInput.value = text;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  transformValue.value = [500, top - 460];
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
