<template>
  <div>
    <TheConfirm title="舍弃当前修改" :open="showConfirm" :handle-ok="onConfirmDiscard" :handle-cancel="onConfirmCancel" />

    <SimpleKeyboard v-if="showKeyboard" :layout="isFloatKey ? 'fNum' : 'num'" keyboard-width="w-30vw" :transform="transformValue" :input="getKeyboardValue()" :max-length="limitInput" @on-change="onChangeKeyboard" @closekeyboard="hideKeyboard" />

    <div class="bgDefend_item no-first-bar">
      <!-- 模板选择 -->
      <section v-if="templates.length" class="bg_listItem">
        <div class="bgDefend_itemIn">
          <div class="bgDefend_itemIn_tit">模板:</div>
          <a-select :value="selectedTemplateCode" style="width: 22vw" @change="onTemplateChange">
            <a-select-option v-for="t in templates" :key="t.code" :value="t.code">{{ t.code }}</a-select-option>
          </a-select>
        </div>
      </section>

      <!-- 证本姿态检测 -->
      <div class="bgDefend_tit">证本姿态检测</div>
      <template v-if="cur.ocrPose?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-wrap: wrap; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrPose[0].isEnable" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="cur.ocrPose[0].usExposureTime" :class="keyInput === 'ocrPose.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrPose.usExposureTime', 12)" />
              <span class="val-desc">us</span>
            </div>
          </div>
        </section>
        <section v-if="cur.ocrPose[0].targetRoi" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">搜索区域(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrPose[0].targetRoi.x" :class="keyInput === 'ocrPose.targetRoi.x' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrPose.targetRoi.x', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrPose[0].targetRoi.y" :class="keyInput === 'ocrPose.targetRoi.y' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrPose.targetRoi.y', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">宽:</div>
                <a-input v-model:value="cur.ocrPose[0].targetRoi.width" :class="keyInput === 'ocrPose.targetRoi.width' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrPose.targetRoi.width', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">高:</div>
                <a-input v-model:value="cur.ocrPose[0].targetRoi.height" :class="keyInput === 'ocrPose.targetRoi.height' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrPose.targetRoi.height', 5)" />
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- OCR空白页检测 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">OCR空白页检测</div>
      <template v-if="cur.ocrBlank?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-wrap: wrap; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrBlank[0].isEnable" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="cur.ocrBlank[0].usExposureTime" :class="keyInput === 'ocrBlank.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrBlank.usExposureTime', 12)" />
              <span class="val-desc">us</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">质量要求:</div>
              <a-select v-model:value="cur.ocrBlank[0].qualityControl" style="width: 15vw">
                <a-select-option value="0">低质量要求</a-select-option>
                <a-select-option value="1">中质量要求</a-select-option>
                <a-select-option value="2">高质量要求</a-select-option>
              </a-select>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 检测质量控制 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">检测质量控制</div>
      <template v-if="cur.obsvQualityControl?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-wrap: wrap; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.obsvQualityControl[0].isEnable" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="cur.obsvQualityControl[0].usExposureTime" :class="keyInput === 'obsvQualityControl.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'obsvQualityControl.usExposureTime', 12)" />
              <span class="val-desc">us</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">质量要求:</div>
              <a-select v-model:value="cur.obsvQualityControl[0].qualityControl" style="width: 15vw">
                <a-select-option value="0">低质量要求</a-select-option>
                <a-select-option value="1">中质量要求</a-select-option>
                <a-select-option value="2">高质量要求</a-select-option>
              </a-select>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 激光前检测 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">激光前检测</div>
      <template v-if="cur.ocrBeforeLaser?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-wrap: wrap; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrBeforeLaser[0].isEnable" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="cur.ocrBeforeLaser[0].usExposureTime" :class="keyInput === 'ocrBeforeLaser.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrBeforeLaser.usExposureTime', 12)" />
              <span class="val-desc">us</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">旋转角度:</div>
              <a-input v-model:value="cur.ocrBeforeLaser[0].rotationCorrectionAngle" :class="keyInput === 'ocrBeforeLaser.rotationCorrectionAngle' ? 'keyInput' : ''" class="w-9vw" placeholder="-5000~5000" :maxlength="6" @click.stop="onInputFocus($event, 'ocrBeforeLaser.rotationCorrectionAngle', 6)" />
            </div>
          </div>
        </section>
        <section v-if="cur.ocrBeforeLaser[0].markTopLeftRegion" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记左上角(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markTopLeftRegion.x" :class="keyInput === 'ocrBeforeLaser.markTopLeftRegion.x' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markTopLeftRegion.x', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markTopLeftRegion.y" :class="keyInput === 'ocrBeforeLaser.markTopLeftRegion.y' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markTopLeftRegion.y', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">宽:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markTopLeftRegion.width" :class="keyInput === 'ocrBeforeLaser.markTopLeftRegion.width' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markTopLeftRegion.width', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">高:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markTopLeftRegion.height" :class="keyInput === 'ocrBeforeLaser.markTopLeftRegion.height' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markTopLeftRegion.height', 5)" />
              </div>
            </div>
          </div>
        </section>
        <section v-if="cur.ocrBeforeLaser[0].markBottomRightRegion" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记右下角(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markBottomRightRegion.x" :class="keyInput === 'ocrBeforeLaser.markBottomRightRegion.x' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markBottomRightRegion.x', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markBottomRightRegion.y" :class="keyInput === 'ocrBeforeLaser.markBottomRightRegion.y' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markBottomRightRegion.y', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">宽:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markBottomRightRegion.width" :class="keyInput === 'ocrBeforeLaser.markBottomRightRegion.width' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markBottomRightRegion.width', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">高:</div>
                <a-input v-model:value="cur.ocrBeforeLaser[0].markBottomRightRegion.height" :class="keyInput === 'ocrBeforeLaser.markBottomRightRegion.height' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeLaser.markBottomRightRegion.height', 5)" />
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 喷墨前检测 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">喷墨前检测</div>
      <template v-if="cur.ocrBeforeUv?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-wrap: wrap; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrBeforeUv[0].isEnable" />
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">曝光时间:</div>
              <a-input v-model:value="cur.ocrBeforeUv[0].usExposureTime" :class="keyInput === 'ocrBeforeUv.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrBeforeUv.usExposureTime', 12)" />
              <span class="val-desc">us</span>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">平台:</div>
              <a-select v-model:value="cur.ocrBeforeUv[0].platform" style="width: 12vw">
                <a-select-option value="0">平台0</a-select-option>
                <a-select-option value="1">平台1</a-select-option>
              </a-select>
            </div>
          </div>
        </section>
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">激光人像预设位置(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].stdPortraitX" :class="keyInput === 'ocrBeforeUv.stdPortraitX' ? 'keyInput' : ''" class="w-9vw" placeholder="0~90000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.stdPortraitX', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].stdPortraitY" :class="keyInput === 'ocrBeforeUv.stdPortraitY' ? 'keyInput' : ''" class="w-9vw" placeholder="0~90000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.stdPortraitY', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">旋转角度:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].rotationCorrectionAngle" :class="keyInput === 'ocrBeforeUv.rotationCorrectionAngle' ? 'keyInput' : ''" class="w-9vw" placeholder="-5000~5000" :maxlength="6" @click.stop="onInputFocus($event, 'ocrBeforeUv.rotationCorrectionAngle', 6)" />
              </div>
            </div>
          </div>
        </section>
        <section v-if="cur.ocrBeforeUv[0].markTopLeftRegion" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记左上角(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markTopLeftRegion.x" :class="keyInput === 'ocrBeforeUv.markTopLeftRegion.x' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markTopLeftRegion.x', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markTopLeftRegion.y" :class="keyInput === 'ocrBeforeUv.markTopLeftRegion.y' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markTopLeftRegion.y', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">宽:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markTopLeftRegion.width" :class="keyInput === 'ocrBeforeUv.markTopLeftRegion.width' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markTopLeftRegion.width', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">高:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markTopLeftRegion.height" :class="keyInput === 'ocrBeforeUv.markTopLeftRegion.height' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markTopLeftRegion.height', 5)" />
              </div>
            </div>
          </div>
        </section>
        <section v-if="cur.ocrBeforeUv[0].markBottomRightRegion" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">标记右下角(像素):</div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">X:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markBottomRightRegion.x" :class="keyInput === 'ocrBeforeUv.markBottomRightRegion.x' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markBottomRightRegion.x', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">Y:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markBottomRightRegion.y" :class="keyInput === 'ocrBeforeUv.markBottomRightRegion.y' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markBottomRightRegion.y', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">宽:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markBottomRightRegion.width" :class="keyInput === 'ocrBeforeUv.markBottomRightRegion.width' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markBottomRightRegion.width', 5)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit short-label">高:</div>
                <a-input v-model:value="cur.ocrBeforeUv[0].markBottomRightRegion.height" :class="keyInput === 'ocrBeforeUv.markBottomRightRegion.height' ? 'keyInput' : ''" class="w-8vw" placeholder="0~30000" :maxlength="5" @click.stop="onInputFocus($event, 'ocrBeforeUv.markBottomRightRegion.height', 5)" />
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 成品检测 -->
    <div class="bgDefend_item no-first-bar">
      <div class="bgDefend_tit">成品检测</div>
      <template v-if="cur.ocrFinished?.[0]">
        <section class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrFinished[0].isEnable" />
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">曝光时间:</div>
                <a-input v-model:value="cur.ocrFinished[0].usExposureTime" :class="keyInput === 'ocrFinished.usExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrFinished.usExposureTime', 12)" />
                <span class="val-desc">us</span>
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">红外曝光:</div>
                <a-input v-model:value="cur.ocrFinished[0].irUsExposureTime" :class="keyInput === 'ocrFinished.irUsExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrFinished.irUsExposureTime', 12)" />
                <span class="val-desc">us</span>
              </div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">紫外曝光:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvUsExposureTime" :class="keyInput === 'ocrFinished.uvUsExposureTime' ? 'keyInput' : ''" class="w-9vw" placeholder="62~9999764" :maxlength="12" @click.stop="onInputFocus($event, 'ocrFinished.uvUsExposureTime', 12)" />
                <span class="val-desc">us</span>
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">质量要求:</div>
                <a-select v-model:value="cur.ocrFinished[0].qualityControl" style="width: 15vw">
                  <a-select-option value="0">低质量要求</a-select-option>
                  <a-select-option value="1">中质量要求</a-select-option>
                  <a-select-option value="2">高质量要求</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </section>

        <!-- 红外光源 -->
        <section v-if="cur.ocrFinished[0].irlDev" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">红外光源:</div>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrFinished[0].irlDev.isEnable" />
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口1:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l1Port" class="w-8vw" placeholder="COM1" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道1:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l1ChannelNo" :class="keyInput === 'ocrFinished.irlDev.l1ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.irlDev.l1ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度1:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l1Brightness" :class="keyInput === 'ocrFinished.irlDev.l1Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.irlDev.l1Brightness', 3)" />
              </div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口2:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l2Port" class="w-8vw" placeholder="COM2" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道2:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l2ChannelNo" :class="keyInput === 'ocrFinished.irlDev.l2ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.irlDev.l2ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度2:</div>
                <a-input v-model:value="cur.ocrFinished[0].irlDev.l2Brightness" :class="keyInput === 'ocrFinished.irlDev.l2Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.irlDev.l2Brightness', 3)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 紫外光源 -->
        <section v-if="cur.ocrFinished[0].uvlDev" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">紫外光源:</div>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrFinished[0].uvlDev.isEnable" />
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口1:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l1Port" class="w-8vw" placeholder="COM1" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道1:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l1ChannelNo" :class="keyInput === 'ocrFinished.uvlDev.l1ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.uvlDev.l1ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度1:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l1Brightness" :class="keyInput === 'ocrFinished.uvlDev.l1Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.uvlDev.l1Brightness', 3)" />
              </div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口2:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l2Port" class="w-8vw" placeholder="COM2" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道2:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l2ChannelNo" :class="keyInput === 'ocrFinished.uvlDev.l2ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.uvlDev.l2ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度2:</div>
                <a-input v-model:value="cur.ocrFinished[0].uvlDev.l2Brightness" :class="keyInput === 'ocrFinished.uvlDev.l2Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.uvlDev.l2Brightness', 3)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 白光光源 -->
        <section v-if="cur.ocrFinished[0].wlDev" class="bg_listItem" style="display: block">
          <div style="display: flex; flex-direction: column; gap: 1vh">
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit inkjet-loc-tit">白光光源:</div>
            </div>
            <div class="bgDefend_itemIn">
              <div class="bgDefend_itemIn_tit">是否启用:</div>
              <a-switch v-model:checked="cur.ocrFinished[0].wlDev.isEnable" />
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口1:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l1Port" class="w-8vw" placeholder="COM1" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道1:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l1ChannelNo" :class="keyInput === 'ocrFinished.wlDev.l1ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.wlDev.l1ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度1:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l1Brightness" :class="keyInput === 'ocrFinished.wlDev.l1Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.wlDev.l1Brightness', 3)" />
              </div>
            </div>
            <div class="flex">
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">端口2:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l2Port" class="w-8vw" placeholder="COM2" :maxlength="10" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">通道2:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l2ChannelNo" :class="keyInput === 'ocrFinished.wlDev.l2ChannelNo' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.wlDev.l2ChannelNo', 3)" />
              </div>
              <div class="bgDefend_itemIn">
                <div class="bgDefend_itemIn_tit">亮度2:</div>
                <a-input v-model:value="cur.ocrFinished[0].wlDev.l2Brightness" :class="keyInput === 'ocrFinished.wlDev.l2Brightness' ? 'keyInput' : ''" class="w-8vw" placeholder="0~255" :maxlength="3" @click.stop="onInputFocus($event, 'ocrFinished.wlDev.l2Brightness', 3)" />
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 底部按钮 -->
    <div class="fixed bottom-10vh left-3vw right-3vw flex justify-between py-2vh">
      <div>
        <!-- <a-button type="link" class="btn_normal mr-2vw w-18.5vw" @click="saveData">保存设置</a-button> -->
        <!-- <a-button type="link" class="btn_normal w-18.5vw" @click="getData">读取</a-button> -->
      </div>
      <div>
        <a-button type="link" class="btn_normal mr-2vw w-18.5vw" @click="saveData">保存设置</a-button>
        <a-button type="link" class="btn_normal w-18.5vw" @click="getData">读取</a-button>
        <!-- <a-button type="link" class="btn_normal w-18.5vw" @click="$goto('CheckPage')">返回</a-button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { checkModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';
import TheConfirm from '@/components/TheConfirm.vue';

const { notification } = App.useApp();

const data = ref<any>({ mvIn: [] });

// --- 模板管理 ---
const selectedTemplateCode = ref('');
let originalDataStr = '';

const templates = computed(() => {
  return (data.value.mvIn || []).map((item: any) => ({ code: item.templateCode }));
});

const currentTemplateIdx = computed(() => {
  return data.value.mvIn?.findIndex((m: any) => m.templateCode === selectedTemplateCode.value) ?? 0;
});

const cur = computed(() => {
  const idx = currentTemplateIdx.value;
  if (idx < 0 || !data.value.mvIn?.[idx]) return {};
  return data.value.mvIn[idx].paraMv || {};
});

// --- 未保存切换确认 ---
const showConfirm = ref(false);
const pendingTemplateCode = ref<string | null>(null);

function hasUnsavedChanges(): boolean {
  return JSON.stringify(data.value) !== originalDataStr;
}

function onTemplateChange(code: string) {
  if (code === selectedTemplateCode.value) return;
  if (hasUnsavedChanges()) {
    pendingTemplateCode.value = code;
    showConfirm.value = true;
  } else {
    selectedTemplateCode.value = code;
  }
}

function onConfirmDiscard() {
  // 还原到原始数据
  const original = JSON.parse(originalDataStr);
  data.value = original;

  // 切换到待选模板，重新转字符串
  selectedTemplateCode.value = pendingTemplateCode.value!;
  pendingTemplateCode.value = null;
  showConfirm.value = false;

  // 重新字符串化所有数值字段
  if (data.value.mvIn) {
    for (const mv of data.value.mvIn) {
      convertParaMvToStrings(mv.paraMv);
    }
  }
  originalDataStr = JSON.stringify(data.value);
}

function onConfirmCancel() {
  pendingTemplateCode.value = null;
  showConfirm.value = false;
}

// --- 键盘 ---
const showKeyboard = ref(false);
const keyInput = ref('');
const limitInput = ref(0);
const cursorPosition = ref<any>(null);
const transformValue = ref<any>(null);

// 需要 fNum（可负号）的字段
const FLOAT_KEY_FIELDS = ['rotationCorrectionAngle'];
const isFloatKey = computed(() => {
  if (!keyInput.value) return false;
  const lastPart = keyInput.value.split('.').pop() || '';
  return FLOAT_KEY_FIELDS.includes(lastPart);
});

function hideKeyboard() {
  showKeyboard.value = false;
  keyInput.value = '';
}

function getKeyboardValue(): string {
  if (!keyInput.value || !cur.value) return '';
  const parts = keyInput.value.split('.');
  // 第一个部分是 section 名，对应 cur[section][0]
  const [section, ...rest] = parts;
  const arr = cur.value[section];
  if (!arr || !arr[0]) return '';
  let val: any = arr[0];
  for (const p of rest) {
    if (val == null || typeof val !== 'object') return '';
    val = val[p];
  }
  return String(val ?? '');
}

function onInputFocus(event: any, key: string, limit = 0) {
  if (keyInput.value !== key) {
    showKeyboard.value = true;
    keyInput.value = key;
    limitInput.value = limit;
    cursorPosition.value = event;
    const rect = event.target.getBoundingClientRect();
    const top = rect.bottom + rect.height + window.scrollY;
    transformValue.value = [0, top - 100];
  }
}

function onChangeKeyboard(input: string, keyboard: any) {
  const caretPosition = keyboard.caretPosition;
  if (caretPosition !== null && cursorPosition.value) {
    setTimeout(() => {
      if (cursorPosition.value.setSelectionRange) {
        cursorPosition.value.focus();
        cursorPosition.value.setSelectionRange(caretPosition, caretPosition);
      }
    }, 100);
  }
  if (!keyInput.value || !cur.value) return;
  const parts = keyInput.value.split('.');
  const [section, ...rest] = parts;
  const arr = cur.value[section];
  if (!arr || !arr[0]) return;
  if (rest.length === 0) {
    arr[0] = input;
    return;
  }
  let target: any = arr[0];
  for (let i = 0; i < rest.length - 1; i++) {
    if (target == null || typeof target !== 'object') return;
    target = target[rest[i]];
  }
  const lastKey = rest[rest.length - 1];
  if (target && typeof target === 'object') {
    target[lastKey] = input;
  }
}

// --- 数值字段转换 ---
// 需要转为 number 发送的字段（不含 COM 端口等文本字段）
const NUM_LEAF_FIELDS = new Set(['usExposureTime', 'irUsExposureTime', 'uvUsExposureTime', 'x', 'y', 'width', 'height', 'stdPortraitX', 'stdPortraitY', 'rotationCorrectionAngle', 'l1ChannelNo', 'l2ChannelNo', 'l1Brightness', 'l2Brightness', 'qualityControl', 'platform']);

function convertValue(val: any, key: string): any {
  if (val == null) return val;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val;
  if (NUM_LEAF_FIELDS.has(key)) {
    const n = Number(val);
    return Number.isFinite(n) ? n : val;
  }
  return val;
}

function convertParaMvToNumbers(pmv: any) {
  if (!pmv) return;
  for (const section of Object.keys(pmv)) {
    const arr = pmv[section];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          // 嵌套对象如 targetRoi, markTopLeftRegion, irlDev 等
          for (const subKey of Object.keys(val)) {
            val[subKey] = convertValue(val[subKey], subKey);
          }
        } else {
          item[key] = convertValue(val, key);
        }
      }
    }
  }
}

