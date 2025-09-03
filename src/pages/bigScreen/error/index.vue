<template>
  <div class="bg h-100vh flex flex-col items-center text-[18px] text-white">
    <bigScreenHeader title="错误详情" />
    <main class="absolute top-100 h-20px h-full w-full flex flex-col p-x-60">
      <!-- <span>模组一结构图</span> -->
      <div class="pb10">
        <span
          class="from-pink-500 to-purple-500 bg-gradient-to-r bg-clip-text text-[40px] text-transparent font-bold"
        >
          模组一结构图
        </span>
      </div>
      <!-- <vxe-image mask-closable :src="model1" :append-to-body="true" /> -->
    </main>
    <div
      class="groupBtn absolute bottom-4vh h8em w-full flex items-center justify-center gap-20"
    >
      <!-- <div class="flex">
        <TheButton title="批次查询" />
      </div> -->
      <!-- <span class="h-50% w-2px bg-[#8BB2FF]" /> -->
      <div class="flex gap-20">
        <TheButton title="返回首页" @click="$goto('BigScreen')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import bigScreenHeader from '@/components/bigScreen/header.vue';

const route = useRoute();
onActivated(() => {
  nextTick(() => {
    const query = route.query;
    console.log('🚀 ~ query:', query);
  });
});
</script>

<style lang="less" scoped>
.siyuan {
  font-family: 'siyuan';
}
.bg {
  background-image: url('@/assets/image/bigScreen/bg-none.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
  .light {
    text-shadow: 0px 0px 8px #ffffff;
  }
  // .machine{
  //     background-image: url("../../assets/image/bigScreen/machine.png");
  // background-size: 100% 100%;
  // background-repeat: "no-repeat";
  // }
  .groupBtn {
    div {
      background-size: 100% 100%;
      background-repeat: 'no-repeat';
    }
  }
}
</style>
