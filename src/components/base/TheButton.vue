<template>
  <div
    class="h-6vh w-10vw flex items-center justify-center"
    :class="{ 'cursor-not-allowed': props.disable, 'transition-transform duration-300 hover:scale-105 cursor-pointer': !props.disable }"
    @click="
      (event) => {
        props.disable ? event.preventDefault() : null;
      }
    "
  >
    <span class="text-1.8vw line-height-[6vh] font-[xiaowei]">{{ props.title }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({ title: String, disable: Boolean });
</script>

<style scoped lang="less">
div {
  background:
    linear-gradient(
      248deg,
      #0e5fff 0%,
      rgba(14, 95, 255, 0.24) 8%,
      rgba(14, 95, 255, 0.88) 10%,
      rgba(14, 95, 255, 0.6259) 23%,
      rgba(14, 95, 255, 0.92) 26%,
      rgba(14, 95, 255, 0.37) 48%,
      rgba(14, 95, 255, 0.4804) 51%,
      rgba(14, 95, 255, 0.1) 72%,
      rgba(14, 95, 255, 0.4099) 73%,
      rgba(14, 95, 255, 0.2972) 88%,
      #0e5fff 90%,
      rgba(14, 95, 255, 0.2161) 100%
    ),
    linear-gradient(90deg, rgba(10, 33, 87, 0) -23%, #0e5fff 8%, rgba(10, 33, 87, 0) 43%), linear-gradient(90deg, rgba(10, 33, 87, 0) 55%, #0e5fff 92%, rgba(10, 33, 87, 0) 131%);
  box-sizing: border-box;
  border: 2px solid;
  border-image: linear-gradient(90deg, rgba(14, 95, 255, 0) 0%, rgba(3, 22, 62, 0.3) 24%, #ffffff 51%, rgba(3, 22, 62, 0.3) 78%, rgba(14, 95, 255, 0) 99%) 2;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
</style>
