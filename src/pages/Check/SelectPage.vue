<template>
  <div class="select-page-root absolute top-10vh w-100% flex justify-start">
    <div class="ml-1vw flex justify-start">
      <div class="bgDefend ml-2vw h-71vh w-90vw overflow-auto">
        <TheSet v-if="choose === 2" />
        <TheRecord v-else :default-check-type="0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import TheRecord from '@/pages/Check/components/TheRecord.vue';
import TheSet from '@/pages/Check/components/TheSet.vue';

const route = useRoute();
// key=2 进入参数设置，key=1（默认）进入质检记录
const choose = ref(Number(route.query.key || '1'));
</script>

<style scoped lang="less">
.bgDefend {
  ::v-deep(.ant-form-item) {
    margin-bottom: 0vh;
  }
  ::v-deep(.ant-form-item-label) {
    line-height: 3vh !important;
  }
  ::v-deep(.ant-form-item-label label) {
    color: #ffffff;
    font-size: 1.4vw;
  }
  ::v-deep(.ant-input),
  ::v-deep(.ant-select-selector),
  ::v-deep(.ant-picker-range) {
    font-size: 1.1vw;
    background-color: transparent !important;
    color: #ffffff;
    border-width: 0px !important;
    background-color: #ffffff15 !important;
    height: 5vh !important;
    border-radius: 0;
  }
  ::v-deep(.ant-select-selection-item) {
    line-height: 5vh !important;
    font-size: 1.1vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-picker-range input) {
    font-size: 1.1vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-input::placeholder),
  ::v-deep(.ant-select-selection-placeholder),
  ::v-deep(.ant-picker-input input::placeholder) {
    color: #989ca1;
  }
  ::v-deep(.ant-select-arrow) {
    right: 0.5vw !important;
  }
  ::v-deep(.ant-switch-checked .ant-switch-inner) {
    background: #3662ec;
  }
  ::v-deep(.ant-switch-inner) {
    background: #d8d8d8;
  }
  ::v-deep(.anticon svg) {
    color: #e2e5eb;
  }
  ::v-deep(.vxe-pager) {
    font-size: 1.4vw;
    color: #cfdef1;
    background-color: transparent;
    .vxe-pager--prev-btn,
    .vxe-pager--num-btn,
    .vxe-pager--next-btn {
      color: #ffffff;
      background: transparent;
    }
    .is--active {
      background: #3662ec;
      color: #ffffff !important;
    }
    .is--disabled {
      color: #989ca1 !important;
    }
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3662ec;
    border-radius: 2px;
  }
}
</style>

<style lang="less">
// 用唯一根类限定作用域，避免 .bgDefend .bg_listItem 全局样式泄漏到「设备设置 / 设备维护」等其它页面
.select-page-root {
  .bgDefend {
    .bg_listItem {
      padding: 2vh 0;
      margin: 1vh 0;
      font-size: 1.4vw;
      &:nth-of-type(odd) {
        background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%);
      }
      &:nth-of-type(even) {
        background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%);
      }
    }
  }
}
</style>

<style lang="less">
// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  background-color: #141723;
  border-radius: 0;
  .ant-select-item-option {
    padding: 1.2vh 14px !important;
    min-height: auto !important;
    height: auto !important;
  }
  .ant-select-item-option-content {
    font-size: 1.1vw !important;
    color: #b0b4ba;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(54, 98, 236, 0.3) !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #3662ec !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-state {
    color: #ffffff;
  }
}
.ant-select-arrow {
  color: #e2e5eb !important;
}
</style>
