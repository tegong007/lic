<template>
  <template v-if="showKeyboard">
    <SimpleKeyboard v-if="keyInput === 'ocrBeforeUv,stdPortraitX' || keyInput === 'ocrBeforeUv,stdPortraitY' || keyInput === 'ocrBeforeUv,rotationCorrectionAngle'" layout="fNum" keyboard-width="w20%" :transform="transformValue" :input="keyInputArr.length === 3 ? formData[keyInputArr[0]][0][keyInputArr[1]][keyInputArr[2]] : formData[keyInputArr[0]][0][keyInputArr[1]]" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
    <SimpleKeyboard v-else layout="num" keyboard-width="w20%" :transform="transformValue" :input="keyInputArr.length === 3 ? formData[keyInputArr[0]][0][keyInputArr[1]][keyInputArr[2]] : formData[keyInputArr[0]][0][keyInputArr[1]]" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />
  </template>
  <div class="mx-auto w-95%" @click="hideKeyboard">
    <div class="absolute right-5vw top-10vh z-2 min-w-17.7vw flex justify-end gap-2vw bg-#03163e">
      <a-button type="link" class="btn_normal" @click="saveData">保存设置</a-button>
      <a-button type="link" class="btn_normal" @click="getData">读取</a-button>
    </div>
    <div class="bgSelect_item">
      <div class="bgSelect_tit">证本姿态检测</div>
      <section v-if="formData.ocrPose && formData.ocrPose[0]" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">是否启用:</div>
          <a-switch v-model:checked="formData.ocrPose[0].isEnable" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">曝光时间(us):</div>
          <a-input v-model:value="formData.ocrPose[0].usExposureTime" :class="keyInput === 'ocrPose,usExposureTime' ? 'keyInput' : ''" class="w-15vw" placeholder="请输入62~9999764" :maxlength="12" @click.stop="onInputFocus($event, ['ocrPose', 'usExposureTime'], 12)" />
        </div>
      </section>
      <section v-if="formData.ocrPose && formData.ocrPose[0] && formData.ocrPose[0].targetRoi" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">护照类型文字搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrPose[0].targetRoi.x" :class="keyInput === 'ocrPose,targetRoi,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrPose', 'targetRoi', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrPose[0].targetRoi.y" :class="keyInput === 'ocrPose,targetRoi,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrPose', 'targetRoi', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrPose[0].targetRoi.width" :class="keyInput === 'ocrPose,targetRoi,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrPose', 'targetRoi', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrPose[0].targetRoi.height" :class="keyInput === 'ocrPose,targetRoi,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrPose', 'targetRoi', 'height'], 5)" />
        </div>
      </section>
    </div>
    <div class="bgSelect_item">
      <div class="bgItem_tit">OCR</div>
      <section v-if="formData.ocrBlank" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">是否启用:</div>
          <a-switch v-model:checked="formData.ocrBlank[0].isEnable" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">曝光时间(us):</div>
          <a-input v-model:value="formData.ocrBlank[0].usExposureTime" :class="keyInput === 'ocrBlank,usExposureTime' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入62~9999764" :maxlength="12" @click.stop="onInputFocus($event, ['ocrBlank', 'usExposureTime'], 12)" />
        </div>
      </section>
    </div>
    <div class="bgSelect_item">
      <div class="bgSelect_tit">激光前检测</div>
      <section v-if="formData.ocrBeforeLaser && formData.ocrBeforeLaser[0]" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">是否启用:</div>
          <a-switch v-model:checked="formData.ocrBeforeLaser[0].isEnable" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">曝光时间(us):</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].usExposureTime" :class="keyInput === 'ocrBeforeLaser,usExposureTime' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入62~9999764" :maxlength="12" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'usExposureTime'], 12)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeLaser && formData.ocrBeforeLaser[0] && formData.ocrBeforeLaser[0].markTopLeftRegion" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">标记左上角搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markTopLeftRegion.x" :class="keyInput === 'ocrBeforeLaser,markTopLeftRegion,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markTopLeftRegion', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markTopLeftRegion.y" :class="keyInput === 'ocrBeforeLaser,markTopLeftRegion,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markTopLeftRegion', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markTopLeftRegion.width" :class="keyInput === 'ocrBeforeLaser,markTopLeftRegion,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markTopLeftRegion', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markTopLeftRegion.height" :class="keyInput === 'ocrBeforeLaser,markTopLeftRegion,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markTopLeftRegion', 'height'], 5)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeLaser && formData.ocrBeforeLaser[0] && formData.ocrBeforeLaser[0].markBottomRightRegion" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">标记右下角搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markBottomRightRegion.x" :class="keyInput === 'ocrBeforeLaser,markBottomRightRegion,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markBottomRightRegion', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markBottomRightRegion.y" :class="keyInput === 'ocrBeforeLaser,markBottomRightRegion,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markBottomRightRegion', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markBottomRightRegion.width" :class="keyInput === 'ocrBeforeLaser,markBottomRightRegion,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markBottomRightRegion', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrBeforeLaser[0].markBottomRightRegion.height" :class="keyInput === 'ocrBeforeLaser,markBottomRightRegion,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeLaser', 'markBottomRightRegion', 'height'], 5)" />
        </div>
      </section>
    </div>
    <div class="bgSelect_item">
      <div class="bgSelect_tit">喷墨前检测</div>
      <section v-if="formData.ocrBeforeUv && formData.ocrBeforeUv[0]" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">是否启用:</div>
          <a-switch v-model:checked="formData.ocrBeforeUv[0].isEnable" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">曝光时间(us):</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].usExposureTime" :class="keyInput === 'ocrBeforeUv,usExposureTime' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入62~9999764" :maxlength="12" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'usExposureTime'], 12)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeUv && formData.ocrBeforeUv[0]" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">激光人像预设位置<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].stdPortraitX" :class="keyInput === 'ocrBeforeUv,stdPortraitX' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入-90000~90000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'stdPortraitX'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].stdPortraitY" :class="keyInput === 'ocrBeforeUv,stdPortraitY' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入-90000~90000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'stdPortraitY'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">旋转角度:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].rotationCorrectionAngle" :class="keyInput === 'ocrBeforeUv,rotationCorrectionAngle' ? 'keyInput' : ''" class="w-15vw" placeholder="请输入-5000~5000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'rotationCorrectionAngle'], 5)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeUv && formData.ocrBeforeUv[0] && formData.ocrBeforeUv[0].markTopLeftRegion" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">标记左上角搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markTopLeftRegion.x" :class="keyInput === 'ocrBeforeUv,markTopLeftRegion,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markTopLeftRegion', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markTopLeftRegion.y" :class="keyInput === 'ocrBeforeUv,markTopLeftRegion,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markTopLeftRegion', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markTopLeftRegion.width" :class="keyInput === 'ocrBeforeUv,markTopLeftRegion,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markTopLeftRegion', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markTopLeftRegion.height" :class="keyInput === 'ocrBeforeUv,markTopLeftRegion,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markTopLeftRegion', 'height'], 5)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeUv && formData.ocrBeforeUv[0] && formData.ocrBeforeUv[0].markBottomRightRegion" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">标记右下角搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markBottomRightRegion.x" :class="keyInput === 'ocrBeforeUv,markBottomRightRegion,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markBottomRightRegion', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markBottomRightRegion.y" :class="keyInput === 'ocrBeforeUv,markBottomRightRegion,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markBottomRightRegion', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markBottomRightRegion.width" :class="keyInput === 'ocrBeforeUv,markBottomRightRegion,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markBottomRightRegion', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].markBottomRightRegion.height" :class="keyInput === 'ocrBeforeUv,markBottomRightRegion,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'markBottomRightRegion', 'height'], 5)" />
        </div>
      </section>
      <section v-if="formData.ocrBeforeUv && formData.ocrBeforeUv[0] && formData.ocrBeforeUv[0].cropRegion" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">激光人像搜索区域<br />(像素)</div>
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">X:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].cropRegion.x" :class="keyInput === 'ocrBeforeUv,cropRegion,x' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'cropRegion', 'x'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">Y:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].cropRegion.y" :class="keyInput === 'ocrBeforeUv,cropRegion,y' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'cropRegion', 'y'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">宽:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].cropRegion.width" :class="keyInput === 'ocrBeforeUv,cropRegion,width' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'cropRegion', 'width'], 5)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">高:</div>
          <a-input v-model:value="formData.ocrBeforeUv[0].cropRegion.height" :class="keyInput === 'ocrBeforeUv,cropRegion,height' ? 'keyInput' : ''" class="w-10vw" placeholder="请输入0~30000" :maxlength="5" @click.stop="onInputFocus($event, ['ocrBeforeUv', 'cropRegion', 'height'], 5)" />
        </div>
      </section>
    </div>
    <div class="bgSelect_item">
      <div class="bgSelect_tit">成品检测</div>
      <section v-if="formData.ocrFinished && formData.ocrFinished[0]" class="bg_listItem">
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">是否启用:</div>
          <a-switch v-model:checked="formData.ocrFinished[0].isEnable" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">曝光时间(us):</div>
          <a-input v-model:value="formData.ocrFinished[0].usExposureTime" :class="keyInput === 'ocrFinished,usExposureTime' ? 'keyInput' : ''" class="w-12vw" placeholder="请输入62~9999764" :maxlength="12" @click.stop="onInputFocus($event, ['ocrFinished', 'usExposureTime'], 12)" />
        </div>
        <div class="bgSelect_itemIn">
          <div class="bgSelect_itemIn_tit">质量要求:</div>
          <a-select v-model:value="formData.ocrFinished[0].qualityControl">
            <a-select-option value="0">低质量要求</a-select-option>
            <a-select-option value="1">中质量要求</a-select-option>
            <a-select-option value="2">高质量要求</a-select-option>
          </a-select>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { checkModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';
import { convertJSONStringToNumbers } from '@/utils/index';

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
    transformValue.value = [300, top - 120];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null) setInputCaretPosition(cursorPosition.value, caretPosition);
  if (keyInputArr.value.length === 3) formData.value[keyInputArr.value[0]][0][keyInputArr.value[1]][keyInputArr.value[2]] = input;
  else formData.value[keyInputArr.value[0]][0][keyInputArr.value[1]] = input;
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
    const data: any = await checkModule.qualityCheckGet();
    formData.value = JSON.parse(JSON.stringify(data.respData));
    for (const item in formData.value) {
      for (const item2 in formData.value[item]) {
        for (const item3 in formData.value[item][item2]) {
          if (typeof formData.value[item][item2][item3] === 'object') {
            for (const item4 in formData.value[item][item2][item3]) {
              formData.value[item][item2][item3][item4] = String(formData.value[item][item2][item3][item4]);
            }
          } else {
            if (typeof formData.value[item][item2][item3] !== 'boolean') formData.value[item][item2][item3] = String(formData.value[item][item2][item3]);
          }
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
    useAppStore().setSpinning(true);
    let temp = JSON.parse(JSON.stringify(formData.value));
    temp = convertJSONStringToNumbers(temp);
    if (temp.errors && temp.errors.length > 0) throw temp.errors[0];
    await checkModule.qualityCheckSet(temp.data);
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
