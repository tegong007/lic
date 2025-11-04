<template>
  <div class="scoll-bar box-border h-100% w-full p-r-10">
    <!-- <section class="mt10 box-border h-30px flex items-center gap-10">
      <div
        class="box-border inline-block h-full w30px flex items-center justify-center border-2 border-[#89F7FF] bg-[#ffffff17]"
        @click="changeAllCheck"
      >
        <img
          src="@/assets/image/bigScreen/btn/checkbox.svg"
          class="h70% w80% bg-[#89F7FF]"
          :class="isAllCheck ? '' : 'hidden'"
        />
      </div>
      <div class="h-full flex flex-1 items-center justify-between p-l-5">
        <span>{{t('task.card.6byojamh4kc0')}}</span><span>已选中：{{ checkRow.length }}个</span>
      </div>
    </section> -->
    <a-result
      v-if="items.length === 0"
      class=""
      :title="t('task.card.6byojamh8jk0')"
    />
    <section
      v-for="item in items"
      :key="item"
      class="mb20 box-border flex items-center gap-10 text-[16px]"
    >
      <div
        class="bg-color relative box-border h-full flex flex-col flex-1 justify-start border-4 border-[#3F89DD] p-10 text-[16px] line-height-35"
        :class="item.checked === true && 'border-[#64CF44]'"
        @click="changeItemCheck(item, item.checked)"
      >
        <img
          v-if="item.checked === true"
          src="@/assets/image/bigScreen/choose-right.png"
          class="absolute right-0 top-0 w-3vh"
        >
        {{ t('task.card.6byot18vaag0') + item.seq }}<br>
        <main class="p-x-3vh">
          <div class="w-full flex justify-between">
            <!-- <a
              class="color-[#89F7FF]"
              @click="props.changeTaskIdOrBatchId(1, items.taskID)   event.stopPropagation();"
              >任务号：{{ item.taskID }}</a
            > -->
            <span>{{ t('task.card.6byot18vgvk0') + item.taskID }}</span>
            <span>{{ t('task.card.6byot18vh800') + item.batchID }}</span>
            <span>{{ t('task.card.6byot18vhek0') + item.docNum }}</span>
            <span>{{ t('task.card.6byot18vhmg0') + item.receiveTime }}</span>
            <span>{{ t('task.card.6byot18vhxc0') + item.startTime }}</span>
          </div>
          <div class="w-full flex justify-between">
            <span>{{ t('task.card.6byot18vi2s0') + item.productNum }}</span>
            <span>{{ t('task.card.6byot18vi5s0') + item.obsoleteNum }}</span>
            <span>{{ t('task.card.6byot18vic00') + item.waitingNum }}</span>
            <span>{{ t('task.card.6byot18vih40') + item.hangUpNum }}</span>
            <span>{{
              t('task.card.6byot18vio00') + formatterStatus(item.status)
            }}</span>
          </div>
          <a-space
            :size="10"
            class="absolute right-10 top-10 flex justify-start"
          >
            <!-- <a-space :size="10" class="mt10 w-full flex justify-start"> -->
            <a-button
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.changeTaskIdOrBatchId(2, item.taskID);
                  event.stopPropagation();
                }
              "
            >
              {{ t('task.card.6byojamh95s0') }}
            </a-button>
            <a-button
              v-if="item.waitingNum !== 0"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(0, item.taskID);
                  event.stopPropagation();
                }
              "
            >
              {{ t('task.card.6byojamh9cw0') }}
            </a-button>
            <a-button
              v-if="item.hangUpNum !== 0"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(1, item.taskID);
                  event.stopPropagation();
                }
              "
            >
              {{ t('task.card.6byojamh9t00') }}
            </a-button>
          </a-space>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { TaskStatusOptions } from '@/pages/bigScreen/batch/option.ts';

const props = defineProps({
  items: Array,
  checkRow: Array,
  oldCheckedRow: Array,
  setCheckRow: Function,
  changeTaskIdOrBatchId: Function,
  rowfun: Function,
});
const { t } = useI18n();
const items = ref([]);

// const isAllCheck = ref<boolean>(false);
// function changeAllCheck() {
//   isAllCheck.value = !isAllCheck.value;
//   items.value?.map((item) => {
//     item.checked = isAllCheck.value;
//     return item;
//   });
// }
function changeItemCheck(item: object) {
  item.checked = !item.checked;
}
function formatterStatus(cellValue) {
  const item = TaskStatusOptions.find(item => item.value === cellValue);
  return item ? item.label : cellValue;
}
watch(
  () => props.items,
  () => {
    items.value = props.items;
  },
  { deep: true, immediate: true },
);
watch(
  items,
  (newItems) => {
    // 加上翻页数据的新选中数据
    // 创建一个 Map，以 groupID 为键，存储 oldCheckedRow 中的项
    const oldCheckedMap = new Map(
      props.oldCheckedRow.map(item => [item.taskID, item]),
    );

    // 遍历 newItems，处理重复项和新增项
    const resultArray: unknown[] = [];
    newItems.forEach((item) => {
      if (item.checked === false) {
        // 如果 newItems 中的 checked 为 false，删除 oldCheckedMap 中对应的条目
        oldCheckedMap.delete(item.taskID);
      }
      else if (item.checked === true) {
        // 如果 newItems 中的 checked 为 true，保留该条目
        oldCheckedMap.set(item.taskID, item); // 更新或添加到 Map 中
      }
    });

    // 将 Map 中剩余的项（未被删除的）加入结果数组
    oldCheckedMap.forEach((item) => {
      if (item.checked) {
        // 确保只添加 checked 为 true 的条目
        resultArray.push(item);
      }
    });

    // 重新打钩
    newItems.forEach((sourceItem, index) => {
      const targetItem = resultArray.find(
        item => item.taskID === sourceItem.taskID,
      );
      if (targetItem) {
        newItems[index] = targetItem; // 直接替换
      }
    });
    // 当页勾选的数据=页数，即全选
    // isAllCheck.value =
    //   newItems.length && newItems.every((item) => item?.checked);
    props.setCheckRow(resultArray);
  },

  { deep: true },
); // 使用 deep 选项来深度监听数组内部的变化
</script>

<style lang="scss" scoped>
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
::v-deep(.ant-result-title) {
  color: #fff;
}
.bg-color {
  background: linear-gradient(
    359deg,
    rgba(255, 255, 255, 0.1885) 0%,
    rgba(255, 255, 255, 0.29) 33%,
    rgba(0, 142, 255, 0.29) 98%
  );
}
</style>
