<template>
  <div class="setPage mt-14vh h-75vh w-94vw overflow-auto text-1.1vw">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="keyInputArr.length === 3 ? formData[keyInputArr[0]][keyInputArr[2]][keyInputArr[1]] : formData[keyInputArr[0]][keyInputArr[1]]" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="mb-7vh box-border w-full">
      <div class="absolute z-2 w-full flex bg-#03163e">
        <a-button type="link" class="btn_search mr-2vw w-8vw" @click="saveData">保存设置</a-button>
        <a-button type="link" class="btn_search w-8vw" @click="getData">读取</a-button>
      </div>
    </div>
    <div class="bgItem">
      <div class="bgItem_tit">系统设置</div>
      <section v-if="formData.systemConfig" class="bg_jianbian ml-2vw flex">
        <!-- <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">生产模式:</div>
          <a-select v-model:value="formData.systemConfig.produceMode" class="w-13vw" disabled>
            <a-select-option v-for="option in produceModeOptions" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
          </a-select>
        </div> -->
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">下发数据立刻启动:</div>
          <a-switch v-model:checked="formData.systemConfig.startAfterAddTask" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">TMS ip地址:</div>
          <a-input v-model:value="formData.systemConfig.ipTMS" :class="keyInput === 'systemConfig,ipTMS' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入" :maxlength="15" @click.stop="onInputFocus($event, ['systemConfig', 'ipTMS'], 15)" />
        </div>
        <div class="flex items-center">
          <div class="ml-2vw pr-0.5vw">本机IP:</div>
          <a-input v-model:value="formData.systemConfig.ipLocal" :class="keyInput === 'systemConfig,ipLocal' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入" :maxlength="15" @click.stop="onInputFocus($event, ['systemConfig', 'ipLocal'], 15)" />
        </div>
      </section>
      <section v-if="formData.docTypeConfig" class="bg_jianbian ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用提前配号:</div>
          <a-switch v-model:checked="formData.docTypeConfig.isPreDocID" />
        </div>
        <div v-if="formData.docTypeConfig.isSupportNormal" class="px-2.5vw">支持普通护照</div>
        <div v-if="formData.docTypeConfig.isSupportPublic" class="px-2.5vw">支持公务护照</div>
        <div v-if="formData.docTypeConfig.isSupportDiplomatic" class="px-2.5vw">支持外交护照</div>
        <div v-if="formData.docTypeConfig.isSupportNormalPublic" class="px-2.5vw">支持因公普通护照</div>
        <div v-if="formData.docTypeConfig.isSupportConsular" class="px-2.5vw">支持领事护照</div>
      </section>
    </div>
    <div class="bgItem">
      <div class="bgItem_tit">主副页喷墨起始打印位置</div>
      <section v-if="formData.uvMainOffset0" class="bg_jianbian ml-2vw flex">
        <div class="flex items-center">
          <div class="ml-2vw pr-0.5vw">X轴:</div>
          <a-input v-model:value="formData.uvMainOffset0.x" :class="keyInput === 'uvMainOffset0,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~1200" :maxlength="15" @click.stop="onInputFocus($event, ['uvMainOffset0', 'x'], 15)" />
          <div class="ml-0.5vw mr-5vw">mm</div>
        </div>
        <div class="flex items-center">
          <div class="ml-2vw pr-0.5vw">Y轴:</div>
          <a-input v-model:value="formData.uvMainOffset0.y" :class="keyInput === 'uvMainOffset0,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~1200" :maxlength="15" @click.stop="onInputFocus($event, ['uvMainOffset0', 'y'], 15)" />
          <div class="ml-0.5vw">mm</div>
        </div>
      </section>
    </div>
    <div class="bgItem">
      <div class="bgItem_tit">主副页喷墨定位基准</div>
      <template v-if="formData.uvBase0">
        <section v-for="(value, index) in formData.uvBase0" :key="index" class="bg_jianbian ml-2vw flex">
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">X坐标:</div>
            <a-input v-model:value="formData.uvBase0[index].x" :class="keyInput === `uvBase0,x,${index}` ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['uvBase0', 'x', index], 9)" />
            <div class="ml-0.5vw mr-5vw">0.001mm</div>
          </div>
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">Y坐标:</div>
            <a-input v-model:value="formData.uvBase0[index].y" :class="keyInput === `uvBase0,y,${index}` ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['uvBase0', 'y', index], 9)" />
            <div class="ml-0.5vw mr-5vw">0.001mm</div>
          </div>
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">角度:</div>
            <a-input v-model:value="formData.uvBase0[index].angle" :class="keyInput === `uvBase0,angle,${index}` ? 'keyInput' : ''" class="w-8vw" placeholder="请输入" :maxlength="8" @click.stop="onInputFocus($event, ['uvBase0', 'angle', index], 8)" />
            <div class="ml-0.5vw">0.001度</div>
          </div>
        </section>
      </template>
    </div>
    <div class="bgItem">
      <div class="bgItem_tit">激光定位基准</div>
      <template v-if="formData.laserBase0">
        <section v-for="(value, index) in formData.laserBase0" :key="index" class="bg_jianbian ml-2vw flex">
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">X坐标:</div>
            <a-input v-model:value="formData.laserBase0[index].x" :class="keyInput === `laserBase0,x,${index}` ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['laserBase0', 'x', index], 9)" />
            <div class="ml-0.5vw mr-5vw">0.001mm</div>
          </div>
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">Y坐标:</div>
            <a-input v-model:value="formData.laserBase0[index].y" :class="keyInput === `laserBase0,y,${index}` ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['laserBase0', 'y', index], 9)" />
            <div class="ml-0.5vw mr-5vw">0.001mm</div>
          </div>
          <div class="flex items-center">
            <div class="ml-2vw pr-0.5vw">角度:</div>
            <a-input v-model:value="formData.laserBase0[index].angle" :class="keyInput === `laserBase0,angle,${index}` ? 'keyInput' : ''" class="w-8vw" placeholder="请输入" :maxlength="8" @click.stop="onInputFocus($event, ['laserBase0', 'angle', index], 8)" />
            <div class="ml-0.5vw">0.001度</div>
          </div>
        </section>
      </template>
    </div>
    <div class="bgItem">
      <div class="bgItem_tit">工位配置</div>
      <section v-if="formData.positionConfig" class="bg_jianbian ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用正反本检测工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseDocPose" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用读芯片工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderRead" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用OCR工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseOcrPos" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用写芯片工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderWrite" />
        </div>
      </section>
      <section v-if="formData.positionConfig" class="bg_jianbian ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用激光定位工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseLaserLocation" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用激光标刻工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseLaserPrint" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用喷墨定位工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseUVLocation" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用喷墨打印工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseUVPrint" />
        </div>
      </section>
      <section v-if="formData.positionConfig" class="bg_jianbian ml-2vw flex">
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用质检工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseQuality" />
        </div>
        <div class="mr-3vw flex items-center">
          <div class="ml-2vw pr-0.5vw">启用芯片校验工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderVerify" />
        </div>
      </section>
    </div>
    <div class="absolute bottom-13vh right-7vw mt-3vh box-border w-18vw">
      <div class="flex justify-end">
        <a-button type="link" class="btn_search mr-2vw w-8vw" @click="setSuccessOpen(true)">密码设置</a-button>
        <a-button type="link" class="btn_search w-8vw" @click="openModal(true)">退出系统</a-button>
      </div>
    </div>
  </div>
  <ThePass v-if="successOpen" :open="successOpen" :handle-ok="() => setSuccessOpen(false)" :handle-cancel="() => setSuccessOpen(false)" title="设置密码" />
  <TheExit v-if="exitShow" :open="exitShow" :handle-ok="() => openModal(false)" :handle-cancel="() => openModal(false)" title="退出系统" />
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { setMoule } from '@/apis/proApi';
import TheExit from '@/components/TheExit.vue';
import ThePass from '@/pages/Set/components/ThePass.vue';
import { produceModeOptions } from '@/plugins/option';
import { useAppStore } from '@/store/index';

