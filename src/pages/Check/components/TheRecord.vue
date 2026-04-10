<template>
  <div class="ml-2vw mt-2vh w-95%" @click="hideKeyboard">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="30" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="flex items-center gap-1vw">
      <a-form-item label="证本号" name="docID">
        <a-input v-model:value="formData.docID" :class="keyInput === 'docID' ? 'keyInput' : ''" class="w-15vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'docID')" />
      </a-form-item>
      <a-form-item label="结果" name="status">
        <a-select v-model:value="formData.result">
          <a-select-option :value="null">全部</a-select-option>
          <a-select-option :value="0">良品</a-select-option>
          <a-select-option :value="1">不良品</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间范围" name="status">
        <a-range-picker v-model:value="formData.dateRange" :locale="lang" value-format="YYYY-MM-DD" input-read-only :allow-clear="false" />
      </a-form-item>
      <div class="mb-4vh flex items-center justify-end">
        <a-button type="link" class="btn_search mx-1vw" @click="onBtnClick('search')">查询</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('clear')">清空</a-button>
        <a-button type="link" class="btn_search mr-1vw" @click="onBtnClick('refresh')">刷新</a-button>
      </div>
    </div>
    <div class="recordList flex justify-start">
      <div class="w-100%">
        <div v-for="(value, index) in data" :key="index" class="bg_listItem mb-1vh flex cursor-pointer justify-between line-height-2vh" :class="detailI === index ? 'border-2px border-#3662ec border-r-0' : ''" @click="onItemClick(value, index)">
          <div>{{ value.time }}</div>
          <div class="w-11vw">证件号: {{ value.docID }}</div>
          <div class="result_span">结果: <span v-if="!value.docID">检测中…</span><span v-else-if="value.qualityResult === 0" class="ok">良品</span><span v-else class="no">不良品</span></div>
          <div v-if="detailI !== index">展开 ▼</div>
          <div v-else>收起 ▲</div>
        </div>
      </div>
      <div v-if="detail.open" class="bg_detail">
        <div class="ml-2vw text-center">
          <div class="bg_detail_tit mx-auto w-8vw pt-0.5vh text-center text-0.8vw font-bold">质检结果</div>
          <div class="mb-2vh mt-3vh">{{ detail.item.time || '--' }}</div>
          <div class="mb-4vh">证件号：{{ detail.item.docID || '--' }}</div>
          <div class="result_span">结果：<span v-if="!detail.item.docID">检测中…</span><span v-else-if="detail.item.qualityResult === 0" class="ok">良品</span><span v-else class="no">不良品</span></div>
        </div>
        <table class="ml-2vw mt-0.5vh w-15vw">
          <tr>
            <th class="pb-0.1vh">序号</th>
            <th class="pb-0.1vh">检测项</th>
            <th class="pb-0.1vh">状态</th>
          </tr>
          <tr v-for="(value, index) in items" :key="index">
            <td>0{{ Number(index) + 1 }}</td>
            <td>
              <div class="tblab" :class="detail.item.docID && detail.item.checkedItem[value.key] ? 'err' : ''">{{ value.name }}</div>
            </td>
            <td class="tbico">
              <img v-if="detail.item.docID && !detail.item.checkedItem[value.key]" src="@/assets/image/ico_ok.png" />
              <img v-else-if="detail.item.docID && detail.item.checkedItem[value.key]" src="@/assets/image/ico_no.png" />
              <img v-else src="@/assets/image/ico_wait.png" />
            </td>
          </tr>
        </table>
        <div v-if="detail.item.markedImage" class="w-30% flex items-center justify-end bg-red">
          <img :src="`data:image/png;base64,${detail.item.markedImage}`" class="w-75%" @click="viewImage([`data:image/png;base64,${detail.item.markedImage}`])" />
        </div>
      </div>
    </div>
    <vxe-pager v-if="data.length > 0" v-model:current-page="pageIn.current" v-model:page-size="pageIn.size" :total="page.total" :layouts="['Home', 'PrevPage', 'Number', 'NextPage', 'End']" @page-change="onPageChange">
      <template #right>
        <div class="relative top-1">
          <span>共{{ Math.ceil(page.total / page.size) }}页，{{ page.total }}条记录</span>
          <a-select v-if="page.total > 0" v-model:value="pageIn.current" class="scale-80 text-center" @change="onBtnClick('page')">
            <a-select-option v-for="(value, index) in Math.ceil(page.total / page.size)" :key="index" :value="value">第{{ value }}页</a-select-option>
          </a-select>
        </div>
      </template>
    </vxe-pager>
  </div>
</template>

