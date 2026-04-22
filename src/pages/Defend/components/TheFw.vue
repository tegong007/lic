<template>
  <div class="">
    <div class="relative mt--1vh w-95%">
      <img src="@/assets/image/bg_machine.png" class="w-full" />
      <div class="absolute left-0 top-0 h-100% w-100% text-1.5vw" @click="clickActived('')">
        <template v-for="(fw, index) in lists" :key="index">
          <template v-if="fw.code !== 0">
            <div v-if="fw.quick || fw.get" class="bg_error absolute flex cursor-pointer items-center justify-center text-center" :class="(fw.uid === actived ? 'actived' : '') + fw.style" @click.stop="clickActived(fw.uid)">
              {{ fw.name }}
            </div>
            <div v-else class="absolute flex items-center justify-center bg-#b405054d text-center" :class="fw.style" @click.stop="clickActived('')">{{ fw.name }}</div>
          </template>
        </template>
      </div>
    </div>
    <div class="bgDefend_item relative h-55vh overflow-auto">
      <a-button type="link" class="btn_normal fixed bottom-8vh right-5vw" @click="clickDone">错误处理完成</a-button>
      <template v-for="(fw, index) in lists" :key="index">
        <template v-if="(fw.uid === actived || actived === '') && (fw.quick || fw.get)">
          <div class="bgDefend_tit">
            {{ fw.name }}<span class="mr-5vw font-normal">{{ fw.msg }}</span>
          </div>
          <section class="bg_listItem" :class="fw.code !== 0 ? 'bg_errorItem' : ''">
            <div class="mr-3vw flex items-center">
              <template v-if="fw.quick">
                <div class="ml-2vw pr-0.5vw">快捷操作:</div>
                <a-button type="link" class="btn_search mr-1vw" @click="clickSendCmd(fw)">快捷抓本</a-button>
              </template>
              <template v-if="fw.get">
                <div class="ml-2vw pr-0.5vw">错误处理:</div>
                <a-button type="link" class="btn_search mr-1vw" @click="clickRemoveDoc(fw)">本已取走</a-button>
              </template>
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
  M2_SLOT2_JOB: { uid: 'M2_SLOT2_JOB', get: true, quick: true, name: '模块2仓槽2待入仓工位', code: -1, msg: '', style: ' left-6.2% top-1% bottom-38% w-6.2% write-vertical-left' },
  M2_SLOT1_JOB: { uid: 'M2_SLOT1_JOB', get: true, quick: true, name: '模块2仓槽1待入仓工位', code: -1, msg: '', style: ' left-14.4% top-41% bottom-38% w-6.1% text-1vw' },
  M2_CHECK_JOB: { uid: 'M2_CHECK_JOB', get: true, name: '模块2检查工位', code: -1, msg: '', style: ' left-21% top-19.5% bottom-36% w-8.5%' },
  M2_INKJET_JOB: { uid: 'M2_INKJET_JOB', get: true, quick: true, name: '模块2喷墨工位', code: -1, msg: '', style: ' left-30% top-40% bottom-26% write-vertical-left w-4% text-1.5vw' },
  M2_IJ_DELIVER_JOB: { uid: 'M2_IJ_DELIVER_JOB', get: true, quick: true, name: '模块2喷墨送本工位', code: -1, msg: '', style: ' left-34.5% top-40% bottom-26% write-vertical-left w-4% text-1.3vw' },
  M2_DUMMY_JOB: { uid: 'M2_DUMMY_JOB', get: true, name: '模块2预留工位', code: -1, msg: '', style: ' left-38.7% top-62.5% bottom-26% w-8% text-1.3vw' },
  M2_TRANSITION_JOB: { uid: 'M2_TRANSITION_JOB', get: true, name: '模块2过渡位', code: -1, msg: '', style: ' left-47% top-62.5% bottom-26% w-7% text-1.3vw' },
  M2_BELT_JOB: { uid: 'M2_BELT_JOB', quick: true, name: '模块2皮带工位', code: -1, msg: '', style: ' left-35.5% top-76.5% bottom-9.5% w-18.5%' },
  M1_LS_DELIVER_JOB: { uid: 'M1_LS_DELIVER_JOB', get: true, quick: true, name: '模块1激光送本工位', code: -1, msg: '', style: ' left-58% top-15% bottom-53% w-6.7% text-1.4vw' },
  M1_PHOTO_JOB: { uid: 'M1_PHOTO_JOB', get: true, name: '模块1照相工位', code: -1, msg: '', style: ' left-65% top-28% bottom-38% w-8% text-1.4vw' },
  M1_TURN1_JOB: { uid: 'M1_TURN1_JOB', get: true, quick: true, name: '模块1翻页1工位', code: -1, msg: '', style: ' left-73.5% top-47% bottom-28% w-7% text-1.4vw' },
  M1_WASTE_JOB: { uid: 'M1_WASTE_JOB', get: true, quick: true, name: '模块1废本仓工位', code: -1, msg: '', style: ' left-80.8% top-47% bottom-31% w-6.4% text-1.4vw' },
  M1_LOAD_JOB: { uid: 'M1_LOAD_JOB', get: true, name: '模块1装本工位', code: -1, msg: '', style: ' left-87.5% top-1% bottom-35.5% w-7.5% write-vertical-left w-2.3vw ' },
  M1_BELT_JOB: { uid: 'M1_BELT_JOB', quick: true, name: '模块1皮带工位', code: -1, msg: '', style: ' left-86% top-76.5% bottom-9.5% w-12% text-1.5vw' },
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
    else notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
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
    else notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function clickDone() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await defendModule.Done({ jobUid: '' });
    if (data.code !== 0) throw data.msg;
    else notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
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
.bg_error {
  border: 1px solid;
  border-image: linear-gradient(180deg, #b40505 0%, #b40505 5%, #b4050503 100%) 1;
  background: #b40505be;
}
.actived {
  background-color: #db0909;
}
.bg_listItem {
  &.bg_errorItem {
    background: linear-gradient(90deg, #b4050500 0%, #b4050557 34%, #b4050554 63%, #b4050500 99%);
  }
}
</style>
