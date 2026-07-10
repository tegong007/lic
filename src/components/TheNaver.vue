<template>
  <div class="ml-1vw mt-4vh">
    <template v-if="actived === 2">
      <div class="bgNav animation sp2" :class="actived2 === 1 ? 'actived' : ''" @click="$goto('DefendPage', { key: 1 })">
        <span>进本模块</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 2 ? 'actived' : ''" @click="$goto('DefendPage', { key: 2 })">
        <span>主副页打印模块</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 3 ? 'actived' : ''" @click="$goto('DefendPage', { key: 3 })">
        <span>加注页打印模块</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 4 ? 'actived' : ''" @click="$goto('DefendPage', { key: 4 })">
        <span>添加测试任务</span>
      </div>
      <!-- <div class="bgNav sp2 animation" :class="actived2 === 5 ? 'actived' : ''" @click="$goto('DefendPage', { key: 5 })">
        <span>工位操作</span>
      </div> -->
      <div class="bgNav sp2 animation" :class="actived2 === 6 ? 'actived' : ''" @click="$goto('DefendPage', { key: 6 })">
        <span>关于设备</span>
      </div>
    </template>
    <template v-else-if="actived === 5">
      <div class="bgNav sp2 animation" :class="actived2 === 2 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 2 })">
        <span>参数设置</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 1 ? 'actived' : ''" @click="$goto('CheckSelectPage', { key: 1 })">
        <span>质检记录</span>
      </div>
    </template>
    <template v-else-if="actived === 6">
      <div class="bgNav sp2 animation" :class="actived2 === 3 ? 'actived' : ''" @click="$goto('HomeStationPage', { key: 3 })">
        <span>加注页打印模块</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 2 ? 'actived' : ''" @click="$goto('HomeStationPage', { key: 2 })">
        <span>主副页打印模块</span>
      </div>
      <div class="bgNav sp2 animation" :class="actived2 === 1 ? 'actived' : ''" @click="$goto('HomeStationPage', { key: 1 })">
        <span>进本模块</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const actived = ref(-1);
const actived2 = ref(-1);

watch(
  route,
  () => {
    if (route.path === '/check-select') {
      actived.value = 5;
      actived2.value = Number(route.query.key) || 1;
    } else if (route.path === '/home-station') {
      actived.value = 6;
      actived2.value = Number(route.query.key) || 1;
    } else {
      actived.value = -1;
    }
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
  width: 9vw;
  text-align: center;
  height: 10.2vh;
  margin-bottom: 4.5vh;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
  span {
    font-size: 1.2vw;
  }
  &.sp2 {
    margin-bottom: 2vh;
    span {
      font-size: 1.1vw;
    }
  }
}
</style>
