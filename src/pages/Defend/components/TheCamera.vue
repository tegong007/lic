<template>
  <div class="bgDefend_item">
    <div class="bgDefend_tit">摄像头</div>
    <section class="bg_listItem" style="display: block; padding-bottom: 1px">
      <div v-for="(camera, index) in props.data" :key="index" class="bgDefend_itemIn camera-row mb-1vh">
        <div class="bgDefend_itemIn_tit camera-name">{{ camera.cameraName }}:</div>
        <a-button type="link" class="btn_search camera-btn" @click="transferApi(camera)">{{ t('拍照') }}</a-button>
        <div class="bgDefend_itemIn_tit camera-uid-label">UID:</div>
        <a-input v-model:value="camera.uid" disabled class="camera-uid-input" />
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
// 每个摄像头的第一个 tit（名称）左侧小竖条
.bgDefend_itemIn .bgDefend_itemIn_tit:first-of-type {
  position: relative;
  padding-left: 1.5vw;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 1.2em;
    border-radius: 50px;
    background: #ffffff;
  }
}
.camera-row {
  width: 100%;
}
.camera-name {
  flex: 0 0 15vw;
  width: 15vw;
}
.camera-btn {
  flex: 0 0 6vw;
  width: 6vw;
  padding: 0;
  text-align: center;
}
.camera-uid-label {
  flex: 0 0 4vw;
  width: 4vw;
}
.camera-uid-input {
  flex: 1;
  min-width: 10vw;
}
:::v-deep(.ant-input) {
  font-size: 1.1vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 0px !important;
  background-color: #ffffff15 !important;
  height: 5vh !important;
  border-radius: 0;
  min-width: 10vw;
}
</style>
