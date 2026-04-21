<template>
  <div
    class="h-3.6vh w-18.5vw flex items-center justify-center"
    :class="{ 'cursor-not-allowed': props.disable, 'transition-transform duration-300 hover:scale-105 cursor-pointer': !props.disable }"
    @click="
      (event) => {
        props.disable ? event.preventDefault() : null;
      }
    "
  >
    <span class="text-3vw font-[youshe]">{{ props.title }}</span>
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
    linear-gradient(90deg, #0a215700 -23%, #0e5fff 8%, #0a215700 43%),
    linear-gradient(90deg, #0a215700 55%, #0e5fff 92%, #0a215700 131%);
  box-sizing: border-box;
  border: 2px solid;
  border-image: linear-gradient(90deg, #0e5fff00 0%, #03163e4d 24%, #ffffff 51%, #03163e4d 78%, #0e5fff00 99%) 2;
  box-shadow: 0px 4px 10px 0px #0000004d;
  border-radius: 5px;
}
</style>
