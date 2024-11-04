<template>
  <div v-for="(item, index) in props.flowData" :key="index">
    <main v-if="item.error === true">
      <div class="mt-[20px] color-[#ff4d4f] leading-[55px]">
        ******↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*****出错了，请联系管理员
        *****↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓******
      </div>
    </main>
    <main v-else-if="item.stop === true">
      <div class="mt-[20px] color-[#ff4d4f] leading-[55px]">
        ******↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*****用户手动停止
        *****↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓******
      </div>
    </main>
    <main v-else>
      <!-- 结束线 -->
      <div
        v-if="item.status === 'M6-Product'"
        class="mt-[20px] color-gray leading-[55px]"
      >
        ******↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*****已完成以下证本打印流程*****↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓******
      </div>
      <!-- 内容 -->
      <div class="pl-[40px]">
        <span>
          {{ item.time }} 证本已到达【{{ statusTypes[item.status] }}】
        </span>
        <span v-if="item.ocrData && isIncludes(item.status, 'Camera')">证本已完成OCR识别，结果：<span class="text-amber-100">【{{ item.ocrData }}】</span>
        </span>
        <div>
          <span v-if="item.readerData && isIncludes(item.status, 'readerData')">证本已完成芯片读取，数据：<span class="text-amber-100">【{{ item.readerData }}】</span>
          </span>
        </div>

        <div
          v-if="item.imgData && isIncludes(item.status, 'Camera')"
          class="py-[10px]"
        >
          <a-image
            :width="200"
            :src="`data:image/png;base64,${item.imgData}`"
          />
        </div>
      </div>
      <!-- 分割线 -->
      <div
        v-if="item.showDivider "
        class="leading-[55px]"
      >
        *********************************************{{
          item.showDivider
        }}**************************************************
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineExpose } from 'vue';

interface T {
  time?: string;
  ocrData?: string;
  readerData?: string;
  status: string;
  imgData?: string;
  error?: boolean; // 任务失败的标识
  showDivider?: string; // 分界线的标识
  stop?: boolean;// 用户手动停止
}
const props = defineProps({
  flowData: Array<T>,
});
const statusTypes = {
  'M1-Warehouse': '模组一卡仓位',
  'M1-Ready': '模组一发证位',
  'M1-Camera': '模组一摄像位',
  'M2-Reader-1': '模组二读写位1',
  'M2-Reader-2': '模组二读写位2',
  'M2-Reader-3': '模组二读写位3',
  'M2-Obsolete': '模组二废本槽',
  'M2-Laser-1': '模组二激光位1',
  'M2-Laser-2': '模组二激光位2',
  'M2-Laser-3': '模组二激光位3',
  'M2-Camera': '模组二摄像位', // 第一次
  'M3-Reader-1': '模组三读写位1',
  'M3-Reader-2': '模组三读写位2',
  'M3-Reader-3': '模组三读写位3',
  'M3-Laser-1': '模组三激光位1',
  'M3-Laser-2': '模组三激光位2',
  'M3-Laser-3': '模组三激光位3',
  'M3-UV-1': '模组三喷墨位1', // 第二次
  'M3-UV-2': '模组三喷墨位2', // 第二次
  'M3-UV-3': '模组三喷墨位3', // 第二次
  'M3-Camera': '模组三摄像位', // 第三次
  'M4-Turn': '模组四翻页器',
  'M5-Reader-1': '模组五读写位1',
  'M5-Reader-2': '模组五读写位2',
  'M5-Reader-3': '模组五读写位3',
  'M5-UV-1': '模组五喷墨位1', // 第二次
  'M5-UV-2': '模组五喷墨位2', // 第二次
  'M5-UV-3': '模组五喷墨位3', // 第二次
  'M5-Camera': '模组五摄像位',
  'M6-Reader-1': '模组六读写位1',
  'M6-Reader-2': '模组六读写位2',
  'M6-Reader-3': '模组六读写位3',
  'M6-Product': '模组六成品槽', // 结束
  'M6-Obsolete': '模组六废品槽',
};
//  判断状态
function isIncludes(status: string, name: string) {
  // 摄像头
  if (name === 'Camera') {
    return status.includes('Camera');
  }
  else if (name === 'readerData') {
    return status.includes('Reader');
  }
}

function someMethod() {
  console.log('Method called from ChildComponent');
}

defineExpose({
  someMethod,
});
</script>
