<template>
  <SimpleKeyboard v-if="showKeyboard" layout="num" keyboard-width="w20%" :transform="transformValue" :input="lists[keyInputArr[1]][keyInputArr[2]][keyInputArr[3]][keyInputArr[4]]" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div v-if="actived" class="relative mx-auto h-65vh w-95% overflow-auto">
    <div class="fixed z-2 w-full flex items-center justify-between bg-#03163e">
      <div class="ml-2vw text-2.5vw font-bold">{{ navs[`x${actived}`].name }}</div>
      <div class="mr-7vw flex gap-2vw">
        <a-button type="link" class="btn_normal" @click="getDataList">刷新状态</a-button>
        <a-button type="link" class="btn_normal" @click="saveData">保存设置</a-button>
      </div>
    </div>
    <div class="mt-5vh text-1vw">
      <div v-for="(item, index) in lists" :key="index" class="my-2vh">
        <div class="bg_listItem flex justify-around py-1vh text-2vw">
          <div class="w-20vw font-bold">{{ item.item }}</div>
          <div>历史成功数：{{ item.historySuccessNum || 0 }}</div>
          <div>历史失败数：{{ item.historyFailNum || 0 }}</div>
          <div v-if="item.status === 0 || item.status === 1" class="success">正常</div>
          <div v-else-if="item.status === 2" class="error">警告</div>
          <div v-else-if="item.status === 3" class="warn">故障</div>
        </div>
        <div class="text-2vw">
          <div v-for="(item2, index2) in item.deviceList" :key="index2" class="flex">
            <div class="my-1vh flex items-center">
              <div class="w-10vw pr-0.5vw text-right">名称:</div><div>{{ item2.name }}</div>
            </div>
            <div class="my-1vh flex items-center">
              <div class="w-15vw pr-0.5vw text-right">本机IP:</div>
              <a-input v-model:value="lists[index].deviceList[index2].uid" :class="keyInput === `lists,${index},deviceList,${index2},uid` ? 'keyInput' : ''" class="w-20vw" placeholder="请输入" :maxlength="15" @click.stop="onInputFocus($event, ['lists', index, 'deviceList', index2, 'uid'], 15)" />
            </div>
            <div class="my-1vh flex items-center">
              <div class="w-15vw pr-0.5vw text-right">是否启用:</div>
              <a-switch v-model:checked="lists[index].deviceList[index2].isEnable" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bgStation_bottom fixed bottom-0 left-12vw right-7vw flex justify-center px-3vw py-2vh">
    <div>
      <TheButton title="返回" @click="$goto('HomePage')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { homeModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const route = useRoute();

const actived = ref(0);
const navs: any = { x3: { name: '喷墨打印模块', key: 3 }, x2: { name: '激光打印模块', key: 2 }, x1: { name: '进本模块', key: 1 } };
const lists: any = ref([]);
const listsOld: any = ref([]);
const showKeyboard = ref(false);
const keyInput = ref('');
const keyInputArr = ref([]);
const limitInput = ref(0);
const cursorPosition = ref(null);
const transformValue: any = ref(null);

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
  keyInputArr.value = [];
}

function onInputFocus(event: any, text: any, limit = 0) {
  if (keyInput.value !== text) {
    showKeyboard.value = true;
    keyInput.value = text.toString();
    console.log(keyInput.value);
    keyInputArr.value = text;
    limitInput.value = limit;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [300, top - 120];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  lists.value[keyInputArr.value[1]][keyInputArr.value[2]][keyInputArr.value[3]][keyInputArr.value[4]] = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}

function setActived(key: number) {
  if (key !== actived.value) {
    actived.value = key;
    getDataList();
  }
}

async function getDataList() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await homeModule.getPositionCard(actived.value);
    if (data.respData) {
      data.respData.forEach((element: any) => {
        if (actived.value === element.moduleID) {
          lists.value = element.items;
          listsOld.value = JSON.parse(JSON.stringify(element.items));
        }
      });
    }
  } catch (error) {
    lists.value = [];
    listsOld.value = [];
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function saveData() {
  try {
    useAppStore().setSpinning(true);
    const data: any = [];
    const temp: any = JSON.parse(JSON.stringify(lists.value));
    temp.forEach((element1: any, index1: number) => {
      element1.deviceList.forEach((element2: any, index2: number) => {
        console.log(element2);
        console.log(listsOld.value[index1].deviceList[index2]);
        if (element2.uid !== listsOld.value[index1].deviceList[index2].uid || element2.isEnable !== listsOld.value[index1].deviceList[index2].isEnable) data.push(element2);
      });
    });
    await homeModule.deviceSet({ deviceList: data });
    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(async () => {
  setActived(Number(route.query.key || 3));
});
</script>

<style scoped lang="less">
::v-deep(.ant-input) {
  font-size: 2vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 1px !important;
  height: 3vh !important;
  border-radius: 0;
  min-width: 10vw;
}
::v-deep(.ant-input::placeholder) {
  color: #989ca1;
}
.bg_listItem {
  .success,
  .warn,
  .error {
    text-align: center;
    font-size: 2vw;
    padding: 0 1.5vw;
  }
  .success {
    background: #5fcc3433;
    color: #5fcc34;
  }
  .warn {
    background: #ff8f1f99;
    color: #ecac36;
  }
  .error {
    background: #e3100833;
    color: #e31008;
  }
}
/*.bgStation_bottom {
  background:
    linear-gradient(270deg, #03163e 0%, #03163e 93%, #03163e00 100%),
    linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}*/
.keyInput {
  border-color: #3662ec;
}
</style>
