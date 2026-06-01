<template>
  <TheFooter />
  <div class="mx-auto mt-1.5vh h-77vh w-95% overflow-auto">
    <SimpleKeyboard v-if="showKeyboard" :transform="transformValue" :input="keyInputArr.length === 3 ? formData[keyInputArr[0]][keyInputArr[2]][keyInputArr[1]] : formData[keyInputArr[0]][keyInputArr[1]]" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <div class="bgSet_item">
      <div class="bgSet_tit">系统设置</div>
      <section v-if="formData.systemConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">下发数据立刻启动:</div>
          <a-switch v-model:checked="formData.systemConfig.startAfterAddTask" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">初始化时清洗喷头:</div>
          <a-switch v-model:checked="formData.systemConfig.isCleanUvWhenInit" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用提前配号:</div>
          <a-switch v-model:checked="formData.docTypeConfig.isPreDocID" />
        </div>
      </section>
      <section v-if="formData.docTypeConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">TMS ip地址:</div>
          <a-input v-model:value="formData.systemConfig.ipTMS" :class="keyInput === 'systemConfig,ipTMS' ? 'keyInput' : ''" class="w-20vw" placeholder="请输入" :maxlength="15" @click.stop="onInputFocus($event, ['systemConfig', 'ipTMS'], 15)" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">本机IP:</div>
          <a-input v-model:value="formData.systemConfig.ipLocal" :class="keyInput === 'systemConfig,ipLocal' ? 'keyInput' : ''" class="w-20vw" placeholder="请输入" :maxlength="15" @click.stop="onInputFocus($event, ['systemConfig', 'ipLocal'], 15)" />
        </div>
      </section>
      <section v-if="formData.docTypeConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">支持护照类型:</div>
          <div class="bgSet_itemIn gap-2vw">
            <div v-if="formData.docTypeConfig.isSupportNormal"><span></span>普通护照</div>
            <div v-if="formData.docTypeConfig.isSupportPublic"><span></span>公务护照</div>
            <div v-if="formData.docTypeConfig.isSupportDiplomatic"><span></span>外交护照</div>
            <div v-if="formData.docTypeConfig.isSupportNormalPublic"><span></span>因公普通护照</div>
            <div v-if="formData.docTypeConfig.isSupportConsular"><span></span>领事护照</div>
          </div>
        </div>
      </section>
    </div>
    <div class="bgSet_item">
      <div class="bgSet_tit">主副页喷墨起始打印位置</div>
      <section v-if="formData.uvMainOffsetHigh" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">X轴:</div>
          <a-input v-model:value="formData.uvMainOffsetHigh.x" :class="keyInput === 'uvMainOffsetHigh,x' ? 'keyInput' : ''" class="w-14vw" placeholder="请输入0~20000" :maxlength="9" @click.stop="onInputFocus($event, ['uvMainOffsetHigh', 'x'], 9)" />
          <div class="bgSet_itemIn_desc">0.001mm</div>
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">Y轴:</div>
          <a-input v-model:value="formData.uvMainOffsetHigh.y" :class="keyInput === 'uvMainOffsetHigh,y' ? 'keyInput' : ''" class="w-14vw" placeholder="请输入0~20000" :maxlength="9" @click.stop="onInputFocus($event, ['uvMainOffsetHigh', 'y'], 9)" />
          <div class="bgSet_itemIn_desc">0.001mm</div>
        </div>
      </section>
    </div>
    <div class="bgSet_item">
      <div class="bgSet_tit">主副页喷墨定位基准</div>
      <template v-if="formData.uvBaseHigh">
        <section v-for="(value, index) in formData.uvBaseHigh" :key="index" class="bg_listItem flex-col">
          <div class="flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">X坐标:</div>
              <a-input v-model:value="formData.uvBaseHigh[index].x" :class="keyInput === `uvBaseHigh,x,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['uvBaseHigh', 'x', index], 9)" />
              <div class="bgSet_itemIn_desc">0.001mm</div>
            </div>
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">Y坐标:</div>
              <a-input v-model:value="formData.uvBaseHigh[index].y" :class="keyInput === `uvBaseHigh,y,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入0~30000" :maxlength="9" @click.stop="onInputFocus($event, ['uvBaseHigh', 'y', index], 9)" />
              <div class="bgSet_itemIn_desc">0.001mm</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">角度:</div>
              <a-input v-model:value="formData.uvBaseHigh[index].angle" :class="keyInput === `uvBaseHigh,angle,${index}` ? 'keyInput' : ''" class="w-8vw" placeholder="请输入" :maxlength="8" @click.stop="onInputFocus($event, ['uvBaseHigh', 'angle', index], 8)" />
              <div class="bgSet_itemIn_desc">0.001度</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">X偏移:</div>
              <a-input v-model:value="formData.uvBaseHigh[index].offsetX" :class="keyInput === `uvBaseHigh,offsetX,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-10000 ~ 10000" :maxlength="6" @click.stop="onInputFocus($event, ['uvBaseHigh', 'offsetX', index], 6)" />
              <div class="bgSet_itemIn_desc">0.001mm(向左为负/向右为正)</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">Y偏移:</div>
              <a-input v-model:value="formData.uvBaseHigh[index].offsetY" :class="keyInput === `uvBaseHigh,offsetY,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-10000 ~ 10000" :maxlength="6" @click.stop="onInputFocus($event, ['uvBaseHigh', 'offsetY', index], 6)" />
              <div class="bgSet_itemIn_desc">0.001mm(向上为负/向下为正)</div>
            </div>
          </div>
        </section>
      </template>
    </div>
    <div class="bgSet_item">
      <div class="bgSet_tit">激光定位基准</div>
      <template v-if="formData.laserBaseHigh">
        <section v-for="(value, index) in formData.laserBaseHigh" :key="index" class="bg_listItem flex-col">
          <div class="mb-2vh">激光器{{ Number(index) + 1 }}</div>
          <div class="flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">X坐标:</div>
              <a-input v-model:value="formData.laserBaseHigh[index].x" :class="keyInput === `laserBaseHigh,x,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-90000~90000" :maxlength="10" @click.stop="onInputFocus($event, ['laserBaseHigh', 'x', index], 10)" />
              <div class="bgSet_itemIn_desc">0.001mm</div>
            </div>
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">Y坐标:</div>
              <a-input v-model:value="formData.laserBaseHigh[index].y" :class="keyInput === `laserBaseHigh,y,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-30000~30000" :maxlength="10" @click.stop="onInputFocus($event, ['laserBaseHigh', 'y', index], 10)" />
              <div class="bgSet_itemIn_desc">0.001mm</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">角度:</div>
              <a-input v-model:value="formData.laserBaseHigh[index].angle" :class="keyInput === `laserBaseHigh,angle,${index}` ? 'keyInput' : ''" class="w-8vw" placeholder="请输入" :maxlength="8" @click.stop="onInputFocus($event, ['laserBaseHigh', 'angle', index], 8)" />
              <div class="bgSet_itemIn_desc">0.001度</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">X偏移:</div>
              <a-input v-model:value="formData.laserBaseHigh[index].offsetX" :class="keyInput === `laserBaseHigh,offsetX,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-10000 ~ 10000" :maxlength="6" @click.stop="onInputFocus($event, ['laserBaseHigh', 'offsetX', index], 6)" />
              <div class="bgSet_itemIn_desc">0.001mm(向左为负/向右为正)</div>
            </div>
          </div>
          <div class="mt-1vh flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">Y偏移:</div>
              <a-input v-model:value="formData.laserBaseHigh[index].offsetY" :class="keyInput === `laserBaseHigh,offsetY,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入-10000 ~ 10000" :maxlength="6" @click.stop="onInputFocus($event, ['laserBaseHigh', 'offsetY', index], 6)" />
              <div class="bgSet_itemIn_desc">0.001mm(向上为负/向下为正)</div>
            </div>
          </div>
        </section>
      </template>
    </div>
    <div class="bgSet_item">
      <div class="bgSet_tit">激光高度调整</div>
      <template v-if="formData.laserHeight">
        <section v-for="(value, index) in formData.laserHeight" :key="index" class="bg_listItem">
          <div class="flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">激光器{{ Number(index) + 1 }}:</div>
              <a-input v-model:value="formData.laserHeight[index]" :class="keyInput === `laserHeight,${index}` ? 'keyInput' : ''" class="w-14vw" placeholder="请输入0~90000" :maxlength="9" @click.stop="onInputFocus($event, ['laserHeight', index], 9)" />
              <div class="bgSet_itemIn_desc">0.1mm</div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <div class="bgSet_item">
      <div class="bgSet_tit">收本槽启用</div>
      <template v-if="formData.collectSlotEnable">
        <section v-for="(value, index) in formData.collectSlotEnable" :key="index" class="bg_listItem">
          <div class="flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">收本槽{{ index }}:</div>
              <a-switch :checked="formData.collectSlotEnable[index] === '1'" @update:checked="(val: any) => (formData.collectSlotEnable[index] = val ? '1' : '0')" />
            </div>
          </div>
        </section>
      </template>
    </div>

    <div class="bgSet_item">
      <div class="bgSet_tit">装本槽启用</div>
      <template v-if="formData.loadSlotEnable">
        <section v-for="(value, index) in formData.loadSlotEnable" :key="index" class="bg_listItem">
          <div class="flex">
            <div class="bgSet_itemIn">
              <div class="bgSet_itemIn_tit">装本槽{{ index }}:</div>
              <a-switch :checked="formData.loadSlotEnable[index] === '1'" @update:checked="(val: any) => (formData.loadSlotEnable[index] = val ? '1' : '0')" />
            </div>
          </div>
        </section>
      </template>
    </div>

    <div class="bgSet_item">
      <div class="bgSet_tit">工位配置</div>
      <section v-if="formData.positionConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用正反本检测工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseDocPose" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用读芯片工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderRead" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用OCR工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseOcrPos" />
        </div>
      </section>
      <section v-if="formData.positionConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用写芯片工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderWrite" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用激光定位工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseLaserLocation" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用激光标刻工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseLaserPrint" />
        </div>
      </section>
      <section v-if="formData.positionConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用喷墨定位工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseUVLocation" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用喷墨打印工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseUVPrint" />
        </div>
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用质检工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseQuality" />
        </div>
      </section>
      <section v-if="formData.positionConfig" class="bg_listItem">
        <div class="bgSet_itemIn">
          <div class="bgSet_itemIn_tit">启用芯片校验工位:</div>
          <a-switch v-model:checked="formData.positionConfig.isUseReaderVerify" />
        </div>
      </section>
    </div>
  </div>
  <div class="fixed bottom-5vh left-3vw right-3vw flex justify-between py-2vh">
    <div>
      <a-button type="link" class="btn_normal mr-2vw w-18.5vw" @click="saveData">保存设置</a-button>
      <a-button type="link" class="btn_normal w-18.5vw" @click="getData">读取</a-button>
    </div>
    <div>
      <a-button type="link" class="btn_normal mr-2vw w-18.5vw" @click="setSuccessOpen(true)">密码设置</a-button>
      <a-button type="link" class="btn_normal w-18.5vw" @click="handleExit">退出系统</a-button>
    </div>
  </div>
  <TheConfirm v-if="modal.open" :open="modal.open" :title="modal.title" :desc="modal.desc" :data="modal.data" :handle-ok="modal.handleOk" :handle-cancel="() => setModal(-1)" />
  <ThePass v-if="successOpen" :open="successOpen" :handle-ok="() => setSuccessOpen(false)" :handle-cancel="() => setSuccessOpen(false)" title="设置密码" />
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { setMoule } from '@/apis/proApi';
import TheConfirm from '@/components/TheConfirm.vue';
import TheFooter from '@/components/TheFooter.vue';
import ThePass from '@/pages/Set/components/ThePass.vue';
import { useAppStore } from '@/store/index';

