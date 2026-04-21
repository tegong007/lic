<template>
  <div class="bgHeader relative m-auto h-7.5vh w-100vw">
    <div class="mt--2.5vh flex justify-between px-2vw text-2.2vw">
      <span>网络状态：{{ isConnect }}</span>
      <span>{{ currentTime }}</span>
    </div>
    <div class="absolute top-0.3vh w-full text-center">
      <span class="text-5.5vw font-[youshe]">智能护照制证平台</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defendModule } from '@/apis/proApi';
import { formatDateTime } from '@/utils/time';
import useCustomTimer from '@/utils/useCustomTimer';

const { start } = useCustomTimer();

const currentTime = ref(formatDateTime());
const isConnect = ref('--');

async function getData() {
  try {
    const data: any = await defendModule.getVersion({ type: 1 });
    if (data.code === 0) isConnect.value = '已连接';
  } catch {
    isConnect.value = '未连接';
  }
}

onMounted(async () => {
  start(() => {
    currentTime.value = formatDateTime();
  }, 1);
  await getData();
  start(() => {
    getData();
  }, 5);
});
</script>

<style scoped lang="less">
.bgHeader {
  background: url('@/assets/image/bg_topBar.png') no-repeat bottom;
  background-size: contain;
}
</style>
