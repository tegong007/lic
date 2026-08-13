<template>
  <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="formData[keyInput]" :max-length="30" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  <div class="mt-2vh w-100% flex" @click="hideKeyboard">
    <!-- 左侧标题：主副页记录 / 加注页记录 -->
    <div class="ml-1vw w-15vw flex-shrink-0 text-1.5vw">
      <div class="bgNav" :class="checkType === 0 ? 'actived' : ''" @click="switchCheckType(0)">
        <span>主副页记录</span>
      </div>
      <div class="bgNav" :class="checkType === 1 ? 'actived' : ''" @click="switchCheckType(1)">
        <span>加注页记录</span>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="flex-1 pr-2vw">
      <div class="mb-2vh flex items-center gap-1vw">
        <a-form-item label="证本号" name="docID">
          <a-input v-model:value="formData.docID" :class="keyInput === 'docID' ? 'keyInput' : ''" class="w-12vw bg-transparent" placeholder="请输入" :maxlength="30" @click.stop="onInputFocus($event, 'docID')" />
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
        <a-form-item>
          <a-button type="link" class="btn_search mr-0.5vw" @click="onBtnClick('search')">查询</a-button>
          <a-button type="link" class="btn_search mr-0.5vw" @click="onBtnClick('clear')">清空</a-button>
          <a-button type="link" class="btn_search" @click="onBtnClick('refresh')">刷新</a-button>
        </a-form-item>
      </div>

      <div class="flex justify-start gap-2vw">
        <div class="w-100%">
          <div v-for="(value, index) in lists" :key="index" class="bg_jianbian mb-1vh flex cursor-pointer justify-between text-1vw line-height-2vh" @click="onItemClick(value, index)">
            <div>{{ value.time }}</div>
            <div class="w-9vw">证件号: {{ value.docID }}</div>
            <div>结果: <span v-if="!value.docID">检测中…</span><span v-else-if="value.qualityResult === 0" class="ok">良品</span><span v-else class="no">不良品</span></div>
            <div v-if="detailI !== index">展开 ▼</div>
            <div v-else>收起 ▲</div>
          </div>
        </div>
        <div v-if="detail.open" class="bgC2">
          <div class="pt-2.5vh text-center text-1.3vw">质检结果</div>
          <div class="bgB mt-2.5vh flex justify-around py-1vh text-1vw">
            <div>{{ detail.item.time || '--' }}</div>
            <div>证件号：{{ detail.item.docID || '--' }}</div>
            <div>结果：<span v-if="!detail.item.docID">检测中…</span><span v-else-if="detail.item.qualityResult === 0" class="ok">良品</span><span v-else class="no">不良品</span></div>
          </div>
          <div class="flex">
            <table class="tb1 ml-2vw mt-2vh w-50% text-1vw">
              <thead>
                <tr>
                  <th class="pb-2vh">序号</th>
                  <th class="pb-2vh">检测项</th>
                  <th class="pb-2vh">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, index) in items" :key="index">
                  <td>0{{ index + 1 }}</td>
                  <td class="tb1-lab" :class="detail.item.docID && detail.item.checkedItem[value.key] ? 'err' : ''">
                    <div>{{ value.name }}</div>
                  </td>
                  <td class="tb1-ico">
                    <img v-if="detail.item.docID && !detail.item.checkedItem[value.key]" src="@/assets/image/ico_ok.png" />
                    <img v-else-if="detail.item.docID && detail.item.checkedItem[value.key]" src="@/assets/image/ico_no.png" />
                    <img v-else src="@/assets/image/ico_wait.png" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ml-1vw mt-2vh w-40% flex items-start justify-around gap-1vw">
              <div v-if="detail.item.markedImage" class="w-30%">
                <div class="text-center text-1vw">紫外图</div>
                <img :src="`data:image/png;base64,${detail.item.markedImage}`" class="w-100% cursor-pointer" @click="viewImage([`data:image/png;base64,${detail.item.markedImage}`])" />
              </div>
              <div v-if="detail.item.irlImgData" class="w-30%">
                <div class="text-center text-1vw">红外图</div>
                <img :src="`data:image/png;base64,${detail.item.irlImgData}`" class="w-100% cursor-pointer" @click="viewImage([`data:image/png;base64,${detail.item.irlImgData}`])" />
              </div>
              <div v-if="detail.item.uvlImgData" class="w-30%">
                <div class="text-center text-1vw">白光图</div>
                <img :src="`data:image/png;base64,${detail.item.uvlImgData}`" class="w-100% cursor-pointer" @click="viewImage([`data:image/png;base64,${detail.item.uvlImgData}`])" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <vxe-pager v-if="lists.length > 0" v-model:current-page="pageIn.current" v-model:page-size="pageIn.size" :total="page.total" :layouts="['Home', 'PrevPage', 'Number', 'NextPage', 'End']" @page-change="onPageChange">
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
  </div>
