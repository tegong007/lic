<template>
  <a-modal
    :get-container="false"
    :open="props.open"
    wrap-class-name="test"
    :closable="false"
    centered
    force-render
    @ok="props.handleOk"
  >
    <div class="delete-modal h-[22em]">
      <div class="h-full flex flex-col items-center justify-center">
        <img
          src="../assets/image/warning.png"
          class="mb-[1em] h-[10em] w-[10em]"
          alt=""
        >
        <!-- <a-flex justify="center" align="center"> -->
        <span class="text-[30px] color-[#627384] font-bold">
          &nbsp;&nbsp; {{ props.title }}</span>
        <!-- </a-flex> -->
      </div>
    </div>

    <template #footer>
      <a-flex justify="space-around" align="center" class="p-b-[2em]">
        <div
          class="cancelBtn relative h-full w-[40%] flex items-center justify-center"
        >
          <span
            class="relative p-y-[0.7em] text-[30px] color-[#627384] font-bold"
          >
            {{ $t("modal.cancel") }}</span>
          <div
            class="absolute h-full w-full cursor-pointer rounded-[1em] shadow-xl active:bg-[#000]/[0.4] hover:bg-[#fff]/[0.3]"
            @click="handleCancel"
          />
        </div>
        <div
          class="okBtn relative h-full w-[40%] flex items-center justify-center"
        >
          <span class="relative p-y-[0.7em] text-[30px] color-[#fff] font-bold">
            {{ $t("modal.confirm") }}</span>
          <div
            class="absolute h-full w-full cursor-pointer rounded-[1em] shadow-2xl active:bg-[#000]/[0.4] hover:bg-[#fff]/[0.3]"
            @click="handleOk"
          />
        </div>
      </a-flex>
      <!-- <a-button key="back" @click="props.setOpen(false)">Return</a-button> -->
      <!-- <a-button key="submit" type="primary" :loading="loading" @click="handleOk"
        >Submit</a-button
      > -->
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  open: Boolean,
  handleOk: Function,
  title: String,
  handleCancel: Function,
});
</script>

<style scoped lang="less">
::v-deep(.ant-modal-content) {
  padding: 0;
}
.delete-modal {
  background: linear-gradient(to bottom, rgb(217, 220, 241), rgba(255, 255, 255, 0)) !important;
  border-radius: 1em;
}
.cancelBtn {
  background-image: url('../assets/image/cancelBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
.okBtn {
  background-image: url('../assets/image/okBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
}
</style>
