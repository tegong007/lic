<template>
  <div class="bgItem text-1.1vw">
    <div class="bgItem_tit">灯光</div>
    <section class="bg_jianbian mb-2vh ml-2vw flex">
      <div v-for="(light, index) in props.data" :key="index" class="mr-3vw flex items-center">
        <div class="ml-2vw pr-0.5vw">{{ light.lampName }}:</div>
        <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, true)">打开</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/doc-machine/ctrl-lamp', light, false)">关闭</a-button>
      </div>
    </section>
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
    if (data.code !== 0) throw data.msg || '未知错误';
    else notification.success({ message: '成功', description: '操作成功', class: 'notification-custom-class', placement: 'bottomRight' });
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