const exitShow = ref(false);
const successOpen = ref<boolean>(false);
function setSuccessOpen(value: boolean) {
  successOpen.value = value;
  hideKeyboard();
}

// 弹窗操作
function openModal(value: boolean) {
  exitShow.value = value;
  hideKeyboard();
}
const { notification } = App.useApp();
const { t } = useI18n();

const formData: any = ref({});
const showKeyboard = ref(false);
const keyInput = ref('');
const keyInputArr = ref([]);
const limitInput = ref(0);
const cursorPosition = ref(null);
const transformValue: any = ref(null);

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
  keyInputArr.value = [];
}

function onInputFocus(event: any, text: any, limit = 0) {
  if (keyInput.value !== text) {
    showKeyboard.value = true;
    keyInput.value = text.toString();
    keyInputArr.value = text;
    limitInput.value = limit;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [0, top - 100];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  if (keyInputArr.value[2] >= 0) formData.value[keyInputArr.value[0]][keyInputArr.value[2]][keyInputArr.value[1]] = input;
  else formData.value[keyInputArr.value[0]][keyInputArr.value[1]] = input;
  function setInputCaretPosition(element: any, pos: any) {
    setTimeout(() => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(pos, pos);
      }
    }, 100);
  }
}

async function getData() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await setMoule.getSystemPara();
    formData.value = data.respData || {};
    for (const item in formData.value) {
      for (const item2 in formData.value[item]) {
        if (typeof formData.value[item][item2] === 'object') {
          for (const item3 in formData.value[item][item2]) {
            formData.value[item][item2][item3] = String(formData.value[item][item2][item3]);
          }
        } else {
          if (typeof formData.value[item][item2] !== 'boolean') formData.value[item][item2] = String(formData.value[item][item2]);
        }
      }
    }
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function saveData() {
  try {
    let reg;
    useAppStore().setSpinning(true);
    let tit = '';
    let error = '';
    const temp = JSON.parse(JSON.stringify(formData.value));
    for (const item in temp) {
      for (const item2 in temp[item]) {
        if (typeof temp[item][item2] === 'object') {
          for (const item3 in temp[item][item2]) {
            if (item3 === 'x' || item3 === 'y' || item3 === 'angle') {
              if (item === 'laserBase0') tit = `激光定位基准${temp[item][item2].position}`;
              else if (item === 'uvBase0') tit = `主副页喷墨定位基准${temp[item][item2].position}`;
              if (item3 === 'x') tit = `${tit}X坐标`;
              else if (item3 === 'y') tit = `${tit}y坐标`;
              else if (item3 === 'angle') tit = `${tit}角度`;
              if (item3 === 'angle') {
                reg = /^-?(?:360000|3[0-5]\d{4}|[0-2]?\d{1,5})$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是-360000~360000内`;
              } else {
                reg = /^(?:30000(?:\.0{1,3})?|(?:[12]\d{4}|[1-9]\d{0,3}|0)(?:\.\d{1,3})?)$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是0~30000内`;
              }
            }
            if (!Number.isNaN(Number(temp[item][item2][item3]))) temp[item][item2][item3] = Number(temp[item][item2][item3]);
          }
        } else {
          if (item2 === 'ipLocal' || item2 === 'ipTMS') {
            if (item2 === 'ipLocal') tit = 'TMS ip地址';
            else if (item2 === 'ipTMS') tit = '本机IP';
            reg = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/;
            if (!temp[item][item2].match(reg) || temp[item][item2] === '') error = `${tit}格式有误`;
          } else if (item2 === 'x' || item2 === 'y') {
            if (item2 === 'x') tit = '主副页喷墨起始打印位置X轴';
            else if (item2 === 'y') tit = '主副页喷墨起始打印位置Y轴';
            reg = /^(?:1200(?:\.0{1,3})?|(?:1[01]?\d{0,2}|[1-9]\d{0,2}|0)(?:\.\d{1,3})?)$/;
            if (!temp[item][item2].match(reg)) error = `${tit}有误，应该是0~1200内`;
          }
          if (!Number.isNaN(Number(temp[item][item2])) && typeof temp[item][item2] !== 'boolean') temp[item][item2] = Number(temp[item][item2]);
        }
      }
    }
    if (error) throw error;
    await setMoule.setSystemPara(temp);
    notification.success({ message: t('成功'), description: t('保存成功'), class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: t('错误'), description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.setPage {
  .bgItem {
    margin-top: 2vh;
    .bgItem_tit {
      font-size: 1.2vw;
      font-weight: bold;
      padding-bottom: 1vh;
    }
  }
  .bg_jianbian {
    margin: 1vh 0;
  }
  ::v-deep(.ant-input),
  ::v-deep(.ant-select-selector),
  ::v-deep(.ant-picker-range) {
    font-size: 1.2vw;
    background-color: transparent !important;
    color: #ffffff;
    border-width: 2px !important;
    height: 4vh !important;
    border-radius: 0;
    min-width: 7.5vw;
  }
  ::v-deep(.ant-select-selection-item) {
    line-height: 3.5vh !important;
  }
  ::v-deep(.ant-picker-range input),
  ::v-deep(.ant-select-selection-item) {
    font-size: 1.2vw;
    color: #ffffff !important;
  }
  ::v-deep(.ant-input::placeholder),
  ::v-deep(.ant-select-selection-placeholder),
  ::v-deep(.ant-picker-input input::placeholder) {
    color: #989ca1;
  }
  ::v-deep(.anticon svg) {
    color: #e2e5eb;
  }
  ::v-deep(.ant-switch-checked .ant-switch-inner) {
    background: #3662ec;
  }
  ::v-deep(.ant-switch-inner) {
    background: #d8d8d8;
  }
}
</style>