<script lang="ts" setup>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { api } from 'v-viewer';

const props = defineProps<{ page: any; data: any[] }>();
const emit = defineEmits(['callback', 'page', 'data']);
const lang = locale;

const formData: any = ref({ result: null });
const pageIn = ref(props.page);
const showKeyboard = ref(false);
const keyInput = ref('');
const cursorPosition = ref(null);
const transformValue: any = ref(null);
const detail: any = ref({ open: false, item: {} });
const detailI: any = ref(-1);
const items = [
  { name: '主页缺色', key: 'mainColorLack' },
  { name: '主页脏污', key: 'mainDirty' },
  { name: '主页打印内容缺失', key: 'mainMissed' },
  { name: '人像重影', key: 'mainGhosting' },
  { name: '副页缺色', key: 'subColorLack' },
  { name: '副页脏污', key: 'subDirty' },
  { name: '副页打印内容缺失', key: 'subMissed' },
  { name: '副页折角', key: 'subWrinkle' },
];

function viewImage(list: string[]) {
  api({ images: list, options: { navbar: false, title: false, toolbar: false, rotatable: false } });
}

// 翻页事件
function onPageChange(event: any) {
  detailI.value = -1;
  detail.value = { open: false, item: {} };
  pageIn.value = { total: pageIn.value.total, current: event.currentPage, size: event.pageSize };
  onBtnClick('page');
}

// 搜索栏按钮事件
function onBtnClick(key: string) {
  detail.value = { open: false, item: {} };
  if (key === 'clear') {
    formData.value = { result: null };
    pageIn.value = { total: 0, current: 1, size: 10 };
  } else if (key === 'search') {
    pageIn.value = { total: 0, current: 1, size: 10 };
  } else if (key === 'page') {
    emit('callback', { key, formData: formData.value, page: pageIn.value });
    return;
  }
  emit('callback', { key, formData: formData.value, page: pageIn.value });
}

// 表格按钮事件
function onItemClick(item: any, index: number) {
  if (detailI.value === index) {
    detailI.value = -1;
    detail.value = { open: false, item: {} };
  } else {
    detailI.value = index;
    detail.value = { open: true, item };
  }
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
.recordList {
  .bg_listItem {
    font-size: 0.8vw;
  }
  .bg_detail {
    width: 50%;
    margin-top: 2vh;
    display: flex;
    flex-shrink: 0;
    border: 2px solid #3662ec;
    box-sizing: border-box;
    height: 39.5vh;
    overflow: auto;
    .bg_detail_tit {
      background: url('@/assets/image/bg_navItem.png') no-repeat;
      background-size: cover;
    }
    table tr {
      font-size: 0.5vw;
      th {
        height: auto;
      }
      td {
        text-align: center;
        &.tbico img {
          margin: 0 auto;
          width: 35%;
        }
        .tblab {
          text-align: left;
          background: linear-gradient(358deg, #ffffff35 11%, #008eff4a 87%);
          box-shadow:
            0px 3.67px 3.67px 0px #00000040,
            inset 0px -0.92px 0.92px 0px #ffffff57;
          border: 0.92px solid #3f89dd;
          padding-left: 0.5vw;
          &.err {
            border: 0.92px solid #ff0000;
            background: #facdcd;
            color: #e31008;
          }
        }
      }
    }
  }
  .result_span {
    span {
      box-shadow:
        0px 4px 4px 0px #00000040,
        inset 0px -1px 1px 0px #ffffff57;
      border: 1px solid #3f89dd;
      background: linear-gradient(359deg, #ffffff35 1%, #008eff4a 98%);
      font-size: 0.7vw;
      padding: 0.5vh 0.5vw;
      &.ok {
        color: #5fcc34;
        background: #ebffee;
        border: 2px solid #6fd662;
      }
      &.no {
        color: #e31008;
        background: #facdcd;
        border: 2px solid #ff0000;
      }
    }
  }
}

::v-deep(.ant-form-item-label label) {
  color: #ffffff;
  font-size: 0.8vw;
}
::v-deep(.ant-picker-range) {
  font-size: 0.8vw;
  background-color: transparent !important;
  color: #ffffff;
  border-width: 1px !important;
  height: 6vh !important;
  border-radius: 0;
  min-width: 5vw;
}
::v-deep(.ant-picker-range input) {
  font-size: 0.8vw;
  color: #ffffff !important;
}
::v-deep(.ant-picker-input input::placeholder) {
  color: #989ca1;
}
::v-deep(.anticon svg) {
  color: #e2e5eb;
}
::v-deep(.vxe-pager) {
  font-size: 0.8vw;
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
