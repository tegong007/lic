<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-center">
      <!-- <span class="text-[38px] color-[#fff] line-height-[40px] font-[youshe]">智能护照制证平台</span> -->
    </div>
    <div class="w-full flex items-center justify-center">
      <span class="text-[2.2em] line-height-[40px] font-[youshe]">{{
        props.title
      }}</span>
    </div>

    <a-flex
      justify="space-between"
      align="center"
      class="absolute top-0 w-full p-x-5vh p-t-0vh text-[24px] color-[#CFDEF1]"
    >
      <span class="light relative">{{ t('bigScreen.header.6bypeg2hkjo1') + showConnect }}</span>
      <span class="light relative">{{ currentTime }}</span>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// import TheModal from '@/components/modal/TheModal.vue';
import { mainTainModule } from '@/apis/proApi';
// import useCustomTimer from '@/utils/useCustomTimer';
import { formatDateTime } from '@/utils/time';

const props = defineProps({
  title: String,
});
const { t } = useI18n();
// 时间展示
const timeId = ref(); // 用于控制定时器逻辑是否继续执行
const currentTime = ref('2024-12-18 14:37:23');
const showConnect = ref(t('bigScreen.header.6bypeg2hh240'));
async function getData() {
  try {
    // useAppStore().setSpinning(true);
    const data = await mainTainModule.getVersion({ type: 1 });
    if (data.code === 0) {
      showConnect.value = t('bigScreen.header.6bypeg2hkjo0');
    }
  }
  catch (error) {
    error;
    showConnect.value = t('bigScreen.header.6bypeg2hh240');
  }
}
async function startClick() {
  setInterval(() => {
    currentTime.value = formatDateTime();
  }, 1000);
  timeId.value = setInterval(() => {
    getData();
  }, 5000);
}
//  清除定时器
async function stopInterval() {
  if (timeId.value !== null) {
    clearInterval(timeId.value);
    timeId.value = null;
  }
}

onActivated(async () => {
  getData();
  startClick();
});
onDeactivated(() => {
  stopInterval();
});
</script>

<style scoped>
.light {
  text-shadow: 0px 0px 1px #ffffff;
}
</style>
