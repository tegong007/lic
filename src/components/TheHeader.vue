<template>
  <div
    class="headerbg inline-block h-[66px] w-full flex items-center justify-between px-[25px]"
  >
    <div
      class="w-[120px] flex items-center justify-between text-[22px] font-bold"
    >
      <img src="/icon/icon.png" alt="" class="h-[22px]">
      <span>光墨匠人</span>
    </div>

    <a-space wrap>
      <a-button v-if="props.isShowTestBtn" @click="goModalTestPage">
        测试
      </a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import router from '@/router/index.ts';
// definePage({
//   name: "TestModal",
//   meta: {
//     title: "头部",
//   },
// });
const props = defineProps({
  isShowTestBtn: Boolean,
});

function goModalTestPage() {
  router.push({ name: 'TestModal' });
}
</script>

<style scoped>
.headerbg {
  background: linear-gradient(
    353deg,
    rgba(255, 255, 255, 0.1885) 36%,
    rgba(255, 255, 255, 0.29) 43%,
    rgba(0, 142, 255, 0.29) 57%
  );
  box-sizing: border-box;
  border: 1px solid #3f89dd;
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.25),
    inset 0px -1px 1px 0px rgba(255, 255, 255, 0.34);
  color: #fff;
}
</style>
