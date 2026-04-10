<template>
  <div class="relative" :class="props.class">
    <div class="bgHome_tit mx-auto mt-2vh w-9vw pt-0.5vh text-center font-bold">{{ props.name }}</div>
    <div v-if="props.data && props.data.status > 1" class="absolute bottom-10vh left-0.5vw right-0.5vw top-8vh z-2 flex flex-col items-center justify-center" :class="`bgA${props.data.status}`">
      <div class="text-1.3vw">{{ props.data.status === 3 ? '故障' : props.data.status === 2 ? '警告' : '' }}</div>
      <div class="w-92% pt-1vh text-center text-0.8vw">{{ props.data.msg }}</div>
    </div>
    <div class="mx-auto mt-4vh w-92%">
      <Vue3SeamlessScroll :list="props.data ? props.data.periodDataList : []" class="h-14.5vh overflow-hidden" direction="up" :step="0.3" :hover="true" :limit-scroll-num="4" :is-watch="true" :single-height="0" :single-width="0">
        <div v-for="(item, i) in props.data ? props.data.periodDataList : []" :key="i" class="w-full flex text-0.6vw">
          <div class="descr w-25%">{{ item.docID }}</div>
          <div class="descr w-45%">{{ item.workingStatus }}</div>
          <div class="descr w-30%">{{ item.time }}</div>
        </div>
      </Vue3SeamlessScroll>
    </div>
    <div class="ransition-transform absolute bottom-4vh left-0 right-0 mx-auto w-6vw cursor-pointer rounded-50px bg-#3662ec33 py-0.3vh text-center text-0.8vw duration-300 hover:scale-105" @click="$goto('HomeStationPage', { key: props.count })">工位查看</div>
  </div>
</template>

<script setup lang="ts">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

const props = defineProps({ class: String, name: String, data: Object, count: Number });
</script>

<style scoped lang="less">
.bgHome_tit {
  background: url('@/assets/image/bg_navItem.png') no-repeat;
  background-size: cover;
}
.bgA2 {
  background: #ff8f1f99;
}
.bgA3 {
  background: #b4050599;
}
</style>
