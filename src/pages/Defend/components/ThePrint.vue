<template>
  <div class="bgDefend_item">
    <div class="bgDefend_tit">自检</div>
    <section class="bg_listItem">
      <div class="bgDefend_itemIn selftest-row">
        <div class="bgDefend_itemIn_tit selftest-name"></div>
        <a-button type="link" class="btn_search" @click="() => (modal = { open: true, title: '打印自检页', data: {} })">打印自检页</a-button>
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
.selftest-row {
  width: 100%;
}
.selftest-name {
  flex: 0 0 15vw;
  width: 15vw;
}
</style>
