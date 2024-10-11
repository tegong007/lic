<script setup lang="ts">
defineOptions({ name: 'IndexPage' });

definePage({
  name: 'page-index',
  meta: {
    title: '首页',
  },
});

const formatted = useDateFormat(useNow(), 'HH:mm');
</script>

<template>
  <div class="bg wh-full flex-col">
    <!-- top -->
    <div class="flex items-center justify-between px-52 pb-10 pt-33">
      <!--  -->
      <div class="flex items-end justify-center">
        <div class="pl-20 text-0">
          <img src="@/assets/images/shouye/logo2.png" alt="" class="border-none">
        </div>
        <div class="pb-12 text-20 text-gray:50" style="line-height: normal;">
          <span>版本号: </span><span class="pl-6">1.0.0</span>
        </div>
      </div>
      <!--  -->
      <div v-show="!false" class="flex items-center justify-center gap-26">
        <div class="text-40 font-bold line-height-none">
          {{ formatted }}
          <!-- <span>{{ formatted }}</span> -->
        </div>
        <!-- color="#ffffff40" -->
        <n-button color="#ffffffba" text-color="#000" round size="large" style="--n-font-size: 26px;font-weight: bold;--n-height: 60px;--n-icon-size: 28px">
          <template #icon>
            <div class="text-0">
              <img src="@/assets/images/shouye/icon-setting.png" alt="">
            </div>
          </template>
          设置
        </n-button>
      </div>
    </div>
    <!-- content -->
    <div class="flex-1 px-47">
      <div class="grid grid-cols-4 grid-rows-3 wh-full">
        <div class="btn-bg-1 pos-relative wh-full">
          <div class="pos-absolute left-18 top-18">
            <div class="w-110 text-0">
              <img src="@/assets/images/shouye/btn-logo-1.png" alt="">
            </div>
          </div>
          <div class="pos-absolute bottom-32 right-20">
            <div class="flex-col gap-4 text-right text-31px text-#fff font-bold line-height-none">
              <div>重要实物</div>
              <div>出入库</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="h-48" />
  </div>
</template>
