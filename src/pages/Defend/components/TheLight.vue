<template>
  <div class="bgDefend_item">
    <div class="bgDefend_tit">灯光</div>
    <section class="bg_listItem">
      <div v-for="(light, index) in props.data" :key="index" class="bgDefend_itemIn">
        <div class="bgDefend_itemIn_tit">{{ light.lampName }}:</div>
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
