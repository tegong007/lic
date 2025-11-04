<template>
  <!-- <div
    class="h-3.7em w-8.6em flex items-center justify-center transition-transform duration-300 hover:scale-105"
  > -->
  <div
    class="h-70px min-w-150px flex items-center justify-center p-20"
    :class="{
      'cursor-not-allowed': props.disable,
      'transition-transform duration-300 hover:scale-105 cursor-pointer':
        !props.disable,
      'w-190px': props.title === t('base.TheButton.6byi3ir3l900'),
    }"
    @click="
      () => {
        props.disable ? event.preventDefault() : null;
      }
    "
  >
    <span class="flex items-center justify-center"><img
      v-if="props.title === t('base.TheButton.6byi3ir3l900')"
      class="m-x-5 h1.2vh w1.5vh"
      src="@/assets/image/bigScreen/btn/warn.png "
      alt=""
    >{{ props.title }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  title: String, // 表头
  disable: Boolean,
});
const { t } = useI18n();
</script>

<style scoped lang="less">
div {
  background-image: url('@/assets/image/bigScreen/btn/btnBG.png');
  background-size: 100% 100%;
  background-repeat: no-repeat; /* 不重复 */
  span {
    font-family: youshe;
    font-size: 30px;
    font-weight: normal;
    background: linear-gradient(180deg, #3388ff -3%, #ffffff 54%, #3388ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}
</style>
