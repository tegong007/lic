<template>
  <div class="table-wrap">
    <div class="titleContent w-full">
      <div class="tit">
        序号
      </div>
      <div class="tit">
        证本号
      </div>
      <div class="tit">
        状态
      </div>
      <div class="tit">
        更新时间
      </div>
    </div>

    <!-- 配置详情请见 README.md -->
    <Vue3SeamlessScroll
      :list="props.data"
      class="scroll"
      direction="up"
      :step="0.3"
      :hover="true"
      :limit-scroll-num="6"
      :is-watch="true"
      :single-height="0"
      :single-width="0"
    >
      <div v-for="(item, i) in props.data" :key="i" class="countContent w-full">
        <div class="descr">
          {{ item.seq }}
        </div>
        <div class="descr">
          {{ item.docID }}
        </div>
        <div class="descr">
          {{ item.workingStatus }}
          <!-- {{ getWorkstationName(item.position) }} -->
        </div>
        <div class="descr">
          {{ item.time }}
        </div>
      </div>
    </Vue3SeamlessScroll>
  </div>
</template>

<script setup lang="ts">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
// import { getWorkstationName } from '@/utils/workstationDefinitions';

const props = defineProps({
  data: Array,
});

// 如果需要在某个时刻停止定时器，可
</script>

<style lang="scss" scoped>
.table-wrap {
  // width: 100%;
  // padding: 0 20px;
  border: 3px solid #7ff3fd; /* 设置边框 */

  color: #ffffff;
  .scroll {
    max-height: 150px;
    // min-height: 145px;
    min-height: 18.5vh;
    overflow: hidden;
  }
}
.titleContent {
  display: flex;
  align-items: center;
  border-bottom: 3px solid #7ff3fd; /* 底部边框 */
  // justify-content: space-between;
  // height: 40px;
  .tit {
    flex: 1;
    padding: 2px 0;
    // flex: 0 16.6%;
    text-align: center;
    border-right: 3px solid #7ff3fd;
    // background: linear-gradient(229deg, rgba(144, 236, 255, 0.65) 0%, rgba(0, 106, 245, 0.06) 57%);
    background-color: rgb(255 255 255 / 0.2);
    white-space: nowrap;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 限制在3行内 */
    text-overflow: ellipsis; /* 超出部分显示为... */
    // border: 2px solid red;
  }
  .tit:first-child {
    // border-right: none; /* 最后一个元素不显示右侧边框 */
    flex: 0.5;
  }
  .tit:nth-child(2) {
    flex: 1.5;
  }
  .tit:nth-child(3) {
    flex: 1.6;
  }
  .tit:last-child {
    border-right: none; /* 最后一个元素不显示右侧边框 */
    flex: 2;
  }
}

.countContent {
  display: flex;
  // flex-wrap: wrap;
  text-align: center;
  width: 100%;
  // font-size: 1vh;
  .descr {
    padding: 2px 0;
    border-right: 3px solid #7ff3fd;
    border-bottom: 3px solid #7ff3fd;
    flex: 1;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    white-space: nowrap;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 限制在3行内 */
    text-overflow: ellipsis; /* 超出部分显示为... */
  }
  .descr:first-child {
    // border-right: none; /* 最后一个元素不显示右侧边框 */
    flex: 0.5;
  }

  .descr:nth-child(2) {
    flex: 1.5;
  }
  .descr:nth-child(3) {
    flex: 1.6;
  }
  .descr:last-child {
    border-right: none; /* 最后一个元素不显示右侧边框 */
    flex: 2;
  }
}
// .countContent:nth-of-type(odd) {
//   background: #318699 !important;
//   .descr {
//     // border-right: 1px solid #247587;
//   }
// }
</style>
