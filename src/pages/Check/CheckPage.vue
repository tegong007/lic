<template>
  <div class="mt-6.5vh w-92% flex">
    <img class="h-7vw w-9vw" src="@/assets/image/tmp_left.png" />
    <a-flex class="mt-4vh w-90% overflow-hidden text-center">
      <div>
        <div class="bgC1">
          <div class="pt-1.5vh text-center text-1.3vw">质检状态</div>
          <div class="h-20vh flex items-center justify-center text-2.5vw">
            <span v-if="state.msg.length <= 10">{{ state.msg }}</span>
            <marquee v-else behavior="scroll" direction="left" width="80%">{{ state.msg }}</marquee>
          </div>
        </div>
        <div class="bgC1">
          <div class="pt-1.5vh text-center text-1.3vw">照片采样</div>
          <div class="h-20vh flex items-center justify-center">
            <img v-if="mainCheck.irlImgData" class="max-h-90% max-w-80%" :src="`data:image/png;base64,${mainCheck.irlImgData}`" />
          </div>
        </div>
      </div>
      <div class="bgC2">
        <div class="pt-1.5vh text-center text-1.3vw">质检结果</div>
        <div class="bgB mt-3vh flex justify-around py-1vh text-1vw">
          <div>{{ mainCheck.time || '--' }}</div>
          <div>证件号：{{ mainCheck.docID || '--' }}</div>
          <div>结果：<span v-if="!mainCheck.docID">检测中…</span><span v-else-if="mainCheck.qualityResult === 0" class="ok">良品</span><span v-else class="no">不良品</span></div>
        </div>
        <div class="flex">
          <table class="tb1 ml-1vw mt-4vh w-50% text-1vw">
            <tr>
              <th class="pb-2vh">序号</th>
              <th class="pb-2vh">检测项</th>
              <th class="pb-2vh">状态</th>
            </tr>
            <tr v-for="(value, index) in items" :key="index">
              <td>0{{ index + 1 }}</td>
              <td class="tb1-lab" :class="mainCheck.docID && mainCheck.checkedItem[value.key] ? 'err' : ''">
                <div>{{ value.name }}</div>
              </td>
              <td class="tb1-ico">
                <img v-if="mainCheck.docID && !mainCheck.checkedItem[value.key]" src="@/assets/image/ico_ok.png" />
                <img v-else-if="mainCheck.docID && mainCheck.checkedItem[value.key]" src="@/assets/image/ico_no.png" />
                <img v-else src="@/assets/image/ico_wait.png" />
              </td>
            </tr>
          </table>
          <div v-if="mainCheck.markedImage" class="mt-3vh w-40% flex items-center justify-end">
            <img :src="`data:image/png;base64,${mainCheck.markedImage}`" class="w-75%" @click="viewImage([`data:image/png;base64,${mainCheck.markedImage}`])" />
          </div>
        </div>
      </div>
    </a-flex>
    <img class="h-7vw w-9vw" src="@/assets/image/tmp_right.png" />
  </div>
  <a-flex justify="space-between" class="bgB mx-auto mt-2.1vh h-8vh w-80%">
    <a-flex class="items-center gap-2vw">
      <TheButton :title="t('质检设置')" @click="$goto('CheckSelectPage', { key: 2 })" />
      <TheButton :title="t('质检记录')" @click="$goto('CheckSelectPage', { key: 1 })" />
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
import { api } from 'v-viewer';
import { useI18n } from 'vue-i18n';
import { checkModule } from '@/apis/proApi';
import useCustomTimer from '@/utils/useCustomTimer';

const { t } = useI18n();
const { start } = useCustomTimer();

const state = ref({ code: -1, msg: '--' });
const mainCheck: any = ref({});
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

async function getData() {
  try {
    const data: any = await checkModule.qualityCheckLast();
    if (data.respData) {
      mainCheck.value = data.respData.mainResult1;
      if (data.respData.qualityDescription) state.value = { code: data.code, msg: data.respData.qualityDescription };
      else state.value = { code: data.code, msg: data.msg || '正常' };
    }
  } catch (error) {
    state.value = { code: -1, msg: String(error) };
    mainCheck.value = {};
  }
}

onMounted(async () => {
  await getData();
  start(async () => {
    await getData();
  }, 5);
});
</script>

<style scoped lang="less">
.bgC1 {
  width: 25vw;
  height: 30vh;
  margin: 3vh 0 0 1vw;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/image/bg_c1.png');
}
.bgC2 {
  width: 47vw;
  height: 63.2vh;
  margin: 3vh 1vw 0 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/image/bg_c2.png');
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
</style>
