<template>
  <div class="w-full">
    <a-form
      ref="formRef"
      :model="formState"
      class="w-full rounded-[8px] bg-[#ffffff34] p-x-10 p-y-20"
    >
      <a-row :gutter="24">
        <a-col :span="6" />
        <a-col :span="6">
          <a-form-item label="证本号" name="docID">
            <a-input
              v-model:value="formState.docID"
              :maxlength="30"
              allow-clear
              @touchstart="onInputFocus($event, 'docID')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所属任务号" name="taskID">
            <a-input
              v-model:value="formState.taskID"
              :maxlength="30"
              allow-clear
              @touchstart="onInputFocus($event, 'taskID')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所属批次号" name="batchID">
            <a-input
              v-model:value="formState.batchID"
              :maxlength="30"
              allow-clear
              @touchstart="onInputFocus($event, 'batchID')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="日期" name="dateRange">
            <a-range-picker
              v-model:value="formState.dateRange"
              value-format="YYYY-MM-DD"
              input-read-only
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="状态" name="docStatus">
            <a-select v-model:value="formState.docStatus" class="w-full">
              <a-select-option
                v-for="option in docStatusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <div class="w-full flex">
            <a-button
              type="primary"
              class="btn flex items-center hover:text-[#89f7ff]!"
              @click="onSubmit"
            >
              <SearchOutlined />
              查询
            </a-button>
            <a-button
              type="primary"
              class="btn ml10 w80px hover:text-[#89f7ff]!"
              @click="clearAll"
            >
              重置
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <div v-show="showKeyboard">
      <SimpleKeyboard
        ref="simpleKeyboard"
        :transform="[0, 30]"
        :input="formState[changeIpt]"
        @on-change="onChangeKeyboard"
        @closekeyboard="closekeyboard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { docStatusOptions } from '@/pages/bigScreen/batch/option.ts';
import { SearchOutlined } from '@ant-design/icons-vue';
import { defineExpose, defineProps, reactive } from 'vue';

const props = defineProps({
  setSearchForm: Function,
});
const formRef = ref();
interface FormState {
  batchID?: string;
  docID: string;
  taskID?: string;
  docStatus: number;
}
const formState: UnwrapRef<FormState> = reactive({
  batchID: '',
  docID: '',
  taskID: '',
  docStatus: null,
  dateRange: [null, null],
});

function setBatchIDandGroupId(value1: string, value2?: string) {
  formState.taskID = value1;
  value2;
  // formState.batchID = value2;
  const filteredForm = Object.fromEntries(
    Object.entries(toRaw(formState)).filter(
      ([_key, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
  props.setSearchForm(filteredForm);
}
function onSubmit() {
  formRef.value
    .validate()
    .then(() => {
      const filteredForm = Object.fromEntries(
        Object.entries(toRaw(formState)).filter(
          ([_key, value]) =>
            value !== null && value !== undefined && value !== '',
        ),
      );
      props.setSearchForm(filteredForm);
      closekeyboard();
    })
    .catch((error) => {
      console.log('error', error);
    });
}
function clearAll() {
  formRef.value.resetFields();
  props.setSearchForm();
  closekeyboard();
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
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null)
    setInputCaretPosition(cursorPosition.value, caretPosition);

  formState[changeIpt.value] = input;
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
defineExpose({
  setBatchIDandGroupId,
});
</script>

<style lang="scss" scoped>
.btn {
  border-radius: 6px;
  opacity: 1;
  background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  padding: 0px 7px;
  color: white;
  height: 32px;
}
::v-deep(.ant-form-item) {
  label {
    color: #fff !important;
    font-size: 16px;
  }
}
</style>
