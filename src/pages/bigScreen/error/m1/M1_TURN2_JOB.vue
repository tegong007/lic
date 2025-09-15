<template>
  <div id="M1_TURN2_JOB" class="w-full table">
    <div class="table-b1">
      <div class="text-white">
        翻页2工位
      </div>

      <div
        v-show="props.showList.includes(props.name)"
        class="arrow"
        @click="props.showImage(props.name, 'hide')"
      >
        收起<b>▲</b>
      </div>
      <div
        v-show="!props.showList.includes(props.name)"
        class="arrow"
        @click="props.showImage(props.name, 'show')"
      >
        展开<b>▼</b>
      </div>
    </div>
    <div
      v-show="showList.includes(props.name)"
      class="table-b2 flex flex-col gap-20 p-1vh"
    >
      <div class="table-b2-img-box max-h-15vh w-full flex justify-around">
        <a-badge-ribbon text="角度1">
          <img
            class="wh-full"
            src="@/assets/image/bigScreen/error/m1/M1-TURN1-JOB-1.png"
            alt=""
          >
        </a-badge-ribbon>

        <a-badge-ribbon text="角度2">
          <img
            class="wh-full"
            src="@/assets/image/bigScreen/error/m1/M1-TURN1-JOB-2.png"
            alt=""
          >
        </a-badge-ribbon>
      </div>
      <div class="color-red">
        当前错误信息：错误信息错误信息错误信息错误信息错误信息错误信息错误，信息错误信息错误信息错误信息错误信息错误信息错误信息，错误信息。
      </div>
      <div class="actions flex flex-col">
        <a-row>
          <a-col :span="16">
            <span>快捷操作</span>
          </a-col>
          <a-col :span="8">
            <span>抓本电机操作</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16" class="flex gap-30">
            <a-button class="btn" type="primary">
              初始化
            </a-button>
            <a-button class="btn" type="primary">
              快捷抓本
            </a-button>
          </a-col>
          <a-col :span="8" class="flex gap-30">
            <a-button class="btn" type="primary">
              松本
            </a-button>
            <a-button class="btn" type="primary">
              夹本
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <span>底部真空吸盘操作</span>
          </a-col>
          <a-col :span="8">
            <span>下压电机操作</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16" class="flex gap-30">
            <a-button class="btn" type="primary">
              打开
            </a-button>
            <a-button class="btn" type="primary">
              关闭
            </a-button>
            <a-button class="btn" type="primary">
              上升
            </a-button>
            <a-button class="btn" type="primary">
              下降
            </a-button>
          </a-col>
          <a-col :span="8" class="flex gap-30">
            <a-button class="btn" type="primary">
              松本
            </a-button>
            <a-button class="btn" type="primary">
              夹本
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <span>顶部真空吸盘操作</span>
          </a-col>
          <a-col :span="8">
            <span>翻页杆</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16" class="flex gap-30">
            <a-button class="btn" type="primary">
              打开
            </a-button>
            <a-button class="btn" type="primary">
              关闭
            </a-button>
            <a-button class="btn" type="primary">
              上升
            </a-button>
          </a-col>
          <a-col :span="8" class="flex gap-30">
            <a-button class="btn" type="primary">
              回到初始位
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <span>错误处理</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16" class="flex gap-30">
            <a-button class="btn" type="primary">
              本已取走
            </a-button>
            <a-button class="btn" type="primary">
              错误处理完成
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: String,
  showList: Array,
  showImage: Function,
});
</script>

<style lang="less" scoped>
.table {
  clear: both;
  background-color: #0b111fb0;
  color: #cfdef1;
  position: relative;
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease; /* 添加动画效果 */
  opacity: 1; /* 初始透明度 */

  .table-b1 {
    background: url('@/assets/image/bg_titR.png') center;
    background-size: 100% 100%;
    font-size: 1.8vw;
    padding: 0.2vh 1.6vh;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;

    div:first-of-type {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 1.5vw;
    }
    .arrow {
      cursor: pointer;
      b {
        font-size: 1.4vw;
        margin-left: 0.5vw;
      }
    }
  }
  .table-b2 {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    .btn {
      border-radius: 6px;
      opacity: 1;
      background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
      box-sizing: border-box;
      border: 2px solid #89f7ff;
      // padding: 6px 20px;
      color: white;
      height: 40px;
      width: 120px;
    }
    .actions {
      .ant-row:nth-child(1) {
        margin-top: 0px !important;
      }
      .ant-row:nth-child(odd) {
        // background: #cfdef1;
        margin-top: 26px;
        margin-bottom: 10px;
      }
      span {
        font-size: 18px;
      }
    }
  }
}
.animated {
  transform: scale(0.98); /* 放大 20% */
  opacity: 0.8; /* 淡入效果 */
}
</style>
