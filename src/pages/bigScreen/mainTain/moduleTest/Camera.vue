<template>
  <div class="box-border w-full">
    <div class="bg-[#fff]/[0.4] p-y-5px p-l-0.5em">
      <span>摄像头</span>
    </div>
    <section class="flex flex-wrap gap-20">
      <div
        v-for="(camera, index) in props.data"
        :key="index"
        class="max-w250px p-l-1.5em p-t-1em"
      >
        <div class="text-[18px]">
          {{ camera.cameraName }}：
          <a-button
            type="link"
            class="btn hover:text-[#89f7ff]!"
            @click="() => transfer(camera)"
          >
            拍照
          </a-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { api as ViewerApi } from 'v-viewer';
import { getApiTransfer } from '@/apis/webApi';
import { useAppStore } from '@/store/index';

const props = defineProps({
  data: Object,
});
function ViewImage(list: string[]) {
  ViewerApi({
    images: list,
    options: { navbar: false, title: false, toolbar: false, rotatable: false },
  });
}
const { notification } = App.useApp();
async function transfer(camera) {
  try {
    useAppStore().setSpinning(true);
    const params = {
      transURI: '/ips-c/camera-work',
      paraIn: {
        objs: [{ deviceIndex: camera.deviceIndex, dev: camera.dev }],
      },
    };
    const data = await getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      ViewImage([`data:image/png;base64,${data.rslts[0].imgData}`]);
      notification.success({
        message: `成功`,
        description: '操作成功',
        class: 'notification-custom-class',
        placement: 'bottomRight',
      });
    }
    else {
      notification.error({
        message: `错误`,
        description: data.rslts[0].msg || '未知错误',
        class: 'notification-custom-class',
        placement: 'bottomRight',
      });
    }
  }
  catch (error) {
    notification.error({
      message: `错误`,
      description: error,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  finally {
    useAppStore().setSpinning(false);
  }
}
</script>

<style scoped>
.btn {
  border-radius: 6px;
  opacity: 1;
  background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  padding: 6px 20px;
  color: white;
  height: 40px;
}
::v-deep(.ant-select-selection-item) {
  font-size: 16px;
}
</style>
