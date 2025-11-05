<template>
  <div class="box-border w-full pb20">
    <div class="bg-[#fff]/[0.4] p-y-5px p-l-0.5em">
      <span>{{ t('moduleTest.InkjetPrinter.6bzjgd1h0bc0') }}</span>
    </div>
    <div class="w-full flex flex-wrap gap-20">
      <div
        v-for="(uvPrinters, index) in props.data"
        :key="index"
        class="w-full p-l-3em p-t-1em"
      >
        <div class="text-[18px]">
          {{ uvPrinters.printerName }}：
        </div>
        <main class="w-full flex items-end justify-start gap-50">
          <!-- 位置 -->
          <section>
            <div class="mt-10 w-full flex flex-col items-end gap-10">
              <div
                v-for="(item, itemIndex) in uvPrinters.positionItems"
                :key="itemIndex"
                class="text-[18px]"
              >
                {{ item.label }}：
                <a-select
                  v-if="!item.label.includes('mm')"
                  v-model:value="item.value"
                  size="large"
                  class="m-r-10 w-150px"
                >
                  <a-select-option
                    v-for="(option, optionIndex) in item.option"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
                <a-input
                  v-if="item.label.includes('mm')"
                  v-model:value="item.value"
                  placeholder="(0-1200)"
                  class="m-r-10 w-150px"
                  size="large"
                  :maxlength="4"
                  @input="validateInput($event, index)"
                  @touchstart="onInputFocus($event, index)"
                />

                <a-popover v-if="item.label.includes('mm')">
                  <template #content>
                    {{ getTips(index) }}
                  </template>
                  <QuestionCircleOutlined />
                  <!-- <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
                </a-popover>
                <span v-else class="select-none">&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </div>
            <div class="mt10 flex justify-evenly">
              <a-button
                type="link"
                class="btn hover:text-[#89f7ff]!"
                @click="
                  transfer('/uvpdps/moto-reposition', [
                    {
                      deviceIndex: uvPrinters.deviceIndex,
                      dev: uvPrinters.dev,
                    },
                  ])
                "
              >
                {{ t('moduleTest.InkjetPrinter.6bzjgd1h2080') }}
              </a-button>
              <a-button
                type="link"
                class="btn hover:text-[#89f7ff]!"
                @click="motoMove(uvPrinters, uvPrinters.positionItems)"
              >
                {{ t('moduleTest.InkjetPrinter.6bzjgd1h27c0') }}
              </a-button>
            </div>
          </section>

          <!-- 清洗 -->
          <section>
            <div class="mt-10 w-full flex flex-col items-end gap-10">
              <div
                v-for="(item, itemIndex) in uvPrinters.cleanItems"
                :key="itemIndex"
                class="text-[18px]"
              >
                {{ item.label }}：
                <a-select
                  v-model:value="item.value"
                  size="large"
                  class="m-r-10 w-150px"
                >
                  <a-select-option
                    v-for="(option, optionIndex) in item.option"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="mt10 flex justify-center">
              <a-button
                type="link"
                class="btn hover:text-[#89f7ff]!"
                @click="cleanHead(uvPrinters, uvPrinters.cleanItems)"
              >
                {{ t('moduleTest.InkjetPrinter.6bzjgd1h2cc0') }}
              </a-button>
            </div>
          </section>
          <!-- 打印平台 -->
          <section>
            <div class="mt-10 w-full flex flex-col items-center gap-10">
              <div
                v-for="(item, itemIndex) in uvPrinters.printItems"
                :key="itemIndex"
                class="text-[18px]"
              >
                {{ item.label }}：
                <a-select
                  v-model:value="item.value"
                  size="large"
                  class="m-r-10 w-150px"
                >
                  <a-select-option
                    v-for="(option, optionIndex) in item.option"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="mt10 flex justify-center">
              <a-button
                type="link"
                class="btn hover:text-[#89f7ff]!"
                @click="print(uvPrinters, uvPrinters.printItems)"
              >
                {{ t('moduleTest.InkjetPrinter.6bzjgd1h2io0') }}
              </a-button>
            </div>
          </section>
        </main>
        <div
          v-if="props.currentPage === 'InkjetPrinter'"
          v-show="props.showKeyboard"
        >
          <SimpleKeyboard
            ref="simpleKeyboard"
            :transform="transformValue"
            :input="cursorPosition?.target.value"
            keyboard-width="w20%"
            layout="num"
            :max-length="4"
            @on-change="onChangeKeyboard"
            @closekeyboard="props.setShowKeyboard(false, 'InkjetPrinter')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { App } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { getApiTransfer } from '@/apis/webApi';
