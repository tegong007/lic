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
        <span>全选</span><span>已选中：{{ props.checkRow?.length }}个</span>
      </div>
    </section> -->
    <a-result v-if="items.length === 0" class="" title="暂无数据" />
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
        序号：{{ item.seq }}<br>
        <main class="p-x-3vh">
          <div class="w-full flex justify-between">
            <a
              class="color-[#89F7FF]"
              @click="
                (event) => {
                  props.changeTaskIdOrBatchId(1, item.taskID);
                  event.stopPropagation();
                }
              "
            >所属任务号：{{ item.taskID }}</a>
            <span>所属批次号：{{ item.batchID }}</span>
            <span>证本号：{{ item.docID }}</span>
            <span>开始时间：{{ item.startTime }}</span>
          </div>
          <div class="w-full flex justify-between">
            <span>证件类型：{{ formatterValue(item.idType, 'idType') }}</span>
            <span>证本类型：{{ formatterValue(item.type, 'type') }}</span>
            <span>状态：{{ formatterValue(item.docStatus, 'docStatus') }}</span>
            <span>当前工位：{{ item.position }}</span>
            <span>更新时间：{{ item.endTime }}</span>
          </div>
          <!-- <div class="w-full flex justify-between">
            <span>开始时间：{{ item.startTime }}</span>
            <span>更新时间：{{ item.endTime }}</span>
          </div> -->
          <a-space
            :size="10"
            class="absolute right-10 top-10 flex justify-start"
          >
            <a-button
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.setDetai(item);
                  event.stopPropagation();
                }
              "
            >
              查看更多
            </a-button>
            <a-button
              v-if="item.docStatus === 1"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(0, item.docSN);
                  event.stopPropagation();
                }
              "
            >
              挂起
            </a-button>
            <a-button
              v-if="item.docStatus === 2"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(1, item.docSN);
                  event.stopPropagation();
                }
              "
            >
              恢复生产
            </a-button>
            <a-button
              v-if="item.docStatus === 0 || item.docStatus === 4"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(2, item.docSN);
                  event.stopPropagation();
                }
              "
            >
              设为成功
            </a-button>
            <a-button
              v-if="item.docStatus === 0 || item.docStatus === 3"
              class="color-[#0c79c4] font-semibold"
              @click="
                (event) => {
                  props.rowfun(3, item.docSN);
                  event.stopPropagation();
                }
              "
            >
              设为失败
            </a-button>
          </a-space>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { findLabelByValue } from '@/pages/bigScreen/batch/option.ts';

const props = defineProps({
  items: Array,
  checkRow: Array,
  oldCheckedRow: Array,
  setCheckRow: Function,
  changeTaskIdOrBatchId: Function,
  rowfun: Function,
  setDetai: Function,
});

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
function formatterValue(cellValue, type) {
  switch (type) {
    // case 'position':
    //   return getWorkstationName(cellValue);
    case 'type':
      return findLabelByValue('docTypesOptions', cellValue);
    case 'idType':
      return findLabelByValue('idTypesOptions', cellValue);
    case 'docStatus':
      return findLabelByValue('docStatusOptions', cellValue);
    case 'cnObsvType':
      return findLabelByValue('cnObsvTypeOptions', Number(cellValue));
    case 'dispatchUnit':
      return findLabelByValue('dispatchUnitOptions', cellValue);
    case 'isTeam':
      return findLabelByValue('teamOptions', cellValue);
    case 'dataSource':
      return findLabelByValue('dataSourceOptions', cellValue);
    // case 'urgentType':
    //   return findLabelByValue('urgencyOptions', cellValue);
    default:
      break;
  }
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
      props.oldCheckedRow.map(item => [item.docSN, item]),
    );

    // 遍历 newItems，处理重复项和新增项
    const resultArray: unknown[] = [];
    newItems.forEach((item) => {
      if (item.checked === false) {
        // 如果 newItems 中的 checked 为 false，删除 oldCheckedMap 中对应的条目
        oldCheckedMap.delete(item.docSN);
      }
      else if (item.checked === true) {
        // 如果 newItems 中的 checked 为 true，保留该条目
        oldCheckedMap.set(item.docSN, item); // 更新或添加到 Map 中
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
        item => item.docSN === sourceItem.docSN,
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
