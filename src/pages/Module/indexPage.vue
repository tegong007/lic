<template>
  <div class="bg h-full w-full">
    <Header :is-show-test-btn="false" />
    <div class="content h-full w-full flex flex-col text-white">
      <div
        class="m-[20px] h-[90%] flex flex border-[4px] border-[#3F89DD] from-[#ffffff44] bg-gradient-to-t"
      >
        <div class="h-full w-[10%] flex flex-col">
          <a-radio-group v-model:value="currentModel" class="w-full" button-style="outline">
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
        <div class="h-full flex flex-1 border-l-[4px] border-[#3F89DD] pt-[20px]">
          <Transfer v-if="currentModel === 'test'" />
          <ModalForm
            v-else
            :current-model="currentModel"
            :options-data="getarrJson(currentModel)"
          />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <a-button size="large" @click="goHome">
          {{ $t("moduleTest.gohomeBtn") }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ModalForm from '../Module/ModuleForm.vue';
import Transfer from './transfer.vue';
import Header from '@/components/TheHeader.vue';
import router from '@/router';

const { t } = useI18n();
definePage({
  name: 'TestModal',
  meta: {
    title: '测试页',
  },
});
const currentModel = ref<string>('test');
const options = [
  { label: `${t('transderModule.name')}`, value: 'test' },
  { label: `${t('moduleTest.module')}1`, value: 'm1' },
  { label: `${t('moduleTest.module')}2`, value: 'm2' },
  { label: `${t('moduleTest.module')}3`, value: 'm3' },
  { label: `${t('moduleTest.module')}4`, value: 'm4' },
  { label: `${t('moduleTest.module')}5`, value: 'm5' },
  { label: `${t('moduleTest.module')}6`, value: 'm6' },
];

function goHome() {
  router.push({ name: 'Main' });
}
function getarrJson(model: string) {
  const json = {
    m1: {
      transURI: ['send-doc', 'get-doc-status'],
      paraIn: ['M1-Ready', 'M1-Camera', 'M1-Warehouse'],
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
        'M3-UV-1',
        'M3-UV-2',
        'M3-UV-3',
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
        'M5-UV-1',
        'M5-UV-2',
        'M5-UV-3',
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
}
</style>
