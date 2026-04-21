<template>
  <div class="mx-auto w-95%">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="30" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="flex items-center justify-between gap-1vw">
      <a-form-item label="搜索类型" name="choose">
        <a-select v-model:value="formData.choose" @change="onBtnClick('search2')">
          <a-select-option :value="1">任务</a-select-option>
          <a-select-option :value="2">制证数据</a-select-option>
          <a-select-option :value="3">证本</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务号" name="taskID">
        <a-input v-model:value="formData.taskID" :class="keyInput === 'taskID' ? 'keyInput' : ''" class="w-15vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'taskID')" />
      </a-form-item>
      <a-form-item label="批次号" name="batchID">
        <a-input v-model:value="formData.batchID" :class="keyInput === 'batchID' ? 'keyInput' : ''" class="w-15vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'batchID')" />
      </a-form-item>
      <a-form-item label="状态" name="docStatus">
        <a-select v-model:value="formData.docStatus">
          <a-select-option v-for="option in docStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="mt-1vh flex items-center gap-1vw">
      <a-form-item label="证本号" name="docID">
        <a-input v-model:value="formData.docID" :class="keyInput === 'docID' ? 'keyInput' : ''" class="bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'docID')" />
      </a-form-item>
      <a-form-item label="时间范围" name="status">
        <a-range-picker v-model:value="formData.dateRange" :locale="lang" value-format="YYYY-MM-DD" input-read-only :allow-clear="false" />
      </a-form-item>
    </div>
    <div class="mb-2vh mt-1vh flex items-center justify-between">
      <div>
        <a-button type="link" class="btn_search mr-2vw" @click="onBtnClick('search')">查询</a-button>
        <a-button type="link" class="btn_search mr-2vw" @click="onBtnClick('clear')">清空</a-button>
        <a-button type="link" class="btn_search mr-2vw" @click="onBtnClick('refresh')">刷新</a-button>
      </div>
      <a-dropdown class="btn_search2">
        <template #overlay>
          <a-menu @click="onItemClicks">
            <a-menu-item :key="0">挂起</a-menu-item>
            <a-menu-item :key="1">恢复生产</a-menu-item>
            <a-menu-item :key="2">设为成功</a-menu-item>
            <a-menu-item :key="3">设为失败</a-menu-item>
          </a-menu>
        </template>
        <a-button class="flex items-center" style="padding-right: 10px">批量操作 ▽</a-button>
      </a-dropdown>
    </div>
    <div v-for="(value, index) in data" :key="index" class="bg_listItem mb-2vh border-2px border-transparent py-1vh text-1.8vw line-height-2vh" :class="selects.includes(value.docSN) ? 'selected' : ''" @click="onListSelect(value.docSN)">
      <div class="items-top flex justify-between">
        <div class="mt-1vh w-16% text-center">
          序号: {{ value.seq }}<br />
          <span v-if="value.docStatus === 3" class="tag_ok w-15vw">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
          <span v-else-if="value.docStatus === 4" class="tag_ng w-15vw">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
          <span v-else class="tag_tip w-15vw">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
        </div>
        <div>所属任务号: {{ value.taskID }}<br />所属批次号: {{ value.batchID }}<br />姓名: {{ value.cnSurname }} {{ value.cnGivenName }}<br />证本号: {{ value.docID }}</div>
        <div>证本类型: {{ findLabelByValue('docTypesOptions', value.type) }}<br />加注类型: {{ findLabelByValue('cnObsvTypeOptions', value.cnObsvType) }}<br />制本开始时间: {{ value.startTime }}<br />制本结束时间: {{ value.endTime }}</div>
        <div class="min-w-10% flex items-center justify-center"><img v-if="value.photo" class="h-8vh" :src="`data:image/png;base64,${value.photo}`" /></div>
      </div>
      <div class="ml-18% mt-1vh flex items-center gap-2vw">
        <a-button type="link" class="btn_search" @click.stop="onItemClick('chakan', value)">查看更多</a-button>
        <a-button v-if="value.docStatus === 1" type="link" class="btn_search" @click.stop="onItemClick('挂起', value)">挂起</a-button>
        <a-button v-if="value.docStatus === 2" type="link" class="btn_search" @click.stop="onItemClick('恢复生产', value)">恢复生产</a-button>
        <a-button v-if="value.docStatus === 0 || value.docStatus === 4" type="link" class="btn_search" @click.stop="onItemClick('设为成功', value)">设为成功</a-button>
        <a-button v-if="value.docStatus === 0 || value.docStatus === 3" type="link" class="btn_search" @click.stop="onItemClick('设为失败', value)">设为失败</a-button>
      </div>
    </div>
    <vxe-pager v-if="data.length > 0" v-model:current-page="pageIn.current" v-model:page-size="pageIn.size" :total="page.total" :layouts="['Home', 'PrevPage', 'Number', 'NextPage', 'End']" @page-change="onPageChange">
      <template #right>
        <div class="relative -top-4">
          <span>共{{ Math.ceil(page.total / page.size) }}页，{{ page.total }}条记录</span>
          <a-select v-if="page.total > 0" v-model:value="pageIn.current" class="ml-1vw text-center" @change="onBtnClick('page')">
            <a-select-option v-for="(value, index) in Math.ceil(page.total / page.size)" :key="index" :value="value">第{{ value }}页</a-select-option>
          </a-select>
        </div>
      </template>
    </vxe-pager>
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { docStatusOptions, findLabelByValue } from '@/plugins/option';

