<template>
  <div class="absolute w-full font-[siyuan]">
    <div class="absolute left-0 right-0 mx-auto w-30% text-center">
      <span class="text-3.4vw line-height-9.5vh font-[youshe]">智能护照制证平台</span>
    </div>
    <a-flex justify="space-between" class="top-0 w-full px-80 pt-0.5vh text-1.25vw">
      <span class="w-30w">网络状态：{{ isConnect }}</span>
      <div class="flex items-center gap-1vw">
        <span>{{ currentTime }}</span>
        <img class="h-3.5vh cursor-pointer hover:scale-105" src="@/assets/image/btn_exit.png" @click="openModal(true)" />
      </div>
    </a-flex>
  </div>
  <TheExit v-if="exitShow" :open="exitShow" :handle-ok="() => openModal(false)" :handle-cancel="() => openModal(false)" title="系统关机" />
</template>

<script lang="ts" setup>
import { defendModule } from '@/apis/proApi';
import TheExit from '@/components/TheExit.vue';
import { formatDateTime } from '@/utils/time';
import useCustomTimer from '@/utils/useCustomTimer';

const { start } = useCustomTimer();

const currentTime = ref(formatDateTime());
const isConnect = ref('--');
const exitShow = ref(false);

// 弹窗操作
function openModal(value: boolean) {
  exitShow.value = value;
}

async function getData() {
  try {
    const data: any = await defendModule.getVersion({ type: 1 });
    if (data.code === 0) isConnect.value = '已连接';
  } catch {
    isConnect.value = '未连接';
  }
}

onMounted(async () => {
  getData();
  start(() => {
    getData();
  }, 5);
  setInterval(() => {
    currentTime.value = formatDateTime();
  }, 500);
});
</script>
