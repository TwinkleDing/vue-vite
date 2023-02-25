<template>
  <div>
    <el-button type="primary" @click="clear" class="clear-button">清空画布</el-button>
    <canvas
      id="canvas"
      class="canvas"
      height="800"
      width="1000"
      @mousedown="drawStart"
      @mousemove="drawing"
      @mouseup="drawEnd"
    />
  </div>
</template>
<script setup lang="ts">
import { Ref, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store: any = useStore();
const CONTENT_OFFSET_LEFT: number = 200;
const CONTENT_OFFSET_TOP: number = 100;

const mouseBeginX: Ref<number> = ref(0);
const mouseBeginY: Ref<number> = ref(0);
const mouseX: Ref<number> = ref(0);
const mouseY: Ref<number> = ref(0);
const context: any = reactive({});
const canvas: any = reactive({});
const start: Ref<boolean> = ref(false);
const color: Ref<string> = ref(store.getters.systemTheme);

const drawStart = (e: MouseEvent): void => {
  context.value.beginPath();
  mouseBeginX.value = getMouse(e).x;
  mouseBeginY.value = getMouse(e).y;
  context.value.moveTo(mouseBeginX.value, mouseBeginY.value);
  start.value = true;
};

const drawing = (e: MouseEvent): void => {
  if (start.value) {
    context.value.strokeStyle = color.value;
    mouseX.value = getMouse(e).x;
    mouseY.value = getMouse(e).y;
    context.value.lineTo(mouseX.value, mouseY.value);
    context.value.stroke();
  }
};

const getMouse = (e: MouseEvent): { x: number; y: number } => {
  const x = e.clientX - canvas.value.offsetLeft - CONTENT_OFFSET_LEFT;
  const y = e.clientY - canvas.value.offsetTop - CONTENT_OFFSET_TOP;
  return {
    x,
    y,
  };
};

const drawEnd = (e: MouseEvent): void => {
  start.value = false;
  context.value.closePath();
};

const clear = (): void => {
  const w: number = canvas.value.width;
  const h: number = canvas.value.height;
  context.value.beginPath();
  context.value.clearRect(0, 0, w, h);
};

onMounted(() => {
  canvas.value = document.getElementById("canvas");
  context.value = canvas.value.getContext("2d");
});
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
.clear-button {
  position: absolute;
}
</style>
