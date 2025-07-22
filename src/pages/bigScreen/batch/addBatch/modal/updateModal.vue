<template>
  <a-modal
    :get-container="false"
    :open="props.open"
    wrap-class-name="test"
    :closable="false"
    centered
    force-render
    destroy-on-close
    @ok="props.handleOk"
  >
    <div class="delete-modal box-border h-[25em] p-t-50px">
      <div class="h-full flex flex-col items-center justify-start">
        <img
          v-if="props.warnIcon"
          src="@/assets/image/warning.png"
          class="mb-[1em] h-[10em] w-[10em]"
          alt=""
        >
        <span class="text-[30px] color-[#627384] font-bold">
          &nbsp;&nbsp; {{ props.title }}</span>
        <div class="scoll-bar mt20px h-full w-80% overflow-y-auto bg-white">
          <a-form
            ref="formRef"
            layout="vertical"
            :model="formState"
            :rules="rules"
            class="w-full rounded-[8px] bg-[#ffffff34] p-x-10 p-y-20"
          >
            <a-row :gutter="[20, 0]" class="w-full" justify="space-evenly">
              <a-col :span="12">
                <a-form-item label="人数" name="num">
                  <a-input
                    v-model:value="formState.num"
                    placeholder="请输入数字（1-2000）"
                    class="w-full"
                    type="text"
                    @click="onInputFocus($event, 'num')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="加急类型" name="urgentType">
                  <a-select
                    v-model:value="formState.urgentType"
                    placeholder="请选择加急类型"
                    :disabled="formState.dispatchUnit === '-------'"
                  >
                    <a-select-option
                      v-for="option in urgencyOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
    <template #footer>
      <a-flex justify="center" align="center" class="pb-40px">
        <div
          class="cancelBtn h-110px w-220px transition-transform duration-300 hover:scale-105"
          @click="handleCancel"
        />
        <div
          class="okBtn h-110px w-220px transition-transform duration-300 hover:scale-105"
          @click="onSubmit"
        />
      </a-flex>
    </template>
    <div v-show="showKeyboard">
      <SimpleKeyboard
        ref="simpleKeyboard"
        keyboard-width="w30%"
        :transform="[0, -150]"
        layout="num"
        :max-length="4"
        :input="formState[changeIpt]"
        @on-change="onChangeKeyboard"
        @closekeyboard="closekeyboard"
      />
    </div>
  </a-modal>

  <!-- </div> -->
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { defineExpose, defineProps } from 'vue';
import { urgencyOptions } from '../../option.js';

const props = defineProps({
  open: Boolean,
  handleOk: Function,
  title: String,
  warnIcon: Boolean,
  handleCancel: Function,
  handleUpdate: Function,
});
const formRef = ref();
interface FormState {
  num: string;
  dispatchUnit: string;
  dataSource: string;
  isTeam: string;
  urgentType: string;
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
  urgentType: 0,
});
async function validatePass(_rule, value) {
  // 统一转成字符串，避免类型差异
  const v = String(value).trim();
  if (v === '' || v === '0' || v === undefined) {
    return Promise.reject('请输入正整数');
  }
  else if (!/^[1-9]\d*$/.test(v)) {
    return Promise.reject('请输入正整数');
  }
  if (Number(v) > 2000) {
    return Promise.reject(`最大可添加人数2000`);
  }
  else {
    return Promise.resolve();
  }
}

// 验证通过，告诉爸爸
function onSubmit() {
  formRef.value
    .validate()
    .then(() => {
      props.handleUpdate(
        toRaw(formState),
        props.title === '新增任务' ? 'add' : 'edit',
      );
      formRef.value.resetFields();
    })
    .catch((error) => {
      console.log('error', error);
    })
    .finally(() => {
      closekeyboard();
      // formRef.value.resetFields();
    });
}
// 弹窗表单收到要修改的值
function updateForm(row: object) {
  formState.num = row.num;
  formState.urgentType = row.urgentType;
}

const showKeyboard = ref(false); // 键盘默认隐藏
const changeIpt = ref(''); // 选择了哪个输入框
const simpleKeyboard = ref(null);
const cursorPosition = ref('');
function onInputFocus(event, res) {
  showKeyboard.value = true;
  changeIpt.value = res;
  cursorPosition.value = event.target;
}
// 给输入框赋值
function onChangeKeyboard(input, keyboard) {
  console.log('🚀 ~ onChangeKeyboard ~ input:', input);
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null)
    setInputCaretPosition(cursorPosition.value, caretPosition);
  formState.num = input;
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
}
function handleCancel() {
  closekeyboard();
  formRef.value.resetFields();
  changeIpt.value = '';
  props.handleCancel();
}
defineExpose({
  updateForm,
});
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
::v-deep(.ant-form-item) {
  label {
    color: #000 !important;
    font-size: 16px;
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  // border-left: 3px solid #7ff3fd;
}
::-webkit-scrollbar-thumb {
  // background-color: #ffffff38;
  background-color: #1110100e;
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