const props = defineProps<{ page: any; form: any; data: any[] }>();
const emit = defineEmits(['callback', 'page', 'data']);
const lang = locale;
const { notification } = App.useApp();

const formData: any = ref({ choose: 2, docStatus: -1, taskID: props.form.taskID || '' });
const pageIn = ref(props.page);
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const selects: any = ref([]);

// 翻页事件
function onPageChange(event: any) {
  pageIn.value = { total: pageIn.value.total, current: event.currentPage, size: event.pageSize };
  onBtnClick('page');
}

// 搜索栏按钮事件
function onBtnClick(key: string) {
  if (key === 'clear') {
    selects.value = [];
    formData.value = { choose: 2, docStatus: -1 };
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'search') {
    selects.value = [];
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'page') {
    emit('callback', { key, formData: { choose: 2, ...formData.value }, page: pageIn.value });
    return;
  } else if (key === 'search2') {
    formData.value = { choose: formData.value.choose };
    pageIn.value = { total: 0, current: 1, size: 4 };
  }
  emit('callback', { key, formData: formData.value, page: pageIn.value });
}

// 表格按钮事件
function onItemClick(key: string, item: any) {
  emit('callback', { key, items: item });
}

function onItemClicks(event: any) {
  if (selects.value.length > 0) {
    if (event.key === 0) emit('callback', { key: '批量挂起', items: selects.value });
    else if (event.key === 1) emit('callback', { key: '批量恢复生产', items: selects.value });
    else if (event.key === 2) emit('callback', { key: '批量设为成功', items: selects.value });
    else if (event.key === 3) emit('callback', { key: '批量设为失败', items: selects.value });
    selects.value = [];
  } else {
    notification.error({ message: '错误', description: '请至少选择1条数据', placement: 'bottomRight', class: 'notificationE-custom-class' });
  }
}

function onListSelect(id: string) {
  const index = selects.value.indexOf(id);
  if (index !== -1) selects.value.splice(index, 1);
  else selects.value.push(id);
}

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function onInputFocus(event: any, text: string) {
  if (keyInput.value !== text) {
    showKeyboard.value = true;
    keyInput.value = text;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [0, top - 120];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  formData.value[keyInput.value] = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}
</script>

<style scoped lang="less">
.bg_listItem {
  cursor: pointer;
}
.selected {
  border-color: #3662ec;
}
</style>
