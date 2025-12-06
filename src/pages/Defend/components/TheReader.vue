<template>
  <div class="bgItem text-1.1vw">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="40" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="bgItem_tit">读写器</div>
    <section v-for="(reader, index) in props.data" :key="index" class="bg_jianbian mb-1vh ml-2vw flex">
      <div class="mr-3vw flex items-center">
        <div class="ml-2vw pr-0.5vw">{{ reader.readerName }}:</div>
        <a-input v-model:value="formData[reader.deviceIndex]" :class="keyInput === reader.deviceIndex ? 'keyInput' : ''" class="w-30vw" placeholder="请输入" :maxlength="40" @click="onInputFocus($event, reader.deviceIndex)" />
        <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/ips-r/read-test-data', index, reader)">读数据</a-button>
        <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/ips-r/read-card-uid', index, reader)">读卡UID</a-button>
        <a-button type="link" class="btn_search ml-1vw" @click="transferApi('/ips-r/write-test-data', index, reader, formData[reader.deviceIndex])">写数据</a-button>
      </div>
    </section>
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

async function transferApi(url: string, index: any, readerObj = { deviceIndex: null, dev: '' }, inputData = '') {
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: url, paraIn: { objs: [{ deviceIndex: readerObj.deviceIndex, dev: readerObj.dev, data: inputData }] } };
    const data: any = await defendModule.getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      if (url === '/ips-r/read-test-data' && readerObj.deviceIndex) formData[readerObj.deviceIndex] = data.rslts[0].data;
      else if (url === '/ips-r/read-test-uid' && readerObj.deviceIndex) formData[readerObj.deviceIndex] = data.rslts[0].cardUid;
      else notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
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
  transformValue.value = [0, top - 180];
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
::v-deep(.ant-input) {
  font-size: 1.2vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 2px !important;
  height: 4vh !important;
  border-radius: 0;
  min-width: 7.5vw;
}
::v-deep(.ant-input::placeholder) {
  color: #989ca1;
}
</style>
