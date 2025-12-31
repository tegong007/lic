<template>
  <div class="bgItem text-1.1vw">
    <template v-for="(light, index) in props.data" :key="index">
      <div class="bgItem_tit">{{ light.lampName }}</div>
      <section class="bg_jianbian mb-2vh ml-2vw flex">
        <div v-if="props.act === 1" class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">正反检测灯光:</div>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
          <div class="ml-2vw pr-0.5vw">OCR灯光:</div>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
        </div>
        <div v-else-if="props.act === 2" class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">激光定位灯光:</div>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
        </div>
        <div v-else-if="props.act === 3" class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">喷墨定位灯光:</div>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
          <div class="ml-2vw pr-0.5vw">成品检测灯光:</div>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { getApiTransfer } from '@/apis/webApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ data: Object, act: Number });
const { notification } = App.useApp();

async function transferApi(url: any, lightObj: any, trunOn: boolean) {
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: url, paraIn: { jobUid: lightObj.jobUid, type: lightObj.type, isTurnOn: trunOn } };
    const data: any = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) throw data.rslts[0].msg || '未知错误';
    else notification.error({ message: '成功', description: '操作成功', class: 'notificationE-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}
</script>

<style scoped>
.bgItem {
  margin-top: 3vh;
  .bgItem_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
}
</style>
