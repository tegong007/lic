<template>
  <a-modal width="40vw" :get-container="false" :open="props.open" wrap-class-name="test" :closable="false" centered force-render>
    <SimpleKeyboard v-if="focus" :transform="transformValue" keyboard-width="w20%" layout="num" :max-length="6" :input="formData[focus]" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="w-full pb-3vh pt-7vh text-center text-2.5vw color-#ffffff">{{ props.title }}</div>
    <a-input v-model:value="formData.password" type="password" :class="focus === 'password' ? 'keyInput' : ''" class="mb-3vh w-100% py-10px text-1.5vw" placeholder="请输入六位数字密码" :maxlength="6" @click.stop="onInputFocus($event, 'password')" />
    <template #footer>
      <a-flex justify="center" align="center" class="gap-10%">
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="handleCancel">取消</a-button>
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="onSubmit">确定</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { Md5 } from 'ts-md5';
import { defineProps, reactive, ref } from 'vue';
import { mainTainModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ open: Boolean, handleOk: Function, title: String, handleCancel: Function });

const { notification } = App.useApp();

const focus = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const formData: any = reactive({ password: '' });

async function onSubmit() {
  try {
    useAppStore().setSpinning(true);
    const params = { type: 0, curPassword: new Md5().appendStr(formData.password).end() };
    const data: any = await mainTainModule.getPassWord(params);
    console.log('🚀 ~ onSubmit ~ data:', data);
    if (data.code === 0) {
      useAppStore().setSpinning(false);
      if (props.handleOk) {
        return props.handleOk();
      }
      if (props.title === '系统关机') window.electronAPI.exitWindow();
      else window.electron.send('quit-app');
    } else {
      throw new Error(data.msg);
    }
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

function hideKeyboard() {
  focus.value = '';
}

function onInputFocus(event: any, text: string) {
  focus.value = text;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  transformValue.value = [0, top - 340];
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  formData[focus.value] = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}
/*
// 校验新密码：必须是6位数字
function validateOldPassword(rule: any, value: string) {
  if (!value) {
    return Promise.reject(new Error('请输入旧密码'));
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
      props.handleCancel();
    } else {
      notification.error({
        message: t('sort.setPwModal.6bzdqiua4ds0'),
        description: data.msg,
        class: 'notification-custom-class',
        placement: 'bottomRight',
      });
      // setPwRef.value.resetFields();
      // props.handleCancel();
    }
  } catch (error) {
    notification.error({
      message: t('sort.setPwModal.6bzdqiua4ds0'),
      description: error,
      class: 'notification-custom-class',
      placement: 'bottomRight',
    });
  } finally {
    useAppStore().setSpinning(false);
  }
}

// 取消操作
function handleCancel() {
  formState.oldPassword = '';
  formState.newPassword = '';
  formState.confirmPassword = '';
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
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
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
} */
</script>

<style scoped lang="less">
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #03163e;
  padding-bottom: 8vh;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
.btn {
  background: #3662ec;
  border: 0;
  color: #ffffff;
  width: 30%;
  font-size: 3vh;
  height: 7vh;
  &:hover {
    color: #ffffff;
  }
}
</style>
