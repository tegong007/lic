<template>
  <div class="bg h-100vh flex flex-col items-center text-[18px] text-white">
    <bigScreenHeader title="查询" />
    <div
      v-show="choose !== 0"
      class="absolute left-100 top-126 z-99 flex items-center justify-between text-16px"
    >
      <span>搜索类型：</span>
      <a-select v-model:value="choose" class="w130px" @change="changeChoose">
        <a-select-option :value="1">
          任务
        </a-select-option>
        <a-select-option :value="2">
          制证数据
        </a-select-option>
        <a-select-option :value="3">
          证本
        </a-select-option>
      </a-select>
    </div>

    <Task
      v-if="choose === 1"
      :choose="choose"
      :doc-task-id="docTaskId"
      :change-task-id-or-batch-id="changeTaskIdOrBatchId"
    />
    <Record
      v-if="choose === 2"
      :choose="choose"
      :change-task-id-or-batch-id="changeTaskIdOrBatchId"
      :doc-batch-id="docBatchId"
      :doc-task-id="docTaskId"
    />
    <PhysicalDoc
      v-if="choose === 3"
      :choose="choose"
      :change-task-id-or-batch-id="changeTaskIdOrBatchId"
      :doc-batch-id="docBatchId"
      :doc-task-id="docTaskId"
    />
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

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import bigScreenHeader from '@/components/bigScreen/header.vue';
import PhysicalDoc from './physicalDoc/index.vue';
import Record from './record/index.vue';
import Task from './task/index.vue';

const route = useRoute();
const choose = ref<number>(0);
const docBatchId = ref('');
const docTaskId = ref('');
onActivated(() => {
  nextTick(() => {
    const query = route.query;
    changeChoose(Number(query.choose));
  });
});
function changeChoose(value: number) {
  choose.value = value;
  changeTaskIdOrBatchId(0, '', '');
}
function changeTaskIdOrBatchId(
  value?: number,
  taskId?: string,
  batchId?: string,
) {
  if (value) {
    choose.value = value;
  }
  docTaskId.value = taskId;
  docBatchId.value = batchId;
}
onDeactivated(() => {
  // 清空筛选
  choose.value = 0;
});
</script>

<style scoped lang="less">
.bg {
  background-image: url('@/assets/image/bigScreen/bg-none.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
  user-select: none;
}
</style>
