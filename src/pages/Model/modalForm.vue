<template>
  <div class="relative w-full flex flex-col text-white">
    <div class="relative border-b-[2px] border-[#7C9FCA] pl-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white">入参</span>
      </a-typography-title>
      <a-config-provider
        :theme="{
          token: {
            fontSize: 16,
          },
        }"
      >
        <a-form
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :rules="rules"
          :wrapper-col="wrapperCol"
          label-align="left"
          class="ml-[20px] mt-[20px] w-[60%] text-[18px] text-white"
        >
          <a-form-item label="接口URL" name="transURL">
            <a-select
              v-model:value="formState.transURL"
              placeholder="请选择接口url"
            >
              <!-- <a-select-option value="send-doc">send-doc</a-select-option> -->
              <a-select-option
                v-for="(item, index) in props.optionsData?.transURL"
                :key="index"
                :value="item"
              >
                {{ item }}c
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="接口参数" name="paraIn">
            <a-select
              v-model:value="formState.paraIn"
              placeholder="请选择接口参数"
            >
              <a-select-option
                v-for="(item, index) in props.optionsData?.paraIn"
                :key="index"
                :value="item"
              >
                {{ item }}c
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-config-provider>
      <div class="absolute right-[20px] top-0">
        <a-button type="primary" class="" @click="onSubmit">
          测试
        </a-button>
      </div>
    </div>
    <div class="relative p-[20px]">
      <a-typography-title :level="5">
        <span class="text-[20px] text-white">返回数据</span>
      </a-typography-title>
      <a-form
        ref="dataRef"
        :model="returnForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label-align="left"
        class="ml-[20px] mt-[20px] w-[60%] text-lg text-white"
      >
        <a-form-item label="返回值" name="respData">
          <a-textarea v-model:value="returnForm.respData" auto-size />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw, watch } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { getApiTransfer } from '@/apis/webApi';

interface FormState {
  transURL: string | undefined;
  paraIn?: string;
}
interface ReturnForm {
  respData: string;
}
const props = defineProps({
  currentModel: String,
  optionsData: Object,
});
const formRef = ref();
const dataRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };
const formState: UnwrapRef<FormState> = reactive({
  transURL: undefined,
  paraIn: undefined,
});
const returnForm: UnwrapRef<ReturnForm> = reactive({
  respData: '',
});
const rules: Record<string, Rule[]> = {
  transURL: [{ required: true, message: '请选择接口url', trigger: 'change' }],
  paraIn: [{ required: true, message: '请选择接口参数', trigger: 'change' }],
};

function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      console.log('values', formState, toRaw(formState));
      const params = {
        transURL: `/${props.currentModel}/${formState.transURL}`,
        paraIn: { status: formState.paraIn },
      };
      const data = await getApiTransfer(params);
      console.log('🚀 ~ onSubmit ~ params:', data);
    })
    .catch((error: any) => {
      console.log('error', error);
    });
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
</style>
