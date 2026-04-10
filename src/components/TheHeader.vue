<template>
  <div class="bgHeader relative m-auto h-16.5vh w-81vw">
    <div class="absolute top--5vh w-full text-center">
      <span class="text-2.5vw font-[youshe]">智能护照制证平台</span>
    </div>
    <div class="flex justify-between px-5.5vw pt-2.5vh text-1vw">
      <span>网络状态：{{ isConnect }}</span>
      <span>{{ currentTime }}</span>
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
  background: url('@/assets/image/bg_topBar.png') no-repeat center;
  background-size: cover;
}
</style>
