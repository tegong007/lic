<template>
  <a-modal width="40vw" :get-container="false" :open="props.open" wrap-class-name="test" :closable="false" centered force-render>
    <SimpleKeyboard v-if="focus" :transform="transformValue" keyboard-width="w20%" layout="num" :max-length="6" :input="formData[focus]" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="w-full pb-3vh pt-7vh text-center text-2.5vw color-#ffffff">{{ props.title }}</div>
    <a-input v-model:value="formData.oldPassword" type="password" :class="focus === 'oldPassword' ? 'keyInput' : ''" class="mb-3vh w-100% py-10px text-1.5vw" placeholder="请输入旧密码" :maxlength="6" @click.stop="onInputFocus($event, 'oldPassword')" />
    <a-input v-model:value="formData.newPassword" type="password" :class="focus === 'newPassword' ? 'keyInput' : ''" class="mb-3vh w-100% py-10px text-1.5vw" placeholder="请输入新密码（6位数字）" :maxlength="6" @click.stop="onInputFocus($event, 'newPassword')" />
    <a-input v-model:value="formData.confirmPassword" type="password" :class="focus === 'confirmPassword' ? 'keyInput' : ''" class="mb-3vh w-100% py-10px text-1.5vw" placeholder="请再次输入新密码" :maxlength="6" @click.stop="onInputFocus($event, 'confirmPassword')" />
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
const formData: any = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });

async function onSubmit() {
  try {
    useAppStore().setSpinning(true);
    if (formData.newPassword !== formData.confirmPassword) throw new Error('两次输入密码不一致');
    else if (formData.newPassword.length !== 6) throw new Error('新密码不能小于6位');
    const params = { type: 1, curPassword: new Md5().appendStr(formData.oldPassword).end(), newPassword: new Md5().appendStr(formData.confirmPassword).end() };
    const data: any = await mainTainModule.getPassWord(params);
    if (data.code === 0) {
      if (props.handleCancel) props.handleCancel();
      notification.success({ message: '成功', description: '修改成功', class: 'notification-custom-class', placement: 'bottomRight' });
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
  transformValue.value = [0, top - 240];
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
