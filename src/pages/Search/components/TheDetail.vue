<template>
  <a-modal width="50vw" :get-container="false" :open="props.open" :closable="false" centered force-render>
    <div class="w-full text-center text-1vw color-#ffffff">
      <table v-if="formData" class="mx-auto mt-5vh w-90% text-left">
        <tr>
          <td>证本流水线号:</td>
          <td>{{ formData.docSN }}</td>
          <td rowspan="2">人像图片:</td>
          <td rowspan="2"><img v-if="formData.photo" class="h-8vh" :src="`data:image/png;base64,${formData.photo}`" @click="viewImage([`data:image/png;base64,${formData.photo}`])" /></td>
        </tr>
        <tr>
          <td>加注类型:</td>
          <td>{{ findLabelByValue('cnObsvTypeOptions', formData.cnObsvType) }}</td>
        </tr>
        <tr>
          <td>开始时间:</td>
          <td>{{ formData.startTime }}</td>
          <td>姓(中):</td>
          <td>{{ formData.cnSurname }}</td>
        </tr>
        <tr>
          <td>结束时间:</td>
          <td>{{ formData.endTime }}</td>
          <td>名(中):</td>
          <td>{{ formData.cnGivenName }}</td>
        </tr>
        <tr>
          <td>任务号:</td>
          <td>{{ formData.taskID }}</td>
          <td>证本类型:</td>
          <td>{{ findLabelByValue('docTypesOptions', formData.type) }}</td>
        </tr>
        <tr>
          <td>批次号:</td>
          <td>{{ formData.batchID }}</td>
          <td>证件类型:</td>
          <td>{{ findLabelByValue('idTypesOptions', formData.idType) }}</td>
        </tr>
        <tr>
          <td>证本号:</td>
          <td>{{ formData.docID }}</td>
          <td>当前工位:</td>
          <td>{{ formData.position }}</td>
        </tr>
        <tr>
          <td>证件号:</td>
          <td>{{ formData.idNum }}</td>
          <td>证本状态:</td>
          <td>{{ findLabelByValue('docStatusOptions', formData.docStatus) }}</td>
        </tr>
        <tr>
          <td>机读码1:</td>
          <td colspan="3">{{ formData.mrz1 }}</td>
        </tr>
        <tr>
          <td>机读码2:</td>
          <td colspan="3">{{ formData.mrz2 }}</td>
        </tr>
        <tr>
          <td>废本原因:</td>
          <td colspan="3">{{ formData.obsoleteReason }}</td>
        </tr>
      </table>
    </div>
    <template #footer>
      <a-flex justify="center" align="center">
        <a-button class="btn_normal mt-1vh" @click="handleCancel">返回</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { api } from 'v-viewer';
import { findLabelByValue } from '@/plugins/option';

const props = defineProps({ open: Boolean, item: Object, handleCancel: Function });

const formData: any = ref(props.item);

function viewImage(list: string[]) {
  api({ images: list, options: { navbar: false, title: false, toolbar: false, rotatable: false } });
}
</script>

<style scoped lang="less">
table {
  td {
    padding: 0.5vh 0;
  }
}
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 65vh;
  background-color: #03163e;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
</style>