import SimpleKeyboard from '@/components/base/simpleKeyboard.vue';
import { useAppStore } from '@/store/index';
import useCustomTimer from '@/utils/useCustomTimer';

const props = defineProps({
  data: Object,
  updateItem: Function,
  showKeyboard: Boolean,
  setShowKeyboard: Function,
  currentPage: String,
});
const { t } = useI18n();
const { start, stop } = useCustomTimer();
const { notification } = App.useApp();
async function motoMove(uvPrintersObj, arr) {
  const objs = [
    {
      deviceIndex: uvPrintersObj.deviceIndex,
      dev: uvPrintersObj.dev,
      axisType: Number(arr[0].value),
      target: arr[1].value,
    },
  ];
  transfer('/uvpdps/moto-move', objs);
}
async function cleanHead(uvPrintersObj, arr) {
  const objs = [
    {
      deviceIndex: uvPrintersObj.deviceIndex,
      dev: uvPrintersObj.dev,
      headID: Number(arr[0].value),
      intension: Number(arr[1].value),
    },
  ];
  transfer('/uvpdps/clean-head', objs);
}
async function print(uvPrintersObj, arr) {
  const objs = [
    {
      deviceIndex: uvPrintersObj.deviceIndex,
      dev: uvPrintersObj.dev,
      platform: Number(arr[0].value),
      isUseData: false,
    },
  ];
  transfer('/uvpdps/print', objs);
}

