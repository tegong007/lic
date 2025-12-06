<template>
  <div class="mt-12vh w-94vw">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="30" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="flex items-center gap-1vw">
      <a-form-item label="搜索类型" name="taskID">
        <a-select v-model:value="formData.choose" @change="onBtnClick('search')">
          <a-select-option :value="1">任务</a-select-option>
          <a-select-option :value="2">制证数据</a-select-option>
          <a-select-option :value="3">证本</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务号" name="taskID">
        <a-input v-model:value="formData.taskID" :class="keyInput === 'taskID' ? 'keyInput' : ''" class="w-13vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'taskID')" />
      </a-form-item>
      <a-form-item label="批次号" name="batchID">
        <a-input v-model:value="formData.batchID" :class="keyInput === 'batchID' ? 'keyInput' : ''" class="w-10vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'batchID')" />
      </a-form-item>
      <a-form-item label="证本号" name="docID">
        <a-input v-model:value="formData.docID" :class="keyInput === 'docID' ? 'keyInput' : ''" class="w-10vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'docID')" />
      </a-form-item>
      <a-form-item label="证本状态" name="docStatus">
        <a-select v-model:value="formData.docStatus">
          <a-select-option v-for="option in docStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="mb-2vh mt-2vh flex justify-between">
      <a-form-item label="时间范围" name="status">
        <a-range-picker v-model:value="formData.dateRange" :locale="lang" value-format="YYYY-MM-DD" input-read-only :allow-clear="false" />
      </a-form-item>
      <div>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('search')">查询</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('clear')">清空</a-button>
        <a-button type="link" class="btn_search" @click="onBtnClick('refresh')">刷新</a-button>
      </div>
    </div>
    <div v-for="(value, index) in data" :key="index" class="bg_jianbian mb-2vh flex text-1vw line-height-3vh">
      <div class="w-15% text-center line-height-4.5vh">
        序号: {{ value.seq }}<br />
        <span v-if="value.docStatus === 3" class="tap_ok mt-10vh p-0.5vh">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
        <span v-else-if="value.docStatus === 4" class="tap_ng mt-10vh p-0.5vh">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
        <span v-else class="tap_tip mt-10vh p-0.5vh">{{ findLabelByValue('docStatusOptions', value.docStatus) }}</span>
      </div>
      <div class="relative w-67% text-left">
        <div>
          <div class="flex justify-between">
            <div class="w-27%">所属任务号: {{ value.taskID }}</div>
            <div class="w-27%">证本号: {{ value.docID }}</div>
            <div class="w-15%">姓: {{ value.cnSurname }}</div>
            <div class="w-31%">制本开始时间: {{ value.startTime }}</div>
          </div>
          <div class="flex justify-between">
            <div class="w-27%">所属批次号: {{ value.batchID }}</div>
            <div class="w-27%">证本类型: {{ findLabelByValue('docTypesOptions', value.type) }}</div>
            <div class="w-15%">名: {{ value.cnGivenName }}</div>
            <div class="w-31%">制本结束时间: {{ value.endTime }}</div>
          </div>
          <img v-if="value.photo" class="absolute top-1vh h-8vh -right-15vw" :src="`data:image/png;base64,${value.photo}`" />
        </div>
        <div class="mt-1vh">
          <a-button type="link" class="btn_in mr-1vw" @click="onItemClick('chakan', value)">查看更多</a-button>
          <a-button v-if="value.docStatus === 1" type="link" class="btn_in mr-1vw" @click="onItemClick('挂起', value)">挂起</a-button>
          <a-button v-if="value.docStatus === 2" type="link" class="btn_in mr-1vw" @click="onItemClick('恢复生产', value)">恢复生产</a-button>
          <a-button v-if="value.docStatus === 0 || value.docStatus === 4" type="link" class="btn_in mr-1vw" @click="onItemClick('设为成功', value)">设为成功</a-button>
          <a-button v-if="value.docStatus === 0 || value.docStatus === 3" type="link" class="btn_in" @click="onItemClick('设为失败', value)">设为失败</a-button>
        </div>
      </div>
    </div>
    <vxe-pager v-if="data.length > 0" v-model:current-page="pageIn.current" v-model:page-size="pageIn.size" :total="page.total" :layouts="['Home', 'PrevPage', 'Number', 'NextPage', 'End']" @page-change="onPageChange">
      <template #right>
        <div class="relative top-1">
          <span>共{{ Math.ceil(page.total / page.size) }}页，{{ page.total }}条记录</span>
        </div>
      </template>
    </vxe-pager>
  </div>
</template>

<script lang="ts" setup>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { docStatusOptions, findLabelByValue } from '@/plugins/option';

const props = defineProps<{ page: any; data: any[] }>();
const emit = defineEmits(['callback', 'page', 'data']);
const lang = locale;

const formData: any = ref({ choose: 2, docStatus: -1 });
const pageIn = ref(props.page);
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);

// 翻页事件
function onPageChange(event: any) {
  pageIn.value = { total: pageIn.value.total, current: event.currentPage, size: event.pageSize };
  onBtnClick('page');
}

// 搜索栏按钮事件
function onBtnClick(key: string) {
  if (key === 'clear') {
    formData.value = { choose: 2, docStatus: -1 };
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'search') {
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'page') {
    emit('callback', { key, formData: { choose: 2 }, page: pageIn.value });
    return;
  }
  emit('callback', { key, formData: formData.value, page: pageIn.value });
}

// 表格按钮事件
function onItemClick(key: string, item: any) {
  emit('callback', { key, items: item });
}

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function onInputFocus(event: any, text: string) {
  showKeyboard.value = true;
  keyInput.value = text;
  cursorPosition.value = event;
  const rect = event.target.getBoundingClientRect();
  const top = rect.bottom + rect.height + window.scrollY;
  transformValue.value = [0, top - 120];
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
::v-deep(.vxe-pager) {
  font-size: 1vw;
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
</style>
