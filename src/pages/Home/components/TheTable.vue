<template>
  <div class="relative" :class="props.class">
    <div class="pt-2.5vh text-center text-1.3vw">{{ props.name }}</div>
    <div v-if="props.data && props.data.status > 1" class="absolute bottom-5vh left-0.8vw right-0.8vw top-1vh z-2 flex flex-col items-center justify-center" :class="`bgA${props.data.status}`">
      <div class="text-1.5vw">{{ props.data.status === 3 ? '故障' : props.data.status === 2 ? '警告' : '' }}</div>
      <div class="w-90% pt-0.5vh text-center text-1vw">{{ props.data.msg }}</div>
    </div>
    <div class="mx-auto mt-1.5vh w-90%">
      <Vue3SeamlessScroll :list="props.data ? props.data.periodDataList : []" class="h-13vh overflow-hidden" direction="up" :step="0.3" :hover="true" :limit-scroll-num="4" :is-watch="true" :single-height="0" :single-width="0">
        <div v-for="(item, i) in props.data ? props.data.periodDataList : []" :key="i" class="w-full flex">
          <div class="descr">{{ item.docID }}</div>
          <div class="descr">{{ item.workingStatus }}</div>
          <div class="descr">{{ item.time }}</div>
        </div>
      </Vue3SeamlessScroll>
    </div>
    <div class="mx-auto mt-1vh w-7vw cursor-pointer rounded-50px bg-#3662ec33 py-0.3vh text-center text-1vw transition-transform duration-300 hover:scale-105" @click="$goto('HomeStationPage', { key: props.count })">工位查看</div>
  </div>
</template>

<script setup lang="ts">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

const props = defineProps({ class: String, name: String, data: Object, count: Number });
</script>

<style scoped lang="less">
.bgM1,
.bgM2,
.bgM3 {
  width: 25vw;
  height: 27vh;
  margin: 3vh 2vw 0 2vw;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  .bgA2 {
    background: #ff8f1f99;
  }
  .bgA3 {
    background: #b4050599;
  }
  .descr {
    font-size: 0.9vw;
    margin: 0.6vh 0;
    overflow: hidden;
    white-space: nowrap;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    padding: 0 0.5vw;
    &:first-child {
      flex: 0.8;
      text-align: left;
      padding-left: 0;
    }
    &:nth-child(2) {
      text-align: center;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #ffffff;
      flex: 1.2;
    }
    &:last-child {
      flex: 1.4;
      text-align: right;
      padding-right: 0;
    }
  }
}
.bgM1 {
  background-image: url('@/assets/image/bg_m1.png');
}
.bgM2 {
  background-image: url('@/assets/image/bg_m2.png');
}
.bgM3 {
  background-image: url('@/assets/image/bg_m3.png');
}
</style>
