<template>
  <div class="bgItem text-1.1vw">
    <div class="bgItem_tit">激光器</div>
    <section v-for="(laser, index) in props.data" :key="index" class="bg_jianbian mb-1vh ml-2vw flex">
      <div class="mr-3vw flex items-center">
        <div class="ml-2vw pr-0.5vw">{{ laser.laserName }}:</div>
        <a-button type="link" class="btn_search mr-1vw" @click="previewPhoto(laser, laser.printItems)">预览标刻</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="printLaser(laser, laser.printItems)">标刻测试页</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="redLight(laser, laser.printItems)">红光</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="transferApi('/lpdps/emergency-stop', laser)">急停</a-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { api } from 'v-viewer';
import { useI18n } from 'vue-i18n';
import { getApiTransfer } from '@/apis/webApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ data: Object });
const { notification } = App.useApp();
const { t } = useI18n();

function ViewImage(list: string[]) {
  api({ images: list, options: { navbar: false, title: false, toolbar: false, rotatable: false } });
}

async function previewPhoto(laserObj: any, arr: any) {
  try {
    useAppStore().setSpinning(true);
    await transferApi('/lpdps/preview', [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev, templateType: 'PS_2023', platform: Number(arr[0].value), isUseData: false }]);
    notification.error({ message: '成功', description: '操作成功', class: 'notificationE-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function redLight(laserObj, arr) {
  const objs = [
    {
      deviceIndex: laserObj.deviceIndex,
      dev: laserObj.dev,
      templateType: 'PS_2023',
      platform: Number(arr[0].value),
    },
  ];
  transferApi('/lpdps/red-light', objs);
}

async function printLaser(laserObj, arr) {
  const objs = [
    {
      deviceIndex: laserObj.deviceIndex,
      dev: laserObj.dev,
      templateType: 'PS_2023',
      platform: Number(arr[0].value),
      isUseData: false,
    },
  ];
  transferApi('/lpdps/print', objs);
}

async function transferApi(url, laserObj) {
  try {
    useAppStore().setSpinning(true);
    const params = {
      transURI: url,
      paraIn: {
        objs: url !== '/lpdps/emergency-stop' ? laserObj : [{ deviceIndex: laserObj.deviceIndex, dev: laserObj.dev }],
      },
    };
    console.log('🚀 ~ transfer ~ params:', params);
    const data = await getApiTransfer(params);
    if (data.rslts[0].code !== 0) {
      notification.error({
        message: this.t('moduleTest.Laser.6bzg7ygu8lc0'),
        description: data.rslts[0].msg,
        placement: 'bottomRight',
        class: 'notificationE-custom-class',
      });
    } else if (data.rslts[0].code === 0 && url !== '/lpdps/preview') {
      notification.success({
        message: this.t('moduleTest.Laser.6bzg7ygu8nc0'),
        description: this.t('moduleTest.Laser.6bzg7ygu8p40'),
        placement: 'bottomRight',
        class: 'notificationE-custom-class',
      });
    } else {
      if (url === '/lpdps/preview') {
        ViewImage([`data:image/png;base64,${data.rslts[0].imgData}`]);
        notification.success({
          message: this.t('moduleTest.Laser.6bzg7ygu8nc0'),
          description: this.t('moduleTest.Laser.6bzg7ygu8p40'),
          placement: 'bottomRight',
          class: 'notificationE-custom-class',
        });
      }
    }
  } catch (error) {
    notification.error({
      message: this.t('moduleTest.Laser.6bzg7ygu8lc0'),
      description: error,
      class: 'notificationE-custom-class',
      placement: 'bottomRight',
    });
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
