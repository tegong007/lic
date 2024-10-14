<template>
  <div class="bg h-full w-full">
    <Header :is-show-test-btn="false" />
    <div class="content h-full w-full flex flex-col text-white">
      <div
        class="m-[20px] h-[90%] flex flex border-[4px] border-[#3F89DD] from-[#ffffff44] bg-gradient-to-t"
      >
        <div class="h-full w-[10%] flex flex-col">
          <a-radio-group
            v-model:value="currentModel"
            class="w-full"
            button-style="outline"
          >
            <a-radio-button
              v-for="(item, index) in options"
              :key="index"
              :value="item.value"
              class="w-full flex cursor-pointer items-center justify-center border-0 bg-[#0000] py-[45px] text-[20px] text-white font-bold before:!w-0"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div
          class="h-full flex flex-1 border-l-[4px] border-[#3F89DD] pt-[20px]"
        >
          <ModalForm
            :current-model="currentModel"
            :options-data="getarrJson(currentModel)"
          />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <a-button size="large" @click="goHome">
          返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalForm from '../Model/modalForm.vue';
import Header from '@/components/TheHeader.vue';
import router from '@/router';

const currentModel = ref<string>('m1');
const options = [
  { label: '模组1', value: 'm1' },
  { label: '模组2', value: 'm2' },
  { label: '模组3', value: 'm3' },
  { label: '模组4', value: 'm4' },
  { label: '模组5', value: 'm5' },
  { label: '模组6', value: 'm6' },
];
function goHome() {
  router.push({ name: 'Main' });
}
function getarrJson(model: string) {
  const json = {
    m1: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: ['M1-Ready', 'M1-Camera'],
    },
    m2: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: [
        'M2-Reader-1',
        'M2-Reader-2',
        'M2-Reader-3',
        'M2-Laser-1',
        'M2-Laser-2',
        'M2-Laser-3',
        'M2-Camera',
        'M2-Obsolete',
      ],
    },
    m3: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: [
        'M3-Reader-1',
        'M3-Reader-2',
        'M3-Reader-3',
        'M3-Laser-1',
        'M3-Laser-2',
        'M3-Laser-3',
        'M3-UV',
        'M3-Camera',
      ],
    },
    m4: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: ['M4-Turn'],
    },
    m5: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: [
        'M5-Reader-1',
        'M5-Reader-2',
        'M5-Reader-3',
        'M5-UV',
        'M5-Camera',
      ],
    },
    m6: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: ['M6-Product', 'M6-Obsolete'],
    },
  };
  return json[model];
}
</script>

<style scoped>
.content {
  height: calc(100vh - 66px);
}
.bg {
  background-image: url('@/assets/image/bg_dark.png');
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
}
.ant-radio-button-wrapper:first-child {
  border-inline-start: 0px solid #d9d9d9;
  border-start-start-radius: 0px;
  border-end-start-radius: 0px;
}
.ant-radio-button-wrapper:last-child {
  border-inline-start: 0px solid #d9d9d9;
  border-start-start-radius: 0px;
  border-end-start-radius: 0px;
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  z-index: 1;
  color: #ffffff;
  background: #ffffff2c;
  /* border-color: #1677ff; */
}
</style>
