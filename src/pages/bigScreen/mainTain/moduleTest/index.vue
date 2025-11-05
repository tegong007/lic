<template>
  <div class="box-border wh-full flex flex-col gap-20">
    <Reader
      v-if="item.readers"
      :data="item.readers"
      :update-item="handleUpdateItem"
      :current-page="currentPage"
      :current-model="props.currentModel"
      :show-keyboard="showKeyboard"
      :set-show-keyboard="setShowKeyboard"
    />
    <Camera
      v-if="item.cameras"
      :data="item.cameras"
      @update-item="handleUpdateItem"
    />
    <Laser
      v-if="item.lasers"
      :data="item.lasers"
      @update-item="handleUpdateItem"
    />
    <InkjetPrinter
      v-if="item.uvPrinters"
      :data="item.uvPrinters"
      :update-item="handleUpdateItem"
      :current-page="currentPage"
      :show-keyboard="showKeyboard"
      :set-show-keyboard="setShowKeyboard"
    />
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import { watch } from 'vue';
import { mainTainModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';
import Camera from './Camera.vue';
import InkjetPrinter from './InkjetPrinter.vue';
import Laser from './Laser.vue';
import Reader from './Reader.vue';

const props = defineProps({
  currentModel: String,
});
const showKeyboard = ref(false);
const currentPage = ref('');
function setShowKeyboard(value: boolean, current?: string) {
  showKeyboard.value = value;
  currentPage.value = current;
}
const { notification } = App.useApp();
const item = ref({});

function handleUpdateItem(arrayName, index, value) {
  if (item.value[arrayName] && item.value[arrayName][index]) {
    if (arrayName === 'uvPrinters') {
      item.value[arrayName][index].positionItems[1].value = value;
    }
    else {
      item.value[arrayName][index].value = value;
    }
  }
}

async function getData(newValue: string) {
  try {
    useAppStore().setSpinning(true);
    const data = await mainTainModule.getDevice({ moduleID: Number(newValue) });
    if (data.respData) {
      item.value = data.respData;
    }
    else {
      item.value = {};
    }
  }
  catch (error) {
    // notification.error({
    //   message: "错误",
    //   description: `${findLabelByValue(newValue)}接口超时`,
    //   placement: 'bottomRight',
    // });
    notification.error({
      message: '错误',
      description: error,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
  }
  finally {
    useAppStore().setSpinning(false);
  }
}

watch(
  () => props.currentModel,
  (newValue) => {
    setShowKeyboard(false);
    getData(newValue);
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
.btn {
  border-radius: 6px;
  opacity: 1;
  background: linear-gradient(209deg, #90ecff 2%, #006af5 69%);
  box-sizing: border-box;
  border: 2px solid #89f7ff;
  padding: 6px 20px;
  color: white;
  height: 40px;
}
::v-deep(.ant-select-selection-item) {
  font-size: 16px;
}
</style>
