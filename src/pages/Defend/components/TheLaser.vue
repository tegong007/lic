<template>
  <div class="bgDefend_item">
    <template v-for="(laser, index) in props.data" :key="index">
      <div class="bgDefend_tit">{{ laser.laserName }}</div>
      <section class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit"></div>
          <a-button type="link" class="btn_search mr-2vw" @click="redLight(laser, laser.printItems)">红光</a-button>
          <a-button type="link" class="btn_search mr-2vw" @click="stopLaser(laser, laser.printItems)">急停</a-button>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { api } from 'v-viewer';
import { getApiTransfer } from '@/apis/webApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ data: Object });
const { notification } = App.useApp();

function ViewImage(list: string[]) {
  api({ images: list, options: { navbar: false, title: false, toolbar: false, rotatable: false } });
}

async function previewPhoto(laserObj: any, arr: any) {
  const objs = [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev, templateType: 'PS_2023', platform: Number(arr[0].value), isUseData: false }];
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: '/lpdps/preview', paraIn: { objs } };
    const data: any = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) {
      throw data.rslts[0].msg || '未知错误';
    } else {
      ViewImage([`data:image/png;base64,${data.rslts[0].imgData}`]);
      notification.success({ message: '成功', description: '操作成功', class: 'notification-custom-class', placement: 'bottomRight' });
    }
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function redLight(laserObj: any, arr: any) {
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

async function stopLaser(laserObj: any, arr: any) {
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

async function printLaser(laserObj: any, arr: any) {
  const objs = [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev, templateType: 'PS_2023', platform: Number(arr[0].value), isUseData: false }];
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: '/lpdps/print', paraIn: { objs } };
    const data: any = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) throw data.rslts[0].msg || '未知错误';
    else notification.success({ message: '成功', description: '操作成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function transferApi(url: any, laserObj: any) {
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: url, paraIn: laserObj };
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
