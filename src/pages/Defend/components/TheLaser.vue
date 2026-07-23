<template>
  <div class="bgDefend_item">
    <template v-for="(laser, index) in props.data" :key="index">
      <div class="bgDefend_tit">{{ laser.laserName }}</div>
      <section class="bg_listItem">
        <div class="bgDefend_itemIn laser-row">
          <div class="bgDefend_itemIn_tit laser-name"></div>
          <a-button type="link" class="btn_search laser-btn" @click="redLight(laser, laser.printItems)">红光</a-button>
          <a-button type="link" class="btn_search laser-btn ml-1vw" @click="stopLaser(laser, laser.printItems)">急停</a-button>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { getApiTransfer } from '@/apis/webApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ data: Object });
const { notification } = App.useApp();

async function redLight(laserObj: any, _arr: any) {
  const objs = [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev, templateType: 'PS_2023', platform: 0 }];
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: '/lpdps/red-light', paraIn: { objs } };
    const data: any = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) throw data.rslts[0].msg || '未知错误';
    else notification.success({ message: '成功', description: '操作成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function stopLaser(laserObj: any, _arr: any) {
  const objs = [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev, platform: 0 }];
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: '/lpdps/emergency-stop', paraIn: { objs } };
    const data: any = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) throw data.rslts[0].msg || '未知错误';
    else notification.success({ message: '成功', description: '操作成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}
</script>

<style scoped lang="less">
.laser-row {
  width: 100%;
}
.laser-name {
  flex: 0 0 15vw;
  width: 15vw;
}
.laser-btn {
  flex: 0 0 6vw;
  width: 6vw;
  padding: 0;
  text-align: center;
}
</style>