function convertParaMvToStrings(pmv: any) {
  if (!pmv) return;
  for (const section of Object.keys(pmv)) {
    const arr = pmv[section];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          for (const subKey of Object.keys(val)) {
            if (typeof val[subKey] !== 'boolean' && val[subKey] != null) {
              val[subKey] = String(val[subKey]);
            }
          }
        } else if (typeof val !== 'boolean' && val != null) {
          item[key] = String(val);
        }
      }
    }
  }
}

// --- 校验 ---
function validateField(rawVal: any, min: number, max: number, label: string): string | null {
  if (rawVal == null || String(rawVal).trim() === '') return `${label}不能为空`;
  const val = Number(rawVal);
  if (!Number.isFinite(val)) return `${label}的值无效`;
  if (val < min || val > max) return `${label}超出范围（${min}~${max}），当前值：${val}`;
  return null;
}

function validateDevice(nestedObj: any, prefix: string): string[] {
  const errs: string[] = [];
  if (!nestedObj) return errs;
  const e1 = validateField(nestedObj.l1ChannelNo, 0, 255, `${prefix}通道1`);
  if (e1) errs.push(e1);
  const e2 = validateField(nestedObj.l2ChannelNo, 0, 255, `${prefix}通道2`);
  if (e2) errs.push(e2);
  const e3 = validateField(nestedObj.l1Brightness, 0, 255, `${prefix}亮度1`);
  if (e3) errs.push(e3);
  const e4 = validateField(nestedObj.l2Brightness, 0, 255, `${prefix}亮度2`);
  if (e4) errs.push(e4);
  return errs;
}

