<template>
  <div
    class="headerbg inline-block h-[66px] w-full flex items-center justify-between px-[25px]"
  >
    <div class="flex items-center justify-between text-[22px] font-bold">
      <img src="/icon/icon.png" alt="" class="h-[22px]">
      <span class="ml-[0.5em]"> {{ $t("header.proName") }}</span>
    </div>

    <a-space wrap>
      <!-- <a-button type="primary" danger>退出系统</a-button> -->
      <a-button v-if="props.isShowTestBtn" @click="goModalTestPage">
        <!-- 测试 -->
        <span class="text-[14px]">{{ $t("header.test") }}</span>
      </a-button>
      <a-button type="primary" danger @click="showQuitModal">
        <span class="text-[14px]">{{ $t("header.quit") }}</span>
      </a-button>
      <TheModal
        :open="open"
        :handle-ok="reset"
        :handle-cancel="handleCancel"
        :title="t('header.confirmQuit')"
      />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@/router/index.ts';

// import { ipcRenderer } from "electron";
const props = defineProps({
  isShowTestBtn: Boolean,
});
const { t } = useI18n();
const open = ref<boolean>(false);
function handleCancel() {
  open.value = false;
}
function reset() {
  window.electron.send('quit-app');
}
function goModalTestPage() {
  router.push({ name: 'TestModal' });
}
function showQuitModal() {
  open.value = true;
}
</script>

<style scoped>
.headerbg {
  background: linear-gradient(
    353deg,
    rgba(255, 255, 255, 0.1885) 36%,
    rgba(255, 255, 255, 0.29) 43%,
    rgba(0, 142, 255, 0.29) 57%
  );
  box-sizing: border-box;
  border: 1px solid #3f89dd;
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.25),
    inset 0px -1px 1px 0px rgba(255, 255, 255, 0.34);
  color: #fff;
}
</style>