const modal: any = ref({ open: false, title: '', key: -1 });
const successOpen = ref<boolean>(false);
function setSuccessOpen(value: boolean) {
  successOpen.value = value;
  hideKeyboard();
}

function handleExit() {
  hideKeyboard();
  modal.value = {
    open: true,
    title: '退出系统',
    key: -1,
    handleOk: () => {
      modal.value = { open: false, title: '', key: -1 };
      window.electron.send('quit-app');
    },
  };
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
            formData.value[item][item2][item3] = typeof formData.value[item][item2][item3] === 'object' ? formData.value[item][item2][item3] : String(formData.value[item][item2][item3]);
          }
        } else {
          if (typeof formData.value[item][item2] !== 'boolean') formData.value[item][item2] = typeof formData.value[item][item2] === 'object' ? formData.value[item][item2] : String(formData.value[item][item2]);
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
            if (item3 === 'x' || item3 === 'y' || item3 === 'angle' || item3 === 'offsetX' || item3 === 'offsetY') {
              if (item === 'laserBaseHigh') tit = `激光定位基准${temp[item][item2].position}`;
              else if (item === 'uvBaseHigh') tit = `主副页喷墨定位基准${temp[item][item2].position}`;
              if (item3 === 'x') tit = `${tit}X坐标`;
              else if (item3 === 'y') tit = `${tit}y坐标`;
              else if (item3 === 'angle') tit = `${tit}角度`;
              else if (item3 === 'offsetX') tit = `${tit}X偏移`;
              else if (item3 === 'offsetY') tit = `${tit}Y偏移`;
              if (item3 === 'offsetX' || item3 === 'offsetY') {
                reg = /^-?(?:10000|\d{1,4})$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是-10000~10000内`;
              } else if (item3 === 'angle') {
                reg = /^-?(?:360000|3[0-5]\d{4}|[0-2]?\d{1,5})$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是-360000~360000内`;
              } else if (item === 'laserBaseHigh' && item3 === 'x') {
                reg = /^-?(?:90000(?:\.0{1,3})?|(?:[1-8]\d{4}|[1-9]\d{0,3}|0)(?:\.\d{1,3})?)$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是-90000~90000内`;
              } else if (item === 'laserBaseHigh' && item3 === 'y') {
                reg = /^-?(?:30000(?:\.0{1,3})?|(?:[12]\d{4}|[1-9]\d{0,3}|0)(?:\.\d{1,3})?)$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是-30000~30000内`;
              } else if (item3 === 'x') {
                reg = /^(?:90000(?:\.0{1,3})?|(?:[1-8]\d{4}|[1-9]\d{0,3}|0)(?:\.\d{1,3})?)$/;
                if (!temp[item][item2][item3].match(reg)) error = `${tit}有误，应该是0~90000内`;
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
            reg = /^(?:20000(?:\.0{1,3})?|1?\d{1,4}(?:\.\d{1,3})?)$/;
            if (!temp[item][item2].match(reg)) error = `${tit}有误，应该是0~20000内`;
          } else if (item === 'laserHeight') {
            tit = `激光器${Number(item2) + 1}高度`;
            reg = /^(?:90000(?:\.0{1,3})?|(?:[1-8]\d{4}|[1-9]\d{0,3}|0)(?:\.\d{1,3})?)$/;
            if (!temp[item][item2].match(reg)) error = `${tit}有误，应该是0~90000内`;
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
.bgSet_item {
  .bgSet_tit {
    font-size: 2.5vw;
    font-weight: bold;
  }
  .bg_listItem {
    padding: 1vh 0;
    margin: 1vh 0;
    display: flex;
    font-size: 2vw;
    .bgSet_itemIn {
      display: flex;
      align-items: center;
      margin-right: 2vw;
      .bgSet_itemIn_tit {
        margin-left: 2vw;
        padding-right: 0.5vw;
        min-width: 9vw;
      }
      .bgSet_itemIn_desc {
        margin-left: 0.5vw;
        color: #989ca1;
      }
      div {
        display: flex;
        align-items: center;
        span {
          display: block;
          width: 0.5vw;
          height: 0.5vw;
          background-color: #3662ec;
          border-radius: 50%;
          margin: 0 0.3vw 0 1vw;
          border: 1px solid #ffffff;
        }
      }
    }
    ::v-deep(.ant-input) {
      font-size: 2vw;
      background-color: transparent !important;
      color: #ffffff;
      border-width: 1px !important;
      height: 3vh !important;
      border-radius: 0;
      min-width: 10vw;
    }
    ::v-deep(.ant-input::placeholder) {
      color: #989ca1;
    }
    ::v-deep(.ant-switch-checked .ant-switch-inner) {
      background: #3662ec;
    }
    ::v-deep(.ant-switch-inner) {
      background: #d8d8d8;
    }
    .keyInput {
      border-color: #3662ec;
    }
  }
}
.bgSet_bottom {
  background:
    linear-gradient(270deg, #03163e 0%, #03163e 93%, #03163e00 100%),
    linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
}
</style>
