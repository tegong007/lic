<template>
  <div
    class="bg h-100vh w-full flex flex-col items-center text-[18px] text-white"
  >
    <bigScreenHeader title="设置" class="h8vh" />
    <div class="h-100% w-full flex flex-col text-white">
      <div class="bg-color m-x-4em h-87% flex border-[4px] border-[#3F89DD]">
        <div class="wh-full border-l-[4px] border-[#3F89DD]">
          <!-- <section
            v-if="currentModel === 'sort'"
            class="wh-full flex flex-col flex-1"
          >
            <Sort />
          </section> -->

          <!-- <section v-if="currentModel === '1'">
            <Print />
          </section> -->
          <section
            v-if="currentModel === '2'"
            class="scoll-bar box-border wh-full flex flex-col flex-1"
          >
            <Set :current-model="currentModel" />
          </section>
        </div>
      </div>
    </div>
    <div
      class="groupBtn absolute bottom-1vh h8em w-full flex items-center justify-center gap-20"
    >
      <div class="flex gap-20">
        <TheButton
          title="返回首页"
          @click="
            () => {
              setCurrentModel('0');
              $goto('BigScreen');
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import TheButton from '@/components/base/TheButton.vue';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import Set from './set.vue';

definePage({
  name: 'Setting',
  meta: {
    title: '设置页',
  },
});
const route = useRoute();
const currentModel = ref<string>('2');
// const isProduce = ref<boolean>(false);
// const options = ref([
// { label: `软件设置`, value: 'sort' },
// { label: `模块设置`, value: '2' },
// { label: `加注页打印模块`, value: '3' },
// { label: `整机`, value: '0' },
// { label: `空白本校验`, value: '0' },
// { label: `主副页设置`, value: '2' },
// { label: `加注页设置`, value: '3' },
// { label: `成本证本收集`, value: '3' },
// { label: `模块测试`, value: '4' },
// ]);
function setCurrentModel(value: string) {
  currentModel.value = value;
}
onActivated(() => {
  nextTick(() => {
    const query = route.query;
    currentModel.value = query.currentModel;
  });
});
</script>

<style scoped lang="less">
.bg {
  background-image: url('@/assets/image/bigScreen/bg-none.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
  .bg-color {
    background: linear-gradient(
      359deg,
      rgba(255, 255, 255, 0.1885) 0%,
      rgba(255, 255, 255, 0.29) 33%,
      rgba(0, 142, 255, 0.29) 98%
    );
  }
}
.returnBtn {
  background-image: url('@/assets/image/bigScreen/returnBtn.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
}
.ant-radio-button-wrapper:first-child {
  border-inline-start: 0px solid #d9d9d9;
  border-start-start-radius: 0px;
  border-end-start-radius: 0px;
}
.ant-radio-button-wrapper:last-child {
  border-inline-start: 0px solid #d9d9d9;
  border-start-start-radius: 0px;
  border-end-start-radius: 0px;
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  z-index: 1;
  color: #ffffff;
  background: #ffffff2c;
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
