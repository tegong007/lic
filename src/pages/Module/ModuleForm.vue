<template>
  <div class="relative w-full flex flex-col text-white">
    <div class="relative border-b-[2px] border-[#7C9FCA] pl-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white">
          {{ $t("moduleForm.requsetParams") }}</span>
      </a-typography-title>
      <a-flex>
        <a-form
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :rules="rules"
          :wrapper-col="wrapperCol"
          label-align="left"
          class="relative ml-[20px] mt-[20px] w-[60%] text-[18px] text-white"
        >
          <a-form-item :label="t('moduleForm.tranURILabel')" name="transURI">
            <a-select
              v-model:value="formState.transURI"
              :placeholder="t('moduleForm.tranURIPla')"
              @change="handleChange"
            >
              <a-select-option
                v-for="(item, index) in props.optionsData?.transURI"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item :label="t('moduleForm.paraInLabel')" name="paraIn">
            <a-select
              v-model:value="formState.paraIn"
              :placeholder="t('moduleForm.paraInPla')"
              @change="handleChange"
            >
              <a-select-option
                v-for="(item, index) in props.optionsData?.paraIn"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
        </a-form>
        <div class="relative left-[-12em] mb-20px flex items-end">
          <a-button type="primary" class="" size="large" @click="onSubmit">
            {{ $t("moduleForm.testBtn") }}
          </a-button>
        </div>
      </a-flex>
      <!-- <div class="absolute right-[20px] top-0">
        <a-button type="primary" class="" @click="onSubmit"> 测试 </a-button>
      </div> -->
    </div>
    <div class="relative p-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white">
          {{ $t("moduleForm.returnData") }}</span>
      </a-typography-title>

      <a-form
        ref="dataRef"
        :model="returnForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label-align="left"
        class="ml-[20px] mt-[20px] w-[60%] text-white"
      >
        <a-form-item :label="t('moduleForm.respLabel')" name="respData">
          <a-descriptions :column="1" bordered :label-style="{ width: '25%' }">
            <a-descriptions-item label="code">
              {{ returnForm.respData.code }}
            </a-descriptions-item>
            <a-descriptions-item label="msg">
              {{ returnForm.respData.msg }}
            </a-descriptions-item>
          </a-descriptions>
        </a-form-item>
      </a-form>
    </div>
    <context-holder />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useI18n } from 'vue-i18n';
import type { NotificationPlacement } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
import { useAppStore } from '../../store/index';
import { getApiTransfer } from '@/apis/webApi';

const props = defineProps({
  currentModel: String,
  optionsData: Object,
});
const [api, contextHolder] = notification.useNotification();
const openNotify = (placement: NotificationPlacement, msg: any) => openNotification(placement, msg);
function openNotification(placement: NotificationPlacement, msg: any) {
  api.error({
    message: '错误信息',
    description: ` ${msg}`,
    placement,
  });
}

const { t } = useI18n();
const appStore = useAppStore();
interface FormState {
  transURI: string | undefined;
  paraIn?: string;
}
interface ReturnForm {
  respData: object;
}
const formRef = ref();
const dataRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };
const formState: UnwrapRef<FormState> = reactive({
  transURI: undefined,
  paraIn: undefined,
});
const returnForm: UnwrapRef<ReturnForm> = reactive({
  respData: '',
});
const rules: Record<string, Rule[]> = {
  transURI: [{ required: true, message: '请选择接口url', trigger: 'change' }],
  paraIn: [{ required: true, message: '请选择接口参数', trigger: 'change' }],
};
function handleChange() {
  dataRef.value.resetFields();
}

function onSubmit() {
  appStore.setSpinning(true);
  formRef.value
    .validate()
    .then(async () => {
      const params = {
        transURI: `/${props.currentModel}/${formState.transURI}`,
        paraIn: { status: formState.paraIn },
      };
      await getApiTransferTask(params);
      appStore.setSpinning(false);
    })
    .catch((error: any) => {
      console.log('error', error);
      appStore.setSpinning(false);
    });
}
async function getApiTransferTask(params: any) {
  try {
    const data = await getApiTransfer(params);
    returnForm.respData = data;
  }
  catch (error) {
    openNotify('bottomRight', error);
  }
}
function resetForm() {
  formRef.value.resetFields();
  dataRef.value.resetFields();
}
watch(
  () => props.currentModel,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      resetForm();
    }
  },
  { deep: true },
);
</script>

<style scoped lang="less">
::v-deep(.ant-form-item) {
  label {
    color: #fff !important;
  }
}
::v-deep(.ant-descriptions-view) {
  background: #fff;
}
::v-deep(.ant-spin-spinning) {
  position: absolute !important;
  top: calc(50% - 300px) !important;
  left: -100px !important;
  z-index: 999999999999999999999;
}
</style>
