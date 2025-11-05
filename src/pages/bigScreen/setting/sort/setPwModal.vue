<template>
  <a-modal
    v-if="props.open"
    :get-container="false"
    :open="props.open"
    wrap-class-name="test"
    :closable="false"
    centered
    destroy-on-close
    force-render
    @ok="props.handleOk"
  >
    <div class="delete-modal box-border h-[20em] p-t-50px">
      <div class="h-full flex flex-col items-center justify-start">
        <span class="text-[30px] color-[#627384] font-bold">
          &nbsp;&nbsp; {{ props.title }}</span>
        <div
          class="scoll-bar mt20px h-full w-60% flex flex-col overflow-y-auto rounded-[8px] text-[24px] color-[#627384] font-bold"
        >
          <a-form ref="setPwRef" :model="formState" :rules="rules">
            <!-- 旧密码 -->
            <a-form-item
              name="oldPassword"
              :rules="[{ validator: validateOldPassword }]"
            >
              <a-input-password
                v-model:value="formState.oldPassword"
                :placeholder="t('sort.setPwModal.6bzd6scnzow0')"
                size="large"
                :maxlength="6"
                @input="handleInput('oldPassword', $event)"
                @touchstart="onInputFocus($event, 'oldPassword')"
              />
            </a-form-item>
            <!-- 新密码 -->
            <a-form-item
              name="newPassword"
              :rules="[{ validator: validateNewPassword }]"
            >
              <a-input-password
                v-model:value="formState.newPassword"
                :placeholder="t('sort.setPwModal.6bzd6sco1d40')"
                size="large"
                :maxlength="6"
                @input="handleInput('newPassword', $event)"
                @touchstart="onInputFocus($event, 'newPassword')"
              />
            </a-form-item>
            <!-- 确认新密码 -->
            <a-form-item
              name="confirmPassword"
              :rules="[{ validator: validateConfirmPassword }]"
            >
              <a-input-password
                v-model:value="formState.confirmPassword"
                :placeholder="t('sort.setPwModal.6bzd6sco1ic0')"
                size="large"
                :maxlength="6"
                @input="handleInput('confirmPassword', $event)"
                @touchstart="onInputFocus($event, 'confirmPassword')"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div v-show="showKeyboard">
        <SimpleKeyboard
          ref="simpleKeyboard"
          keyboard-width="w20%"
          layout="num"
          :max-length="6"
          :input="formState[changeIpt]"
          @on-change="onChangeKeyboard"
          @closekeyboard="closekeyboard"
        />
      </div>
    </div>
    <template #footer>
      <a-flex justify="center" align="center" class="pb-40px">
        <div
          class="cancelBtn h-110px w-220px transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
          @click="handleCancel"
        />
        <div
          class="okBtn h-110px w-220px transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
          @click="onSubmit"
        />
      </a-flex>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { Md5 } from 'ts-md5';
import { defineProps, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mainTainModule } from '@/apis/proApi';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { useAppStore } from '@/store/index';

const props = defineProps({
  open: Boolean,
  handleOk: Function,
  title: String,
  handleCancel: Function,
});

const { t } = useI18n();

const { notification } = App.useApp();
const setPwRef = ref();

interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const formState = reactive<FormState>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 校验新密码：必须是6位数字
function validateOldPassword(rule: any, value: string) {
  if (!value) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6scnzow0')));
  }
  if (value.length !== 6) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6sco1lc0')));
  }
  return Promise.resolve();
}

// 校验新密码：必须是6位数字
function validateNewPassword(rule: any, value: string) {
  if (!value) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6sco1ow0')));
  }
  if (value.length !== 6) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6sco1tc0')));
  }
  return Promise.resolve();
}

// 校验确认密码：必须与新密码一致
function validateConfirmPassword(rule: any, value: string) {
  if (!value) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6sco1ic0')));
  }
  if (value !== formState.newPassword) {
    return Promise.reject(new Error(t('sort.setPwModal.6bzd6sco1xg0')));
  }
  return Promise.resolve();
}

const rules = {
  oldPassword: [{ validator: validateOldPassword, trigger: 'blur' }],
  newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
};

// 提交表单
function onSubmit() {
  setPwRef.value
    .validate()
    .then(async () => {
      await setPassWord();
      closekeyboard();
    })
    .catch((error) => {
      console.error('Form validation error:', error);
    });
}

async function setPassWord() {
  try {
    useAppStore().setSpinning(true);
    const params = {
      type: 1,
      curPassword: new Md5().appendStr(formState.oldPassword).end(),
      newPassword: new Md5().appendStr(formState.confirmPassword).end(),
    };
    const data = await mainTainModule.getPassWord(params);
    if (data.code === 0) {
      useAppStore().setSpinning(false);
      notification.success({
        message: t('sort.setPwModal.6bzdqiu9xoo0'),
        description: t('sort.setPwModal.6bzd6sco21c0'),
        placement: 'bottomRight',
      });
      setPwRef.value.resetFields();
      props.handleCancel();
    }
    else {
      notification.error({
        message: t('sort.setPwModal.6bzdqiua4ds0'),
        description: data.msg,
        class: 'notification-custom-class',
        placement: 'bottomRight',
      });
      // setPwRef.value.resetFields();
      // props.handleCancel();
    }
  }
  catch (error) {
    notification.error({
      message: t('sort.setPwModal.6bzdqiua4ds0'),
      description: error,
      class: 'notification-custom-class',
      placement: 'bottomRight',
    });
  }
  finally {
    useAppStore().setSpinning(false);
  }
}

// 取消操作
function handleCancel() {
  formState.oldPassword = '';
  formState.newPassword = '';
  formState.confirmPassword = '';
  setPwRef.value.resetFields();
  props.handleCancel();
  closekeyboard();
}

// 输入事件处理
function handleInput(field: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, ''); // 限制只能输入数字
  formState[field] = value;
  event.target.value = value;
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
  const Newvalue = input.replace(/\D/g, ''); // 限制只能输入数字
  // 更新输入框的值

  formState[changeIpt.value] = Newvalue;
  // 手动触发校验
  setPwRef.value.validateFields([changeIpt.value], { first: true });
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
::v-deep.scoll-bar {
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #ffffff69;
  border-radius: 5px;
}
.cancelBtn {
  background-image: url('@/assets/image/bigScreen/btn/cancel.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.okBtn {
  background-image: url('@/assets/image/bigScreen/btn/ok.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
