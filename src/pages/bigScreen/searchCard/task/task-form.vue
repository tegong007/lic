<template>
  <div class="w-full">
    <a-form
      ref="formRef"
      :model="formState"
      class="w-full rounded-[8px] bg-[#ffffff34] p-x-10 p-y-20"
    >
      <a-row :gutter="24">
        <a-col :span="4" />

        <a-col :span="3">
          <a-form-item :label="t('task.task-form.6byof7oj13c0')" name="taskID">
            <a-input
              v-model:value="formState.taskID"
              :maxlength="30"
              allow-clear
              @touchstart="onInputFocus($event, 'taskID')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item :label="t('task.task-form.6byof7oj42g0')" name="batchID">
            <a-input
              v-model:value="formState.batchID"
              :maxlength="30"
              allow-clear
              @touchstart="onInputFocus($event, 'batchID')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item :label="t('task.task-form.6byof7oj4o80')" name="status">
            <a-select v-model:value="formState.status" class="w-200px">
              <a-select-option
                v-for="option in TaskStatusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            :label="t('task.task-form.6byof7oj4r40')"
            name="dateRange"
          >
            <a-range-picker
              v-model:value="formState.dateRange"
              value-format="YYYY-MM-DD"
              input-read-only
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="6">
          <div class="w-full flex">
            <a-button
              type="primary"
              class="btn flex items-center hover:text-[#89f7ff]!"
              @click="onSubmit"
            >
              <SearchOutlined />
              {{ t('task.task-form.6byof7oj4sw0') }}
            </a-button>
            <a-button
              type="primary"
              class="btn ml10 w80px hover:text-[#89f7ff]!"
              @click="clearAll"
            >
              {{ t('task.task-form.6byof7oj4v80') }}
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
import { SearchOutlined } from '@ant-design/icons-vue';
import { defineExpose, defineProps, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { TaskStatusOptions } from '@/pages/bigScreen/batch/option.ts';

const props = defineProps({
  setSearchForm: Function,
});
const { t } = useI18n();
const route = useRoute();
const formRef = ref();

interface FormState {
  batchID: string;
  taskID: string;
  status: number;
  // timeRange: RangeValue;
}
const batchID = ref('');
const taskID = ref('');
const formState: UnwrapRef<FormState> = reactive({
  batchID: '',
  taskID: '',
  status: null,
  dateRange: [null, null],
});
function setTaskID(value: string) {
  formState.taskID = value;
  const filteredForm = Object.fromEntries(
    Object.entries(toRaw(formState)).filter(
      ([_key, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
  props.setSearchForm(filteredForm);
}
onActivated(() => {
  nextTick(() => {
    const query = route.query;
    batchID.value = query.batchID;
    taskID.value = query.taskID;
    formState.batchID = query.batchID;
    formState.taskID = query.taskID;
  });
});
onDeactivated(() => {
  formRef.value.resetFields();
});

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
  // 只出现当前的
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
  setTaskID,
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
