<template>
  <div class="bgItem text-1.1vw">
    <div class="bgItem_tit">自检</div>
    <section class="bg_jianbian mb-2vh ml-2vw flex">
      <div class="mr-3vw flex items-center">
        <a-button type="link" class="btn_search ml-3vw" @click="() => (modal = { open: true, title: '打印自检页', data: {} })">打印自检页</a-button>
      </div>
    </section>
  </div>
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :data="modal.data" :handle-ok="controlMachine" :handle-cancel="() => (modal = { open: false, title: '', data: {} })" />
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { defendModule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import { useAppStore } from '@/store/index';

defineProps({ data: Object, updateItem: Function, showKeyboard: Boolean, setShowKeyboard: Function, currentPage: String, currentModel: String });

const { notification } = App.useApp();

const modal = ref({ open: false, title: '', data: {} });

async function controlMachine() {
  if (modal.value.title === '打印自检页') {
    try {
      useAppStore().setSpinning(true);
      modal.value = { open: false, title: '', data: {} };
      const data: any = await defendModule.printSelfTest();
      if (data.respData) notification.success({ message: '成功', description: '操作成功', placement: 'bottomRight', class: 'notification-custom-class' });
    } catch (error) {
      notification.error({ message: '错误', description: String(error), class: 'notificationE-custom-class', placement: 'bottomRight' });
    } finally {
      useAppStore().setSpinning(false);
    }
  } else {
    modal.value = { open: false, title: '', data: {} };
  }
}
</script>

<style scoped lang="less">
.bgItem {
  margin-top: 3vh;
  .bgItem_tit {
    font-size: 1.2vw;
    font-weight: bold;
    padding-bottom: 1vh;
  }
}
::v-deep(.ant-input),
::v-deep(.ant-select-selector) {
  font-size: 1.2vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 2px !important;
  height: 4vh !important;
  border-radius: 0;
  min-width: 7.5vw;
}
::v-deep(.ant-select-selection-item) {
  line-height: 3.5vh !important;
}
::v-deep(.ant-select-selection-item) {
  font-size: 1.2vw;
  color: #ffffff !important;
}
::v-deep(.ant-input::placeholder),
::v-deep(.ant-select-selection-placeholder) {
  color: #989ca1;
}
::v-deep(.anticon svg) {
  color: #e2e5eb;
}
</style>
