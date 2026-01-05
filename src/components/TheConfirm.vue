<template>
  <a-modal width="44vw" :get-container="false" :open="props.open" :closable="false" centered force-render>
    <SimpleKeyboard v-if="focus && props.title === '补打备注'" :transform="transformValue" :input="text" :max-length="20" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <SimpleKeyboard v-if="focus && props.title === '开始进本'" :transform="transformValue" layout="num" :input="text" :max-length="20" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <template v-if="props.title === '补打备注'">
      <div class="w-full pb-6vh pt-7vh text-center text-2.5vw color-#ffffff">{{ `${props.title}前请输入证本号` }}</div>
      <a-input v-model:value="text" :class="focus ? 'keyInput' : ''" class="mb-6vh w-100% py-10px text-1.5vw" placeholder="请输入证本号" :maxlength="15" @click.stop="onInputFocus($event)" />
    </template>
    <template v-else-if="props.title === '开始进本'">
      <div class="w-full pb-0vh pt-7vh text-center text-2.5vw color-#ffffff">{{ `${props.title}前请输入进本数` }}</div>
      <div class="w-full pb-6vh pt-0vh text-center text-2vw color-#ffffff">{{ `(范围1~${props.desc})` }}</div>
      <a-input v-model:value="text" :class="focus ? 'keyInput' : ''" class="mx-auto mb-6vh block w-80% py-10px text-1.5vw" placeholder="请输入进本数" :maxlength="15" @click.stop="onInputFocus($event)" />
    </template>
    <template v-else-if="props.title === '任务添加成功'">
      <div class="w-full pb-6vh pt-7vh text-center text-2.5vw color-#ffffff">{{ props.title }}</div>
      <div class="text-1.5vw text-#ffffff">
        <div class="mx-auto w-60% pb-2vh">任务号: {{ props.data.batchID }}</div>
        <div class="mx-auto w-60% pb-2vh">批次号: {{ props.data.taskID }}</div>
        <div class="mx-auto w-60% pb-2vh">总人数: {{ props.data.totalPeopleNum }}</div>
      </div>
    </template>
    <template v-else-if="props.title === '喷墨机状态'">
      <div class="w-full pb-6vh pt-7vh text-center text-2.5vw color-#ffffff">{{ props.title }}</div>
      <div class="mx-auto w-90% pb-6vh text-1.5vw text-#ffffff">{{ props.desc }}</div>
    </template>
    <template v-else-if="props.title === '错误弹窗提示'">
      <div class="w-full pb-6vh pt-7vh text-center text-2.5vw color-#ffffff">{{ props.data ? props.data.title : '--' }}</div>
      <div class="mx-auto h-20vh w-90% overflow-auto text-1.5vw text-#ffffff">{{ props.data ? props.data.msg : '--' }}</div>
    </template>
    <div v-else class="w-full pb-12vh pt-13vh text-center text-2.5vw color-#ffffff">{{ `确定执行${props.title}？` }}</div>
    <template #footer>
      <a-flex v-if="props.title === '错误弹窗提示'" justify="center" align="center" class="gap-10%">
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('继续任务')">继续任务</a-button>
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('停止进本')">停止进本</a-button>
        <a-button class="btn transition-transform duration-300 hover:scale-105" @click="submitOKHandel('暂停设备')">暂停设备</a-button>
      </a-flex>
      <a-flex v-else justify="center" align="center" class="gap-10%">
        <a-button v-if="props.title !== '任务添加成功' && props.title !== '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="handleCancel">取消</a-button>
        <a-button v-if="props.title === '补打备注' || props.title === '开始进本'" class="btn transition-transform duration-300 hover:scale-105" @click="submitOK">确定</a-button>
        <a-button v-else-if="props.title === '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="handleCancel">确定</a-button>
        <a-button v-else class="btn transition-transform duration-300 hover:scale-105" @click="handleOk">确定</a-button>
        <a-button v-if="props.title === '喷墨机状态'" class="btn transition-transform duration-300 hover:scale-105" @click="clearData">清除喷墨日志</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { homeModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';
import { ensureInRange } from '@/utils/index';

const props = defineProps({ open: Boolean, handleOk: Function, title: String, handleCancel: Function, data: Object, desc: String });
const text = ref(props.desc || '');
const focus = ref(false);
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const { notification } = App.useApp();

async function submitOKHandel(key: string) {
  try {
    useAppStore().setSpinning(true);
    let temp = 0;
    if (key === '继续任务') temp = 0;
    else if (key === '停止进本') temp = 1;
    else if (key === '暂停设备') temp = 2;
    await homeModule.errorHandle({ type: props.data.type, position: props.data.position, operate: temp });
    notification.success({ message: '成功', description: `${key}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
    if (props.handleCancel) props.handleCancel();
  }
}

async function submitOK() {
  if (props.title === '开始进本') {
    if (text.value) {
      if (!ensureInRange(text.value, props.desc)) {
        notification.error({ message: '错误', description: '进本数不在有效范围', placement: 'bottomRight', class: 'notificationE-custom-class' });
      } else {
        try {
          useAppStore().setSpinning(true);
          await homeModule.setControlMachine({ control: 0, docNum: Number(text.value) });
          notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
        } catch (error) {
          notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
        } finally {
          useAppStore().setSpinning(false);
          if (props.handleCancel) props.handleCancel();
        }
      }
    } else {
      notification.error({ message: '错误', description: '请先输入进本数', placement: 'bottomRight', class: 'notificationE-custom-class' });
    }
  } else {
    if (text.value) {
      try {
        useAppStore().setSpinning(true);
        await homeModule.printObsv({ docID: text.value });
        notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
      } catch (error) {
        notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
      } finally {
        useAppStore().setSpinning(false);
        if (props.handleCancel) props.handleCancel();
      }
    } else {
      notification.error({ message: '错误', description: '请先输入证本号', placement: 'bottomRight', class: 'notificationE-custom-class' });
    }
  }
}

async function clearData() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await homeModule.getHomeList();
    if (data.respData.entire && data.respData.entire.uvStatus && data.respData.entire.uvStatus[0]) await homeModule.clearLog({ uid: data.respData.entire.uvStatus[0].uid });
    notification.success({ message: '成功', description: `${props.title}操作成功`, placement: 'bottomRight', class: 'notificationE-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
    if (props.handleCancel) props.handleCancel();
  }
}

function hideKeyboard() {
  focus.value = false;
}

function onInputFocus(event: any) {
  focus.value = true;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  transformValue.value = [-200, top - 280];
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  text.value = input;
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
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 54vh;
  background-color: #03163e;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
</style>
