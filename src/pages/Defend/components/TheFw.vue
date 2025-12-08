<template>
  <div class="bgItem text-1.1vw">
    <div class="relative mb-3vh w-95% -mt-3vh">
      <img src="@/assets/image/machine.png" class="w-100%" />
      <div class="absolute left-2% top-0 h-100% w-96% flex justify-between" @click="clickActived('')">
        <template v-for="(fw, index) in lists" :key="index">
          <div v-if="fw.code !== 0" class="bg_jianbian3 cursor-pointer bg-#b405054d px-1vw text-center write-vertical-left" :class="fw.uid === actived ? 'actived' : ''" @click.stop="clickActived(fw.uid)">
            {{ fw.name }}
          </div>
          <div v-else class="visible px-1vw write-vertical-left" @click="clickActived('')">&nbsp;</div>
        </template>
      </div>
    </div>
    <div class="h-30vh overflow-auto">
      <template v-for="(fw, index) in lists" :key="index">
        <template v-if="fw.uid === actived || actived === ''">
          <div class="bgItem_tit">
            {{ fw.name }}<span class="mr-5vw font-normal">{{ fw.msg }}</span>
          </div>
          <section class="bg_jianbian mb-1vh ml-2vw flex" :class="fw.code !== 0 ? 'bg_jianbian2' : ''">
            <div class="mr-3vw flex items-center">
              <div class="ml-2vw pr-0.5vw">快捷操作:</div>
              <a-button type="link" class="btn_search mr-1vw" @click="clickSendCmd(fw)">快捷抓本</a-button>
              <div class="ml-4vw pr-0.5vw">错误处理:</div>
              <a-button type="link" class="btn_search mr-1vw" @click="clickRemoveDoc(fw)">本已取走</a-button>
              <a-button type="link" class="btn_search mr-1vw" @click="clickDone(fw)">错误处理完成</a-button>
            </div>
          </section>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { defendModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const lists: any = ref({
  M1_BELT_JOB: { uid: 'M1_BELT_JOB', name: '模块1皮带工位', code: -1, msg: '' },
  M1_LOAD_JOB: { uid: 'M1_LOAD_JOB', name: '模块1装本工位', code: -1, msg: '' },
  M1_WASTE_JOB: { uid: 'M1_WASTE_JOB', name: '模块1废本仓工位', code: -1, msg: '' },
  M1_TURN1_JOB: { uid: 'M1_TURN1_JOB', name: '模块1翻页1工位', code: -1, msg: '' },
  M1_PHOTO_JOB: { uid: 'M1_PHOTO_JOB', name: '模块1照相工位', code: -1, msg: '' },
  M1_LS_DELIVER_JOB: { uid: 'M1_LS_DELIVER_JOB', name: '模块1激光送本工位', code: -1, msg: '' },
  M2_BELT_JOB: { uid: 'M2_BELT_JOB', name: '模块2皮带工位', code: -1, msg: '' },
  M2_TRANSITION_JOB: { uid: 'M2_TRANSITION_JOB', name: '模块2过渡位', code: -1, msg: '' },
  M2_DUMMY_JOB: { uid: 'M2_DUMMY_JOB', name: '模块2预留工位', code: -1, msg: '' },
  M2_IJ_DELIVER_JOB: { uid: 'M2_IJ_DELIVER_JOB', name: '模块2喷墨送本工位', code: -1, msg: '' },
  M2_INKJET_JOB: { uid: 'M2_INKJET_JOB', name: '模块2喷墨工位', code: -1, msg: '' },
  M2_CHECK_JOB: { uid: 'M2_CHECK_JOB', name: '模块2检查工位', code: -1, msg: '' },
  M2_SLOT1_JOB: { uid: 'M2_SLOT1_JOB', name: '模块2仓槽1待入仓工位', code: -1, msg: '' },
  M2_SLOT2_JOB: { uid: 'M2_SLOT2_JOB', name: '模块2仓槽2待入仓工位', code: -1, msg: '' },
});
let timeout: any = 0;
const actived = ref('');

function clickActived(key: string) {
  actived.value = actived.value !== key ? key : '';
}

async function clickSendCmd(fw: any) {
  try {
    useAppStore().setSpinning(true);
    const data: any = await defendModule.sendCmd({ jobUid: fw.uid, motion: 'QUICK_RELEASE', motionPara: 1 });
    if (data.code !== 0) throw data.msg;
    else notification.error({ message: '成功', description: '操作成功', class: 'notificationE-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function clickRemoveDoc(fw: any) {
  try {
    useAppStore().setSpinning(true);
    const data: any = await defendModule.removeDoc({ jobUid: fw.uid, nos: [1] });
    if (data.code !== 0) throw data.msg;
    else notification.error({ message: '成功', description: '操作成功', class: 'notificationE-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function clickDone(fw: any) {
  try {
    useAppStore().setSpinning(true);
    const data: any = await defendModule.Done({ jobUid: fw.uid });
    if (data.code !== 0) throw data.msg;
    else notification.error({ message: '成功', description: '操作成功', class: 'notificationE-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function getData(first = false) {
  try {
    if (first) useAppStore().setSpinning(true);
    let data: any = await defendModule.moduleStatus({ moduleUid: 'm1' });
    const data2: any = await defendModule.moduleStatus({ moduleUid: 'm2' });
    data = [...data.respData, ...data2.respData];
    data.forEach((element: any) => {
      if (lists.value[element.uid]) {
        lists.value[element.uid].code = element.code;
        lists.value[element.uid].msg = element.msg;
      }
    });
  } catch (error) {
    if (first) notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    if (first) useAppStore().setSpinning(false);
    timeout = setTimeout(() => {
      getData();
    }, 5000);
  }
}

onMounted(() => {
  getData(true);
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<style scoped>
.bgItem {
  margin-top: 3vh;
  .bgItem_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
  .bg_jianbian2 {
    background: linear-gradient(90deg, #b4050500 0%, #b4050557 34%, #b4050554 63%, #b4050500 99%);
  }
  .bg_jianbian3 {
    border: 1px solid;
    border-image: linear-gradient(180deg, #b40505 0%, #b40505 5%, #b4050503 100%) 1;
  }
  .actived {
    background-color: #b4050596;
  }
}
</style>
