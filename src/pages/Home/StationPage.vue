<template>
  <a-flex justify="around" class="mt-14vh w-94vw">
    <div>
      <div v-for="item in navs" :key="item.key" class="bgNav mb-4vh transition-transform duration-300" :class="actived === item.key ? 'actived' : 'hover:scale-105'" @click="setActived(item.key)">
        <span class="text-1.5vw line-height-8vh">{{ item.name }}</span>
      </div>
    </div>
    <div v-if="actived" class="ml-2vw flex-1 text-1.5vw">
      <div class="mb-1vh mt-3vh">{{ navs[`x${actived}`].name }}<a-button class="btnRe transition-transform duration-300 hover:scale-105" @click="getDataList">刷新状态</a-button></div>
      <div class="h-65vh overflow-auto">
        <a-flex v-for="(item, index) in lists" :key="index" justify="between" class="bgItem text-1.3vw">
          <div class="w-15vw font-bold">{{ item.item }}</div>
          <!-- <div class="w-14vw">{{ t('机器启动后成功数') }}：{{ item.currentSuccessNum || 0 }}</div> -->
          <!-- <div class="w-15vw">{{ t('机器启动后失败数') }}：{{ item.currentFailNum || 0 }}</div> -->
          <div class="w-14vw"></div>
          <div class="w-14vw">历史成功数：{{ item.historySuccessNum || 0 }}</div>
          <div class="w-14vw">历史失败数：{{ item.historyFailNum || 0 }}</div>
          <div class="w-14vw">历史发本数：{{ item.historyNum || 0 }}</div>
          <div v-if="item.status === 0 || item.status === 1" class="success mr-3vw w-5vw">正常</div>
          <div v-else-if="item.status === 2" class="error mr-3vw w-5vw">警告</div>
          <div v-else-if="item.status === 3" class="warn mr-3vw w-5vw">故障</div>
        </a-flex>
      </div>
    </div>
  </a-flex>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { homeModule } from '@/apis/proApi';
import { useAppStore } from '@/store/index';

const { notification } = App.useApp();
const route = useRoute();

const actived = ref(0);
const navs: any = { x3: { name: '喷墨打印模块', key: 3 }, x2: { name: '激光打印模块', key: 2 }, x1: { name: '空白本检测模块', key: 1 } };
const lists: any = ref([]);

function setActived(key: number) {
  if (key !== actived.value) {
    actived.value = key;
    getDataList();
  }
}

async function getDataList() {
  try {
    useAppStore().setSpinning(true);
    const data: any = await homeModule.getPositionCard(actived.value);
    if (data.respData) {
      data.respData.forEach((element: any) => {
        if (actived.value === element.moduleID) lists.value = element.items;
      });
    }
  } catch (error) {
    lists.value = [];
    notification.error({ message: '错误', description: String(error), placement: 'bottomRight', class: 'notificationE-custom-class' });
  } finally {
    useAppStore().setSpinning(false);
  }
}

onMounted(async () => {
  setActived(Number(route.query.key || 3));
});
</script>

<style scoped lang="less">
.bgNav {
  background-image: url('@/assets/image/bg_nav.png');
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 15vw;
  text-align: center;
  height: 9vh;
  &.actived {
    background-image: url('@/assets/image/bg_navA.png');
    cursor: default;
  }
}
.btnRe {
  background: #3662ec;
  border: 0;
  color: #ffffff;
  height: 5vh;
  line-height: 2vh;
  margin-left: 2vw;
  font-size: 1.3vw;
  &:hover {
    color: #ffffff;
  }
}
.bgItem {
  background: linear-gradient(90deg, #0390e500 0%, #0390e51f 34%, #0390e517 63%, #0390e500 99%);
  padding: 2.5vh 0;
  margin: 2vh 0;
  .success,
  .warn,
  .error {
    text-align: center;
    font-size: 1.25vw;
  }
  .success {
    background: #5fcc3433;
    color: #5fcc34;
  }
  .warn {
    background: #ff8f1f99;
    color: #ecac36;
  }
  .error {
    background: #e3100833;
    color: #e31008;
  }
}
</style>