function validateRoi(nestedObj: any, prefix: string): string[] {
  const errs: string[] = [];
  if (!nestedObj) return errs;
  const e1 = validateField(nestedObj.x, 0, 30000, `${prefix} X`);
  if (e1) errs.push(e1);
  const e2 = validateField(nestedObj.y, 0, 30000, `${prefix} Y`);
  if (e2) errs.push(e2);
  const e3 = validateField(nestedObj.width, 0, 30000, `${prefix} 宽`);
  if (e3) errs.push(e3);
  const e4 = validateField(nestedObj.height, 0, 30000, `${prefix} 高`);
  if (e4) errs.push(e4);
  return errs;
}

function validateAll(): string[] {
  const errs: string[] = [];
  const pmv = cur.value;
  if (!pmv) return errs;
  const tc = selectedTemplateCode.value || '当前模板';

  // ocrPose
  if (pmv.ocrPose?.[0]) {
    const p = pmv.ocrPose[0];
    const e = validateField(p.usExposureTime, 62, 9999764, `${tc} 证本姿态 曝光时间`);
    if (e) errs.push(e);
    if (p.targetRoi) errs.push(...validateRoi(p.targetRoi, `${tc} 证本姿态搜索区域`));
  }

  // ocrBlank
  if (pmv.ocrBlank?.[0]) {
    const e = validateField(pmv.ocrBlank[0].usExposureTime, 62, 9999764, `${tc} OCR空白页 曝光时间`);
    if (e) errs.push(e);
  }

  // obsvQualityControl
  if (pmv.obsvQualityControl?.[0]) {
    const e = validateField(pmv.obsvQualityControl[0].usExposureTime, 62, 9999764, `${tc} 检测质量控制 曝光时间`);
    if (e) errs.push(e);
  }

  // ocrBeforeLaser
  if (pmv.ocrBeforeLaser?.[0]) {
    const l = pmv.ocrBeforeLaser[0];
    const e1 = validateField(l.usExposureTime, 62, 9999764, `${tc} 激光前检测 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(l.rotationCorrectionAngle, -5000, 5000, `${tc} 激光前检测 旋转角度`);
    if (e2) errs.push(e2);
    if (l.markTopLeftRegion) errs.push(...validateRoi(l.markTopLeftRegion, `${tc} 激光前 左上角`));
    if (l.markBottomRightRegion) errs.push(...validateRoi(l.markBottomRightRegion, `${tc} 激光前 右下角`));
  }

  // ocrBeforeUv
  if (pmv.ocrBeforeUv?.[0]) {
    const uv = pmv.ocrBeforeUv[0];
    const e1 = validateField(uv.usExposureTime, 62, 9999764, `${tc} 喷墨前检测 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(uv.stdPortraitX, 0, 90000, `${tc} 喷墨前 X坐标`);
    if (e2) errs.push(e2);
    const e3 = validateField(uv.stdPortraitY, 0, 90000, `${tc} 喷墨前 Y坐标`);
    if (e3) errs.push(e3);
    const e4 = validateField(uv.rotationCorrectionAngle, -5000, 5000, `${tc} 喷墨前 旋转角度`);
    if (e4) errs.push(e4);
    if (uv.markTopLeftRegion) errs.push(...validateRoi(uv.markTopLeftRegion, `${tc} 喷墨前 左上角`));
    if (uv.markBottomRightRegion) errs.push(...validateRoi(uv.markBottomRightRegion, `${tc} 喷墨前 右下角`));
  }

  // ocrFinished
  if (pmv.ocrFinished?.[0]) {
    const f = pmv.ocrFinished[0];
    const e1 = validateField(f.usExposureTime, 62, 9999764, `${tc} 成品检测 曝光时间`);
    if (e1) errs.push(e1);
    const e2 = validateField(f.irUsExposureTime, 62, 9999764, `${tc} 成品检测 红外曝光`);
    if (e2) errs.push(e2);
    const e3 = validateField(f.uvUsExposureTime, 62, 9999764, `${tc} 成品检测 紫外曝光`);
    if (e3) errs.push(e3);
    if (f.irlDev) errs.push(...validateDevice(f.irlDev, `${tc} 红外光源`));
    if (f.uvlDev) errs.push(...validateDevice(f.uvlDev, `${tc} 紫外光源`));
    if (f.wlDev) errs.push(...validateDevice(f.wlDev, `${tc} 白光光源`));
  }

  return errs;
}

// --- API ---
async function getData() {
  try {
    useAppStore().setSpinning(true);
    const res: any = await checkModule.qualityCheckGet();
    const respData = res.respData || { mvIn: [] };
    data.value = respData;

    // 全部数值转字符串（供 input 显示）
    if (data.value.mvIn) {
      for (const mv of data.value.mvIn) {
        convertParaMvToStrings(mv.paraMv);
      }
    }

    if (data.value.mvIn?.length) {
      selectedTemplateCode.value = data.value.mvIn[0].templateCode;
    }
    originalDataStr = JSON.stringify(data.value);
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

async function saveData() {
  const errors = validateAll();
  if (errors.length) {
    notification.error({ message: '参数范围错误', description: errors[0], placement: 'bottomRight', class: 'notificationE-custom-class' });
    return;
  }
  try {
    useAppStore().setSpinning(true);
    const reqData = JSON.parse(JSON.stringify(data.value));

    // 数值字符串转 number
    if (reqData.mvIn) {
      for (const mv of reqData.mvIn) {
        convertParaMvToNumbers(mv.paraMv);
      }
    }

    await checkModule.qualityCheckSet(reqData);

    // 再转回字符串
    if (data.value.mvIn) {
      for (const mv of data.value.mvIn) {
        convertParaMvToStrings(mv.paraMv);
      }
    }
    originalDataStr = JSON.stringify(data.value);

    notification.success({ message: '成功', description: '保存成功', class: 'notification-custom-class', placement: 'bottomRight' });
  } catch (error) {
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

defineExpose({ hideKeyboard });

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.inkjet-loc-tit {
  position: relative;
  padding-left: 1.5vw;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 1.2em;
    border-radius: 50px;
    background: #ffffff;
  }
}
.short-label {
  min-width: auto !important;
  margin-left: 2vw !important;
}
.keyInput {
  border-color: #3662ec;
}
.val-desc {
  margin-left: 0.5vw;
  color: #989ca1;
  font-size: 1vw;
}
</style>

<style lang="less">
.bgDefend {
  .bgDefend_item {
    margin-bottom: 3vh;
    .bgDefend_tit {
      font-size: 1.8vw;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        min-width: 2vw;
      }
      &::before {
        background: linear-gradient(270deg, #ffffff 0%, #ffffff00 100%);
        margin-right: 1vw;
      }
      &::after {
        background: linear-gradient(90deg, #ffffff 0%, #ffffff00 100%);
        margin-left: 1vw;
      }
    }
    .bg_listItem {
      padding: 1vh 0;
      margin: 1vh 0;
      display: flex;
      font-size: 1.3vw;
      .bgDefend_itemIn {
        display: flex;
        align-items: center;
        margin-right: 1vw;
        .bgDefend_itemIn_tit {
          margin-left: 1vw;
          padding-right: 0.3vw;
          min-width: 5vw;
          white-space: nowrap;
        }
        &:first-of-type .bgDefend_itemIn_tit:first-of-type {
          position: relative;
          padding-left: 1.5vw;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 1.2em;
            border-radius: 50px;
            background: #ffffff;
          }
        }
      }
      .ant-input,
      .ant-select-selector {
        font-size: 1.1vw;
        background-color: transparent !important;
        color: #ffffff;
        border-width: 0px !important;
        background-color: #ffffff15 !important;
        height: 5vh !important;
        border-radius: 0;
      }
      .ant-select-selection-item {
        line-height: 5vh !important;
        font-size: 1.1vw;
        color: #ffffff !important;
      }
      .ant-input::placeholder,
      .ant-select-selection-placeholder {
        color: #989ca1;
      }
      .ant-select-arrow {
        right: 0.5vw !important;
      }
      .ant-switch-checked .ant-switch-inner {
        background: #3662ec;
      }
      .ant-switch-inner {
        background: #d8d8d8;
      }
      .keyInput {
        border-color: #3662ec;
      }
    }
    // 屏蔽默认小竖条，但不影响自定义小竖条（如 .inkjet-loc-tit）
    &.no-first-bar .bg_listItem .bgDefend_itemIn:first-of-type .bgDefend_itemIn_tit:first-of-type:not(.inkjet-loc-tit) {
      padding-left: 0;
      &::before {
        display: none;
      }
    }
  }
}

// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  background-color: #141723;
  border-radius: 0;
  .ant-select-item-option {
    padding: 1.2vh 14px !important;
    min-height: auto !important;
    height: auto !important;
  }
  .ant-select-item-option-content {
    font-size: 1.1vw !important;
    color: #b0b4ba;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(54, 98, 236, 0.3) !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #3662ec !important;
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
  .ant-select-item-option-state {
    color: #ffffff;
  }
}
.ant-select-arrow {
  color: #e2e5eb !important;
}
</style>
