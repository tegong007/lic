<template>
  <a-modal width="96vw" :get-container="false" :open="props.open" :closable="false" centered force-render>
    <div class="w-full text-center text-2vw color-#ffffff">
      <div class="mt-1.5vh text-2.5vw">详情</div>
      <table v-if="formData" class="mx-auto mt-1vh table-fixed">
        <tr>
          <td>证本流水线号:</td>
          <td align="left">{{ formData.docSN }}</td>
          <td rowspan="2">人像图片:</td>
          <td rowspan="2" align="left"><img v-if="formData.photo" class="h-8vh" :src="`data:image/png;base64,${formData.photo}`" @click="viewImage([`data:image/png;base64,${formData.photo}`])" /></td>
        </tr>
        <tr>
          <td>加注类型:</td>
          <td align="left">{{ findLabelByValue('cnObsvTypeOptions', formData.cnObsvType) }}</td>
        </tr>
        <tr>
          <td>开始时间:</td>
          <td align="left">{{ formData.startTime }}</td>
          <td>姓(中):</td>
          <td align="left">{{ formData.cnSurname }}</td>
        </tr>
        <tr>
          <td>结束时间:</td>
          <td align="left">{{ formData.endTime }}</td>
          <td>名(中):</td>
          <td align="left">{{ formData.cnGivenName }}</td>
        </tr>
        <tr>
          <td>任务号:</td>
          <td align="left">{{ formData.taskID }}</td>
          <td>证本类型:</td>
          <td align="left">{{ findLabelByValue('docTypesOptions', formData.type) }}</td>
        </tr>
        <tr>
          <td>批次号:</td>
          <td align="left">{{ formData.batchID }}</td>
          <td>证件类型:</td>
          <td align="left">{{ findLabelByValue('idTypesOptions', formData.idType) }}</td>
        </tr>
        <tr>
          <td>证本号:</td>
          <td align="left">{{ formData.docID }}</td>
          <td>当前工位:</td>
          <td align="left">{{ formData.position }}</td>
        </tr>
        <tr>
          <td>证件号:</td>
          <td align="left">{{ formData.idNum }}</td>
          <td>证本状态:</td>
          <td align="left">{{ findLabelByValue('docStatusOptions', formData.docStatus) }}</td>
        </tr>
        <tr>
          <td>机读码1:</td>
          <td colspan="3" class="scrollable-cell">{{ formData.mrz1 }}</td>
        </tr>
        <tr>
          <td>机读码2:</td>
          <td colspan="3" class="scrollable-cell">{{ formData.mrz2 }}</td>
        </tr>
        <tr>
          <td>废本原因:</td>
          <td colspan="3" class="scrollable-cell">
            {{ formData.obsoleteReason }}
          </td>
        </tr>
      </table>
    </div>
    <template #footer>
      <a-flex justify="center" align="center">
        <a-button class="btn_normal absolute bottom-3vh w-24.5vw" @click="handleCancel">返回</a-button>
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
/* 在样式中添加 */
.table-fixed {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}
/* 基础单元格样式 */
.table-fixed td {
  padding: 0.4vh 0;
  vertical-align: middle;
}
/* 标签单元格 */
.table-fixed td:first-child,
.table-fixed td:nth-child(3) {
  white-space: nowrap;
}

/* 可滚动单元格样式 */
.scrollable-cell {
  max-height: 100px !important;
  overflow-y: auto;
  overflow-x: auto;
  word-break: break-word;
  text-align: left;
}
/* 对齐顶部，特别是标签单元格 */
.align-top {
  vertical-align: top;
}
::v-deep(.ant-modal-content) {
  background-image: url('@/assets/image/bg_modal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 50.6vh;
  background-color: #03163e;
}
::v-deep(.ant-modal-mask) {
  background: #03163ef2;
}
</style>
