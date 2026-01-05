<template>
  <div class="bgItem text-1.1vw">
    <template v-for="(laser, index) in props.data" :key="index">
      <div class="bgItem_tit">{{ laser.laserName }}</div>
      <section class="bg_jianbian mb-1vh ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw"></div>
          <!-- <a-button type="link" class="btn_search mr-1vw" @click="previewPhoto(laser, laser.printItems)">预览标刻</a-button> -->
          <!-- <a-button type="link" class="btn_search mr-1vw" @click="printLaser(laser, laser.printItems)">标刻测试页</a-button> -->
          <a-button type="link" class="btn_search mr-1vw" @click="redLight(laser, laser.printItems)">红光</a-button>
          <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/lpdps/emergency-stop', laser)">急停</a-button>
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
