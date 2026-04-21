<template>
  <div v-if="actived >= 0" class="fixed bottom-2.5vh mt-3vh w-full flex justify-center">
    <div class="bgNav animation" :class="actived === 0 ? 'actived' : ''" @click="$goto('HomePage')">
      <span class="text-3vw">主页</span>
    </div>
    <div class="bgNav animation" :class="actived === 1 ? 'actived' : ''" @click="$goto('CheckPage')">
      <span class="text-3vw">机器视觉</span>
    </div>
    <div class="bgNav animation" :class="actived === 2 ? 'actived' : ''" @click="$goto('DefendPage')">
      <span class="text-3vw">设备维护</span>
    </div>
    <div class="bgNav animation" :class="actived === 3 ? 'actived' : ''" @click="$goto('SetPage')">
      <span class="text-3vw">设备设置</span>
    </div>
    <div class="bgNav animation" :class="actived === 4 ? 'actived' : ''" @click="$goto('SearchPage')">
      <span class="text-3vw">查询</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const actived = ref(-1);
watch(
  route,
  () => {
    if (route.path === '/home') actived.value = 0;
    else if (route.path === '/check') actived.value = 1;
    else if (route.path === '/defend') actived.value = 2;
    else if (route.path === '/set') actived.value = 3;
    else if (route.path === '/search') actived.value = 4;
    else actived.value = -1;
  },
  { deep: true },
);
</script>

<style scoped lang="less">
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 19.5vw;
  text-align: center;
  height: 2.8vh;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
</style>
