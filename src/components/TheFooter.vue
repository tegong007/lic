<template>
  <div class="fixed bottom-1.5vh left-3vw w-full">
    <a-flex class="gap-1vw">
      <div v-if="link1.length" class="ink-group">
        <div class="text-0.7vw mb-0.2vh">主副页</div>
        <a-flex class="gap-0.3vw">
          <template v-for="(value, index) in link1" :key="`m1-${index}`">
            <div v-if="value.color" class="w-2.2vw text-center whitespace-nowrap">
              <div class="relative mx-auto h-4.5vh w-1.4vw border-1px border-gray-400 border-dashed">
                <div class="absolute bottom-0 w-100%" :style="{ height: `${value.count}%`, backgroundColor: value.color }"></div>
              </div>
              <span class="text-0.6vw">{{ value.name }}</span>
            </div>
          </template>
        </a-flex>
      </div>
      <div v-if="link2.length" class="ink-group">
        <div class="text-0.7vw mb-0.2vh">加注页</div>
        <a-flex class="gap-0.3vw">
          <template v-for="(value, index) in link2" :key="`m2-${index}`">
            <div v-if="value.color" class="w-2.2vw text-center whitespace-nowrap">
              <div class="relative mx-auto h-4.5vh w-1.4vw border-1px border-gray-400 border-dashed">
                <div class="absolute bottom-0 w-100%" :style="{ height: `${value.count}%`, backgroundColor: value.color }"></div>
              </div>
              <span class="text-0.6vw">{{ value.name }}</span>
            </div>
          </template>
        </a-flex>
      </div>
    </a-flex>
  </div>
  <div class="fixed bottom-1vh right-2.5vw">
    <a-flex justify="end">
      <div class="bgBtn transition-transform duration-300" :class="actived === 0 ? 'actived' : 'hover:scale-105'" @click="$goto('HomePage')">
        <span class="text-1.7vw line-height-5vh">主页</span>
      </div>
      <div class="bgBtn transition-transform duration-300" :class="actived === 1 ? 'actived' : 'hover:scale-105'" @click="$goto('CheckPage')">
        <span class="text-1.7vw line-height-5vh">机器视觉</span>
      </div>
      <div class="bgBtn transition-transform duration-300" :class="actived === 2 ? 'actived' : 'hover:scale-105'" @click="$goto('DefendPage')">
        <span class="text-1.7vw line-height-5vh">设备维护</span>
      </div>
      <div class="bgBtn transition-transform duration-300" :class="actived === 3 ? 'actived' : 'hover:scale-105'" @click="$goto('SetPage')">
        <span class="text-1.7vw line-height-5vh">设备设置</span>
      </div>
      <div class="bgBtn transition-transform duration-300" :class="actived === 4 ? 'actived' : 'hover:scale-105'" @click="$goto('SearchPage')">
        <span class="text-1.7vw line-height-5vh">查询</span>
      </div>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { footerModule } from '@/apis/proApi';
import useCustomTimer from '@/utils/useCustomTimer';

const route = useRoute();
const { start } = useCustomTimer();

const actived = ref(-1);
const link1: any = ref([]);
const link2: any = ref([]);
const color: any = { Y: '#ffff00', M: '#ff00ff', C: '#00ffff', K: '#000000', O: '#979797' };

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

async function getData() {
  try {
    const data: any = await footerModule.getLnkRemainder();
    link1.value = [];
    link2.value = [];
    if (data.respData && data.respData[0]?.inkObjects) {
      data.respData[0].inkObjects.forEach((element: any) => {
        link1.value.push({ name: element.inkName, count: element.remainder, color: color[element.inkCode] || '' });
      });
    }
    if (data.respData && data.respData[1]?.inkObjects) {
      data.respData[1].inkObjects.forEach((element: any) => {
        link2.value.push({ name: element.inkName, count: element.remainder, color: color[element.inkCode] || '' });
      });
    }
  } catch {
    link1.value = [];
    link2.value = [];
  }
}

onMounted(() => {
  getData();
  start(() => {
    getData();
  }, 5);
});
</script>

<style scoped lang="less">
.bgBtn {
  background-image: url('@/assets/image/bg_btn.png');
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 13vw;
  text-align: center;
  height: 7vh;
  &.actived {
    background-image: url('@/assets/image/bg_btnA.png');
    cursor: default;
  }
}
</style>
