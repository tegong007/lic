<template>
  <div class="bg h-100vh flex flex-col items-center text-[18px] text-white">
    <bigScreenHeader title="错误详情" />

    <main
      class="absolute top-100 h-full max-h-1550px w-full flex flex-col p-x-60"
    >
      <!-- <span>模组一结构图</span> -->

      <div class="relative h-full flex flex-col gap-10 pb10">
        <span
          class="from-blue-500 to-purple-500 bg-gradient-to-r bg-clip-text text-[1.2vh] text-transparent font-bold"
        >
          模组一结构图
        </span>
        <div class="absolute">
          <CanvasComponent
            :width="960"
            :height="350"
            :top="45"
            :left="0"
            :rectangles="rectangles"
            :ShowImage="ShowImage"
          />
        </div>
        <img
          class="h-350px w-full"
          src="@/assets/image/bigScreen/error/m1/m1.png"
        >

        <span
          class="from-pink-500 to-purple-500 bg-gradient-to-r bg-clip-text text-[1.1vh] text-transparent font-bold"
        >错误信息：如果要显示总体的错误信息就在这里显示可能有很多行，如果要显示总体的错误信息就在这里显示可能有很多行如果要显示总体的错误信息就在这里显示可能有很多行如果要显示总体的错误信息就在这里显示可能有很多行如果要显示总体的错误信息就在这里显示可能有很多行如果要显示总体的错误信息就在这里显示可能有很多行</span>
        <div class="scoll-bar mt-10 flex flex-col gap-20">
          <component
            :is="components[rect.id]"
            v-for="rect in rectangles"
            :key="rect.id"
            :name="rect.id"
            :show-image="ShowImage"
            :show-list="showList"
          />
        </div>
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
        <TheButton
          title="返回首页"
          @click="
            () => {
              showList = [];
              $goto('BigScreen');
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import CanvasComponent from '@/components/canvas/modules.vue';

const components = {
  M1_TURN1_JOB: defineAsyncComponent(() => import('./M1_TURN1_JOB.vue')),
  M1_TURN2_JOB: defineAsyncComponent(() => import('./M1_TURN2_JOB.vue')),
};
const route = useRoute();
const showList = ref([]);
const rectangles = ref([
  {
    id: 'M1_TURN1_JOB',
    x: 520,
    y: 170,
    width: 80,
    height: 180,
    opacity: 0.4,
  },
  {
    id: 'M1_TURN2_JOB',
    x: 440,
    y: 170,
    width: 80,
    height: 180,
    opacity: 0.4,
  },
]);

// 查看原图
async function ShowImage(Id: any, key: string) {
  console.log('🚀 ~ ShowImage ~ Id:', Id);
  if (key === 'show')
    showList.value.push(Id);
  else showList.value = showList.value.filter((item: any) => item !== Id);
}

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
::v-deep.scoll-bar {
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  // border-left: 3px solid #7ff3fd;
}
::-webkit-scrollbar-thumb {
  // background-color: #ffffff38;
  background-color: #ffffff69;
  border-radius: 5px;
}
</style>
