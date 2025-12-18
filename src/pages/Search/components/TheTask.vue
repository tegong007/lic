<template>
  <div class="mt-12vh w-94vw">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="30" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="flex items-center gap-1vw">
      <a-form-item label="搜索类型" name="choose">
        <a-select v-model:value="formData.choose" @change="onBtnClick('search2')">
          <a-select-option :value="1">任务</a-select-option>
          <a-select-option :value="2">制证数据</a-select-option>
          <a-select-option :value="3">证本</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务号" name="taskID">
        <a-input v-model:value="formData.taskID" :class="keyInput === 'taskID' ? 'keyInput' : ''" class="w-13vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'taskID')" />
      </a-form-item>
      <a-form-item label="批次号" name="batchID">
        <a-input v-model:value="formData.batchID" :class="keyInput === 'batchID' ? 'keyInput' : ''" class="w-23vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'batchID')" />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="formData.status">
          <a-select-option v-for="option in TaskStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="mb-2vh mt-2vh flex items-center justify-between">
      <a-form-item label="时间范围" name="status">
        <a-range-picker v-model:value="formData.dateRange" :locale="lang" value-format="YYYY-MM-DD" input-read-only :allow-clear="false" />
      </a-form-item>
      <div class="flex">
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('search')">查询</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('clear')">清空</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('refresh')">刷新</a-button>
        <a-dropdown class="btn_search">
          <template #overlay>
            <a-menu @click="onItemClicks">
              <a-menu-item :key="0">挂起</a-menu-item>
              <a-menu-item :key="1">恢复生产</a-menu-item>
            </a-menu>
          </template>
          <a-button class="btn flex items-center" style="padding-right: 10px">批量操作 ▽</a-button>
        </a-dropdown>
      </div>
    </div>
    <div v-for="(value, index) in data" :key="index" class="bg_jianbian mb-2vh flex text-1vw line-height-3vh" :class="selects.includes(value.taskID) ? 'selected' : ''" @click="onListSelect(value.taskID)">
      <div class="w-15% text-center line-height-4.5vh">
        序号: {{ value.seq }}<br />
        <span v-if="value.status === 4" class="tap_ok mt-10vh p-0.5vh">{{ findLabelByValue('TaskStatusOptions', value.status) }}</span>
        <span v-else-if="value.status === 5" class="tap_ng mt-10vh p-0.5vh">{{ findLabelByValue('TaskStatusOptions', value.status) }}</span>
        <span v-else class="tap_tip mt-10vh p-0.5vh">{{ findLabelByValue('TaskStatusOptions', value.status) }}</span>
      </div>
      <div class="w-27% text-left">
        任务号: {{ value.taskID }}<br /><span>批次号: {{ value.batchID }}</span>
        <div class="mt-1vh">
          <a-button type="link" class="btn_in mr-1vw" @click.stop="onItemClick('chakan', value)">查看证本列表</a-button>
          <a-button v-if="value.status < 3 && value.waitingNum > 0" type="link" class="btn_in mr-1vw" @click.stop="onItemClick('挂起', value)">挂起</a-button>
          <a-button v-if="(value.status === 3 || value.status === 5) && value.hangUpNum > 0" type="link" class="btn_in" @click.stop="onItemClick('恢复生产', value)">恢复生产</a-button>
        </div>
      </div>
      <div class="w-40%">
        <div class="flex justify-between">
          <div class="w-5vw">证本数: {{ value.docNum }}</div>
          <div class="w-5vw">挂起数: {{ value.hangUpNum }}</div>
          <div class="w-15vw">待生产数: {{ value.waitingNum }}</div>
        </div>
        <div class="flex justify-between">
          <div class="w-5vw">良本数: {{ value.productNum }}</div>
          <div class="w-5vw">废本数: {{ value.obsoleteNum }}</div>
          <div class="w-15vw">生产时间: {{ value.startTime }}</div>
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
import { App } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { findLabelByValue, TaskStatusOptions } from '@/plugins/option';

const props = defineProps<{ page: any; data: any[] }>();
const emit = defineEmits(['callback', 'page', 'data']);
const lang = locale;
const { notification } = App.useApp();

const formData: any = ref({ choose: 1, status: null });
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
    formData.value = { choose: 1, status: null };
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'search') {
    selects.value = [];
    pageIn.value = { total: 0, current: 1, size: 4 };
  } else if (key === 'page') {
    emit('callback', { key, formData: { choose: 1, ...formData.value }, page: pageIn.value });
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
.bg_jianbian {
  border: 2px solid transparent;
}
.selected {
  border: #64cf44 2px solid;
}
</style>