async function checkStatus(objs: any) {
  try {
    const params = {
      transURI: '/uvpdps/query-device-status',
      paraIn: {
        objs,
      },
    };
    const data = await getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      if (data.rslts[0].error !== 300 || data.rslts[0].warning !== 200) {
        // 有错有警告
        throw data.rslts[0].msg;
      }
      else {
        if (data.rslts[0].status === 101) {
          notification.success({
            message: this.t('moduleTest.InkjetPrinter.6bzjgd1h2n00'),
            description: this.t('moduleTest.InkjetPrinter.6bzjgd1h2uo0'),
            placement: 'bottomRight',
            class: 'notification-custom-class',
          });
          stop();
          useAppStore().setSpinning(false);
        }
      }
    }
    else {
      throw data.msg;
    }
  }
  catch (error) {
    notification.error({
      message: this.t('moduleTest.InkjetPrinter.6bzjgd1h2zc0'),
      description: error,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
    stop();
    useAppStore().setSpinning(false);
  }
}
async function transfer(url, objs) {
  try {
    useAppStore().setSpinning(true);
    const params = {
      transURI: url,
      paraIn: {
        objs,
      },
    };
    const data = await getApiTransfer(params);
    if (data.rslts[0].code === 0) {
      if (url === '/uvpdps/clean-head') {
        // 清洗结果查询
        setTimeout(() => {
          start(async () => {
            await checkStatus(objs);
          }, 3);
        }, 3000);
      }
      else {
        notification.success({
          message: this.t('moduleTest.InkjetPrinter.6bzjgd1h2n00'),
          description: this.t('moduleTest.InkjetPrinter.6bzjgd1h3400'),
          placement: 'bottomRight',
          class: 'notification-custom-class',
        });
        useAppStore().setSpinning(false);
      }
    }
    else {
      notification.error({
        message: this.t('moduleTest.InkjetPrinter.6bzjgd1h2zc0'),
        description: data.rslts[0].msg || this.t('moduleTest.InkjetPrinter.6bzjgd1h38k0'),
        placement: 'bottomRight',
        class: 'notification-custom-class',
      });
      useAppStore().setSpinning(false);
    }
  }
  catch (error) {
    notification.error({
      message: this.t('moduleTest.InkjetPrinter.6bzjgd1h2zc0'),
      description: error,
      placement: 'bottomRight',
      class: 'notification-custom-class',
    });
    useAppStore().setSpinning(false);
  }
}
function getTips(index) {
  const tips
    = props.data[index].positionItems[0].option[
      props.data[index].positionItems[0].value
    ].tips;
  return tips;
}

function validateInput(event, index) {
  console.log('🚀 ~ validateInput ~ event:', event);
  // 获取输入框的值
  let value = event.target.value;
  // 使用正则表达式限制输入为 0 到 1200 的正整数
  value = value.replace(/\D/g, ''); // 移除所有非数字字符
  event.target.value = value;
  if (value === '') {
    props.updateItem('uvPrinters', index, '0'); // 更新绑定值为空
    event.target.value = 0;
    return;
  }
  // 将输入值转换为整数
  value = Number.parseInt(value, 10);

  // 如果输入值大于1200，设置为1200
  if (value > 1200) {
    value = 1200;
  }
  props.updateItem('uvPrinters', index, value); // 更新绑定值
  // event.target.value = value; // 更新输入框显示
}

const changeIpt = ref(''); // 选择了哪个输入框
const simpleKeyboard = ref(null);
const transformValue = ref([0, -400]);
const cursorPosition = ref(null);
const verticalScrollDistance = ref(0);

function onInputFocus(event, res) {
  props.setShowKeyboard(true, 'InkjetPrinter');
  changeIpt.value = res;
  cursorPosition.value = event;
  // 获取组件的位置信息;
  const rect = event.target.getBoundingClientRect();
  console.log('🚀 ~ onInputFocus ~ rect:', rect);

  // 获取距离上方和左方的位置
  const top = rect.bottom + window.scrollY; // 距离页面顶部的位置

  const left = rect.left + window.scrollX; // 距离页面左侧的位置
  transformValue.value = [0, -300 - verticalScrollDistance.value];
  console.log('距离页面顶部的位置:', top);
  console.log('距离页面左侧的位置:', left);
}
// 给输入框赋值
function onChangeKeyboard(input, keyboard) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null)
    setInputCaretPosition(cursorPosition.value.target, caretPosition);
  console.log('🚀 ~ onChangeKeyboard ~ input:', input);

  let Newvalue = input;
  // 使用正则表达式限制输入为 0 到 1200 的正整数
  Newvalue = Newvalue.replace(/\D/g, ''); // 移除所有非数字字符
  if (Newvalue === '') {
    props.updateItem('uvPrinters', changeIpt.value, '0'); // 更新绑定值为空
    cursorPosition.value.target.value = 0;
    return;
  }
  // 将输入值转换为整数
  Newvalue = Number.parseInt(Newvalue, 10);

  // 如果输入值大于1200，设置为1200
  if (Newvalue > 1200) {
    Newvalue = 1200;
  }
  console.log('🚀 ~ onChangeKeyboard ~ Newvalue:', Newvalue);
  cursorPosition.value.target.value = Newvalue;
  props.updateItem('uvPrinters', changeIpt.value, Newvalue);
  // props.updateItem('uvPrinters', changeIpt.value, input);
}
function setInputCaretPosition(elem, pos) {
  setTimeout(() => {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  });
}
onMounted(() => {
  const scrollContainer = document.getElementById('scroll-container');
  /// 监听父元素的滚动事件
  scrollContainer.addEventListener('scroll', () => {
    // 获取滚动条在垂直方向上移动的距离
    verticalScrollDistance.value = scrollContainer.scrollTop;
  });
});
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
::v-deep(.ant-input-group-addon) {
  background: #fff;
}
.is-invalid {
  border-color: red; /* 输入框标红 */
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
}
</style>
