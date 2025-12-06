<template>
  <div class="bgItem text-1.1vw">
    <div class="bgItem_tit">摄像头</div>
    <section class="bg_jianbian mb-2vh ml-2vw flex">
      <div v-for="(camera, index) in props.data" :key="index" class="mr-3vw flex items-center">
        <div class="ml-2vw pr-0.5vw">{{ camera.cameraName }}:</div>
        <a-button type="link" class="btn_search" @click="transferApi(camera)">{{ t('拍照') }}</a-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { api } from 'v-viewer';
import { useI18n } from 'vue-i18n';
import { defendModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const props = defineProps({ data: Object });
const { notification } = App.useApp();
const { t } = useI18n();

function ViewImage(list: string[]) {
  api({ images: list, options: { navbar: false, title: false, toolbar: false, rotatable: false } });
}

async function transferApi(cameraObj: any) {
  try {
    useAppStore().setSpinning(true);
    const params = { transURI: '/ips-c/camera-work', paraIn: { objs: [{ deviceIndex: cameraObj.deviceIndex, dev: cameraObj.dev }] } };
    const data: any = await defendModule.getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      ViewImage([`data:image/png;base64,${data.rslts[0].imgData}`]);
      notification.success({ message: t('成功'), description: t('操作成功'), placement: 'bottomRight', class: 'notificationE-custom-class' });
    } else {
      throw data.rslts[0].msg || t('未知错误');
    }
  } catch (error) {
    notification.error({ message: t('错误'), description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
  } finally {
    useAppStore().setSpinning(false);
  }
}
</script>

<style scoped lang="less">
.bgItem {
  margin-top: 3vh;
  .bgItem_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
}
</style>
