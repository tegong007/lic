<template>
  <a-modal
    :get-container="false"
    :open="props.open"
    wrap-class-name="test"
    :closable="false"
    centered
    force-render
    @ok="props.handleOk()"
  >
    <div
      class="delete-modal box-border h-[25em] p-t-50px"
      :style="{ height: `${props.height}px` }"
    >
      <div class="h-full flex flex-col items-center justify-start">
        <img
          v-if="props.warnIcon"
          src="@/assets/image/warning.png"
          class="h-[10em] w-[10em]"
          alt=""
        >
        <div class="w-80% text-center text-[30px] color-[#627384] font-bold">
          &nbsp;&nbsp; {{ props.title }}
        </div>
        <div
          v-if="
            props.title === '确认开始进本？' || props.title === '确认加本？'
          "
          class="mt50 flex items-center justify-center gap-10"
        >
          <!-- <span class="text-[30px] color-[#627384] font-bold">可进本数</span> -->
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            class=""
            size="large"
          >
            <a-form-item label="进本数" name="num">
              <a-input
                v-model:value="formState.num"
                :placeholder="`（1-${oldData}）`"
                :maxlength="4"
                @touchstart="onInputFocus($event, 'num')"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <template #footer>
      <a-flex justify="center" align="center" class="pb-40px">
        <div
          class="cancelBtn h-100px w-200px transition-transform duration-300 hover:scale-105"
          @click="handleCancel"
        />
        <div
          class="okBtn h-100px w-200px transition-transform duration-300 hover:scale-105"
          @click="onSubmit"
        />
      </a-flex>
    </template>
    <div
      v-if="props.title === '确认开始进本？' || props.title === '确认加本？'"
      v-show="showKeyboard"
    >
      <SimpleKeyboard
        ref="simpleKeyboard"
        keyboard-width="w30%"
        layout="num"
        :max-length="10"
        :transform="[300, -200]"
        :input="formState[changeIpt]"
        @on-change="onChangeKeyboard"
        @closekeyboard="closekeyboard"
      />
    </div>
  </a-modal>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { homeModule } from '@/apis/proApi';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';

const props = defineProps({
  open: Boolean,
  handleOk: Function,
  title: String,
  warnIcon: Boolean,
  handleCancel: Function,
  height: String,
});
interface FormState {
  num: string;
  // timeRange: RangeValue;
}
const formRef = ref();
const oldData = ref(0);
function handleCancel() {
  closekeyboard();
  formRef.value && formRef.value.resetFields();
  props.handleCancel();
}
async function validatePass(_rule, value) {
  const v = String(value).trim();
  if (v === '' || v === '0' || v === undefined) {
    return Promise.reject('请输入正整数');
  }
  if (Number(v) > oldData.value) {
    return Promise.reject(`最大可进本数${oldData.value}`);
  }
  else if (!/^[1-9]\d*$/.test(v)) {
    return Promise.reject('请输入正整数');
  }
  else {
    return Promise.resolve();
  }
}
const rules = {
  num: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
};
const formState: UnwrapRef<FormState> = reactive({
  num: '1',
});

const showKeyboard = ref(false); // 键盘默认隐藏
const simpleKeyboard = ref(null);
const changeIpt = ref(''); // 选择了哪个输入框
const cursorPosition = ref('');
function onInputFocus(event, res) {
  showKeyboard.value = true;
  changeIpt.value = res;
  cursorPosition.value = event.target;
}
// 给输入框赋值
function onChangeKeyboard(input, keyboard) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null)
    setInputCaretPosition(cursorPosition.value, caretPosition);
  const Newvalue = input;
  console.log('🚀 ~ onChangeKeyboard ~ input:', typeof input);

  // 更新输入框的值
  formState[changeIpt.value] = Newvalue;
}
function setInputCaretPosition(elem, pos) {
  setTimeout(() => {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  });
}
function closekeyboard() {
  showKeyboard.value = false;
  // num.value = '1';
}

async function getDocNum() {
  try {
    const { respData } = await homeModule.getDocNumProduce();
    oldData.value = respData.docNum;
    // formState.num = `${respData.docNum}`;
    formState.num = `${respData.docNum}`;
  }
  catch (error) {
    error;
  }
}
// 验证通过，告诉爸爸
function onSubmit() {
  if (
    props.title === '确认暂停设备？'
    || props.title === '确认暂停进本？'
    || props.title === '确认启动设备？'
    || props.title === '确认继续进本？'
  ) {
    closekeyboard();
    props.handleOk();
    return;
  }
  // title
  formRef.value
    .validate()
    .then(() => {
      props.handleOk(formState.num);
    })
    .catch((error) => {
      console.log('error', error);
    })
    .finally(() => {
      closekeyboard();
      // formRef.value.resetFields();
    });
}
watch(
  () => props.open,
  (newInput) => {
    if (
      (newInput && props.title === '确认开始进本？')
      || props.title === '确认加本？'
    ) {
      getDocNum();
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="less">
::v-deep(.ant-modal-content) {
  padding: 0;
  border-radius: 1em;
  background-image: url('@/assets/image/bigScreen/modal-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
::v-deep(.ant-modal-mask) {
  background: rgba(0, 0, 0, 0.9);
}
::v-deep(.ant-modal-mask) {
  background: rgba(0, 0, 0, 0.8);
}
::v-deep.scoll-bar {
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  // border-left: 3px solid #7ff3fd;
}
::-webkit-scrollbar-thumb {
  // background-color: #ffffff38;
  background-color: #ffffff69;
  border-radius: 5px;
}
.cancelBtn {
  background-image: url('@/assets/image/bigScreen/btn/cancel.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
.okBtn {
  background-image: url('@/assets/image/bigScreen/btn/ok.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
</style>