</template>

<script lang="ts" setup>
import { App } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { api } from 'v-viewer';
import { checkModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const props = defineProps<{ defaultCheckType?: number }>();
const { notification } = App.useApp();
const lang = locale;

const checkType = ref(props.defaultCheckType ?? 0);
const formData: any = ref({ result: null });
const pageIn = ref({ total: 0, current: 1, size: 5 });
const page = ref({ total: 0, size: 5 });
const lists = ref<any[]>([]);

// 键盘
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

// 切换主副页 / 加注页
function switchCheckType(t: number) {
  if (t === checkType.value) return;
  checkType.value = t;
  detailI.value = -1;
  detail.value = { open: false, item: {} };
  pageIn.value = { total: 0, current: 1, size: 5 };
  getData();
}

// 加载记录（带 checkType）
async function getData() {
  try {
    useAppStore().setSpinning(true);
    const temp: any = formData.value.dateRange || ['', ''];
    const data: any = await checkModule.qualityCheckHistoy({
      ...formData.value,
      dateRange: undefined,
      beginDate: temp[0],
      endDate: temp[1],
      checkType: checkType.value,
      page: pageIn.value.current,
      rowPerPage: 5,
    });
    if (data.respData) {
      lists.value = data.respData.checkedInfo || [];
      page.value = { total: data.respData.totalRows || 0, size: data.respData.rowPerPage || 5 };
      pageIn.value = { total: data.respData.totalRows || 0, current: data.respData.page || 1, size: data.respData.rowPerPage || 5 };
      if (!(page.value.total > 0)) notification.error({ message: '完成', description: '搜索完成，没有搜到有效数据', placement: 'bottomRight', class: 'notification-custom-class' });
    } else {
      lists.value = [];
    }
  } catch (error) {
    lists.value = [];
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
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
    pageIn.value = { total: 0, current: 1, size: 5 };
  } else if (key === 'search') {
    pageIn.value = { total: 0, current: 1, size: 5 };
  } else if (key === 'page') {
    getData();
    return;
  }
  getData();
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

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 15vw;
  text-align: center;
  height: 10vh;
  line-height: 8vh;
  margin-bottom: 1vh;
  white-space: nowrap;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
:::v-deep(.ant-form-item) {
  margin-bottom: 0;
  .ant-form-item-row {
    display: flex;
    align-items: center;
  }
  .ant-form-item-label {
    line-height: normal;
    padding: 0;
    overflow: visible;
  }
  .ant-form-item-control-input {
    min-height: auto;
  }
}
.bg_jianbian {
  span {
    box-shadow:
      0px 4px 4px 0px #00000040,
      inset 0px -1px 1px 0px #ffffff57;
    border: 1px solid #3f89dd;
    background: linear-gradient(359deg, #ffffff35 1%, #008eff4a 98%);
    font-size: 0.8vw;
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
.bgC2 {
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/image/bg_c2x.png');
  span {
    box-shadow:
      0px 4px 4px 0px #00000040,
      inset 0px -1px 1px 0px #ffffff57;
    border: 1px solid #3f89dd;
    background: linear-gradient(359deg, #ffffff35 1%, #008eff4a 98%);
    font-size: 0.8vw;
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
  .bgB {
    background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
  }
  .tb1 {
    td {
      &.tb1-lab div {
        padding-left: 0.5vw;
        text-align: left;
        background: linear-gradient(358deg, #ffffff35 11%, #008eff4a 87%);
        box-shadow:
          0px 3.67px 3.67px 0px #00000040,
          inset 0px -0.92px 0.92px 0px #ffffff57;
        border: 0.92px solid #3f89dd;
      }
      &.err div {
        border: 0.92px solid #ff0000;
        background: #facdcd;
        color: #e31008;
      }
      &.tb1-ico {
        img {
          display: block;
          margin: 0.7vh auto 0 auto;
          width: 2vw;
        }
      }
    }
  }
}
:::v-deep(.vxe-pager) {
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
