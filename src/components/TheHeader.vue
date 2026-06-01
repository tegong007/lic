<template>
  <div class="bgHeader relative m-auto h-7.5vh w-100vw">
    <div class="mt--2.5vh px-2vw text-2.2vw">
      <div class="relative top--0.6vh flex items-center justify-between">
        <span>网络状态：{{ isConnect }}<span v-if="account !== ''">【用户:{{ account }}】</span>
        </span>
        <span>{{ currentTime }}</span>
      </div>
    </div>
    <div class="absolute top-0.4vh w-full text-center">
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
const account = ref('');
async function getData() {
  try {
    const data: any = await defendModule.getVersion({ type: 1 });
    if (data.code === 0) isConnect.value = '已连接';
  } catch {
    isConnect.value = '未连接';
  }
}

onMounted(async () => {
  // 先清空account
  localStorage.removeItem('account');
  setInterval(() => {
    currentTime.value = formatDateTime();
    const user = localStorage.getItem('account');
    // 用缓存获取用户名
    if (user) {
      account.value = user;
    }
  }, 1000);
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
