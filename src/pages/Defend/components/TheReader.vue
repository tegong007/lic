<template>
  <div class="bgDefend_item">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="40" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="bgDefend_tit">读写器</div>
    <section v-for="(reader, index) in props.data" :key="index">
      <div class="bg_listItem" style="display: block">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">{{ reader.readerName }}:</div>
          <a-input v-model:value="formData[reader.deviceIndex]" :class="keyInput === reader.deviceIndex ? 'keyInput' : ''" placeholder="请输入" :maxlength="40" @click="onInputFocus($event, reader.deviceIndex)" class="flex-1" />
          <div class="bgDefend_itemIn_tit">UID:</div>
          <a-input v-model:value="reader.uid" disabled class="flex-1" />
        </div>
        <div class="bgDefend_itemIn ml-12vw mt-1vh">
          <a-button type="link" class="btn_search ml-2vw" @click="transferApi('/ips-r/read-test-data', index, reader)">读数据</a-button>
          <a-button type="link" class="btn_search ml-2vw" @click="transferApi('/ips-r/read-card-uid', index, reader)">读卡UID</a-button>
          <a-button type="link" class="btn_search ml-2vw" @click="transferApi('/ips-r/write-test-data', index, reader, formData[reader.deviceIndex])">写数据</a-button>
        </div>
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
      if (url === '/ips-r/read-test-data' && readerObj.deviceIndex) formData.value[readerObj.deviceIndex] = data.rslts[0].data;
      else if (url === '/ips-r/read-card-uid' && readerObj.deviceIndex) formData.value[readerObj.deviceIndex] = data.rslts[0].cardUid;
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
    transformValue.value = [0, top - 180];
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
::v-deep(.ant-input) {
  font-size: 1.1vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 0px !important;
  background-color: #ffffff15 !important;
  height: 5vh !important;
  border-radius: 0;
  min-width: 10vw;
}
::v-deep(.ant-input::placeholder) {
  color: #989ca1;
}
// 隔行变色
::v-deep(section:nth-of-type(odd) > .bg_listItem) {
  background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%);
}
::v-deep(section:nth-of-type(even) > .bg_listItem) {
  background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%);
}
</style>
