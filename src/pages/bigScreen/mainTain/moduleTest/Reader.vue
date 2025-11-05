<template>
  <div class="box-border w-full">
    <div class="bg-[#fff]/[0.4] p-y-5px p-l-0.5em">
      <span>{{ t('moduleTest.Reader.6bzfx4gmq980') }}</span>
    </div>
    <section class="box-border flex flex-wrap gap-20">
      <div
        v-for="(reader, index) in props.data"
        :key="index"
        class="box-border p-y-1em p-l-1.5em p-r-0.5em"
      >
        <div class="text-[18px]">
          {{ reader.readerName }}：
        </div>
        <br>
        <a-textarea
          v-model:value="reader.value"
          size="large"
          :placeholder="t('moduleTest.Reader.6bzfx4gmqts0')"
          allow-clear
          :maxlength="40"
          :auto-size="{ minRows: 2, maxRows: 3 }"
          @input="validateInput($event, index)"
          @touchstart="onInputFocus($event, index)"
        />
        <div class="mt10 box-border flex justify-between gap-15">
          <a-button
            type="link"
            class="btn hover:text-[#89f7ff]!"
            @click="transfer('/ips-r/read-test-data', index, reader)"
          >
            {{ t('moduleTest.Reader.6bzfx4gmqwg0') }}
          </a-button>
          <a-button
            type="link"
            class="btn hover:text-[#89f7ff]!"
            @click="transfer('/ips-r/read-card-uid', index, reader)"
          >
            {{ t('moduleTest.Reader.6bzfx4gmqys0') }}
          </a-button>
          <a-button
            type="link"
            class="btn hover:text-[#89f7ff]!"
            @click="
              transfer('/ips-r/write-test-data', index, reader, reader.value)
            "
          >
            {{ t('moduleTest.Reader.6bzfx4gmr0w0') }}
          </a-button>
        </div>
      </div>
    </section>
    <div v-if="props.currentPage === 'readers'" v-show="props.showKeyboard">
      <SimpleKeyboard
        ref="simpleKeyboard"
        :transform="transformValue"
        :input="cursorPosition?.target.value"
        :max-length="40"
        @on-change="onChangeKeyboard"
        @closekeyboard="props.setShowKeyboard(false, 'readers')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { getApiTransfer } from '@/apis/webApi';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { useAppStore } from '@/store/index';

const props = defineProps({
  data: Object,
  updateItem: Function,
  showKeyboard: Boolean,
  setShowKeyboard: Function,
  currentPage: String,
  currentModel: String,
});

const { t } = useI18n();

const transformValue = ref([0, 0]);
const { notification } = App.useApp();
async function transfer(url, index, readerObj, inputData) {
  try {
    useAppStore().setSpinning(true);
    const params = {
      transURI: url,
      paraIn: {
        objs: [
          {
            deviceIndex: readerObj.deviceIndex,
            dev: readerObj.dev,
            data: inputData,
          },
        ],
      },
    };
    const data = await getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      props.updateItem(
        'readers',
        index,
        url === '/ips-r/read-test-data'
          ? data.rslts[0].data
          : data.rslts[0].cardUid,
      );
      if (url === '/ips-r/write-test-data') {
        notification.success({
          message: t('moduleTest.Reader.6bzfx4gmr3k0'),
          description: t('moduleTest.Reader.6bzfx4gmr5c0'),
          placement: 'bottomRight',
          class: 'notification-custom-class',
        });
      }
    }
    else {
      notification.error({
        message: t('moduleTest.Reader.6bzfx4gmr7g0'),
        description: data.rslts[0].msg,
        placement: 'bottomRight',
        class: 'notification-custom-class',
      });
      props.updateItem('readers', index, undefined);
    }
  }
  catch (error) {
    notification.error({
      message: t('moduleTest.Reader.6bzfx4gmr7g0'),
      description: error,
      class: 'notification-custom-class',
      placement: 'bottomRight',
    });
    props.updateItem('readers', index, undefined);
  }
  finally {
    useAppStore().setSpinning(false);
  }
}

const changeIpt = ref(''); // 选择了哪个输入框
const simpleKeyboard = ref(null);
const cursorPosition = ref(null);
function onInputFocus(event, res) {
  props.setShowKeyboard(true, 'readers');
  changeIpt.value = res;
  cursorPosition.value = event;
  // 获取组件的位置信息;
  const rect = event.target.getBoundingClientRect();

  // 获取距离上方和左方的位置
  const top = rect.bottom + rect.height + window.scrollY; // 距离页面顶部的位置
  // const left = rect.left + window.scrollX; // 距离页面左侧的位置
  if (props.currentModel === '1') {
    transformValue.value = [0, top - 1300];
  }

  if (props.currentModel === '3') {
    transformValue.value = [0, 0];
  }
  // console.log('距离页面顶部的位置:', top);
  // console.log('距离页面左侧的位置:', left);
}
// 给输入框赋值
function onChangeKeyboard(input, keyboard) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null)
    setInputCaretPosition(cursorPosition.value.target, caretPosition);
  cursorPosition.value.target.value = input;
  props.updateItem('readers', changeIpt.value, input);
  // props.updateItem('uvPrinters', changeIpt.value, input);
}
function setInputCaretPosition(elem, pos) {
  setTimeout(() => {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  });
}
</script>

<style scoped>
.btn {
  border-radius: 6px;
  opacity: 1;
  background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  padding: 6px 20px;
  color: white;
  height: 40px;
}
::v-deep(.ant-select-selection-item) {
  font-size: 16px;
}
</style>
