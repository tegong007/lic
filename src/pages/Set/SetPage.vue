<template>
  <div class="absolute top-10vh flex justify-start">
    <div class="flex justify-start">
      <!-- 左侧导航 -->
      <div class="ml-1vw w-20vw flex-shrink-0 text-1.5vw">
        <div class="bgNav animation" :class="actived === 1 ? 'actived' : ''" @click="switchTab(1)">
          <span>常规设置</span>
        </div>
        <div class="bgNav animation" :class="actived === 2 ? 'actived' : ''" @click="switchTab(2)">
          <span>喷墨设置</span>
        </div>
        <div class="bgNav animation" :class="actived === 3 ? 'actived' : ''" @click="switchTab(3)">
          <span>激光设置</span>
        </div>
        <div class="bgNav animation" :class="actived === 4 ? 'actived' : ''" @click="switchTab(4)">
          <span>工位内容设置</span>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="bgDefend ml-2vw h-71vh w-75vw overflow-auto">
        <!-- Tab 1: 常规设置 -->
        <div v-show="actived === 1">
          <SetGeneral ref="setGeneralRef" />
        </div>

        <!-- Tab 2: 喷墨设置 -->
        <div v-show="actived === 2">
          <SetInkjet ref="setInkjetRef" />
        </div>

        <!-- Tab 3: 激光设置 -->
        <div v-show="actived === 3">
          <SetLaser ref="setLaserRef" />
        </div>

        <!-- Tab 4: 工位内容设置 -->
        <div v-show="actived === 4">
          <SetStation ref="setStationRef" />
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="fixed bottom-10vh left-3vw right-3vw flex justify-between py-2vh">
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
  </div>
</template>

<script setup lang="ts">
import TheConfirm from '@/components/TheConfirm.vue';
import SetGeneral from '@/pages/Set/components/SetGeneral.vue';
import SetInkjet from '@/pages/Set/components/SetInkjet.vue';
import SetLaser from '@/pages/Set/components/SetLaser.vue';
import SetStation from '@/pages/Set/components/SetStation.vue';
import ThePass from '@/pages/Set/components/ThePass.vue';

const modal: any = ref({ open: false, title: '', key: -1 });
const successOpen = ref<boolean>(false);
const actived = ref(1);

// 子组件引用
const setGeneralRef = ref<InstanceType<typeof SetGeneral>>();
const setInkjetRef = ref<InstanceType<typeof SetInkjet>>();
const setLaserRef = ref<InstanceType<typeof SetLaser>>();
const setStationRef = ref<InstanceType<typeof SetStation>>();

function getActiveComponent() {
  switch (actived.value) {
    case 1:
      return setGeneralRef.value;
    case 2:
      return setInkjetRef.value;
    case 3:
      return setLaserRef.value;
    case 4:
      return setStationRef.value;
    default:
      return undefined;
  }
}

function setModal(value: number) {
  if (value === -1) {
    modal.value = { open: false, title: '', key: -1 };
  }
}
function setSuccessOpen(value: boolean) {
  successOpen.value = value;
}

function handleExit() {
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

function switchTab(tab: number) {
  if (tab !== actived.value) {
    // 关闭所有子组件的虚拟键盘
    setGeneralRef.value?.hideKeyboard?.();
    setInkjetRef.value?.hideKeyboard?.();
    setLaserRef.value?.hideKeyboard?.();
    setStationRef.value?.hideKeyboard?.();

    actived.value = tab;
    const comp = getActiveComponent();
    if (comp?.load) comp.load();
  }
}

function getData() {
  const comp = getActiveComponent();
  if (comp?.load) comp.load();
}

function saveData() {
  const comp = getActiveComponent();
  if (comp?.save) comp.save();
}
</script>

<style scoped lang="less">
.bgNav {
  background-image: url('@/assets/image/bg_navBtn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 19.5vw;
  text-align: center;
  height: 10vh;
  line-height: 8vh;
  margin-bottom: 1vh;
  white-space: nowrap;
  &.actived {
    background-image: url('@/assets/image/bg_navBtn_hov.png');
  }
}
</style>

<style lang="less">
.bgDefend {
  .bg_listItem {
    padding: 2vh 0;
    margin: 1vh 0;
    font-size: 1.4vw;
    // 隔行变色
    &:nth-of-type(odd) {
      background: linear-gradient(359deg, #ffffff13 1%, #008cff23 98%);
    }
    &:nth-of-type(even) {
      background: linear-gradient(91deg, #b9b9b933 0%, #b9b9b91f 34%, #b9b9b917 63%, #b9b9b900 99%);
    }
  }
  .bgDefend_item {
    margin-top: 2vh;
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
        margin-right: 2vw;
        .bgDefend_itemIn_tit {
          margin-left: 2vw;
          padding-right: 0.5vw;
          min-width: 7vw;
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
      ::v-deep(.ant-form-item) {
        margin-bottom: 0vh;
      }
      ::v-deep(.ant-form-item-label) {
        line-height: 3vh !important;
      }
      ::v-deep(.ant-form-item-label label) {
        color: #ffffff;
        font-size: 1.4vw;
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
        min-width: 15vw;
      }
      .ant-select-selector {
        min-width: 12vw !important;
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
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #3662ec;
    border-radius: 2px;
  }
}
</style>

<style lang="less">
// 下拉菜单全局样式（teleported to body）
.ant-select-dropdown {
  .ant-select-item-option-content {
    font-size: 1.3vw;
  }
  .ant-select-item-option {
    min-height: unset !important;
    height: 3.5vh !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: center !important;
  }
}
</style>
