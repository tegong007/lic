<template>
  <div
    class="canvas-container"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
    }"
  >
    <canvas
      ref="canvasRef"
      class="canvas"
      :width="width"
      :height="height"
      :style="{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        cursor: cursorStyle,
      }"
      @click="handleCanvasClick"
      @mousemove="handleMouseMove"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import router from '@/router';

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  top: {
    type: Number,
    default: 0,
  },
  left: {
    type: Number,
    default: 0,
  },
  rectangles: {
    type: Array,
    default: () => [],
  },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const cursorStyle = ref('default'); // 默认光标样式
onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d');
    drawRectangles();
  }
});

watch(
  () => props.rectangles,
  () => {
    drawRectangles();
  },
  { deep: true },
);

function drawRectangles() {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height);
    props.rectangles.forEach((rect) => {
      ctx.value.globalAlpha = rect.opacity || 1; // 设置透明度
      ctx.value.fillStyle = rect.color || 'red'; // 设置填充颜色
      ctx.value.fillRect(rect.x, rect.y, rect.width, rect.height); // 绘制长方形
      ctx.value.globalAlpha = 1; // 恢复默认透明度
    });
  }
}

function handleCanvasClick(event: MouseEvent) {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - (rect.left ?? 0);
    const y = event.clientY - (rect.top ?? 0);

    for (const {
      id,
      x: rectX,
      y: rectY,
      msg,
      width: rectWidth,
      height: rectHeight,
    } of props.rectangles) {
      if (
        x >= rectX
        && x <= rectX + rectWidth
        && y >= rectY
        && y <= rectY + rectHeight
      ) {
        console.log(
          `Clicked inside the rectangle with ID ${id} at (${rectX}, ${rectY}) with width ${rectWidth} and height ${rectHeight}`,
        );
        router.push({ name: `Error-${id}`, query: { id, msg } });
        // router.push({ name: 'Error', query: { id } });
        // 在这里可以添加更多的点击事件逻辑
        return;
      }
    }

    console.log('Clicked outside any rectangle.');
  }
}

function handleMouseMove(event: MouseEvent) {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - (rect.left ?? 0);
    const y = event.clientY - (rect.top ?? 0);

    let isOverRectangle = false;

    for (const {
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
    } of props.rectangles) {
      if (
        x >= rectX
        && x <= rectX + rectWidth
        && y >= rectY
        && y <= rectY + rectHeight
      ) {
        cursorStyle.value = 'pointer'; // 设置光标为指针样式
        isOverRectangle = true;
        break;
      }
    }

    if (!isOverRectangle) {
      cursorStyle.value = 'default'; // 恢复默认光标样式
    }
  }
}
</script>

<style scoped>
.canvas-container {
  position: relative;
}
.canvas {
  position: absolute;
  z-index: 1000; /* Canvas 的 z-index 较高 */
}
</style>
