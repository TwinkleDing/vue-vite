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
import { defineComponent, Ref, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store: any = useStore();
const mouseBeginX: Ref<number> = ref(0);
const mouseBeginY: Ref<number> = ref(0);
const canvas: any = reactive({});
const context: any = reactive({});
const start: Ref<boolean> = ref(false);
const mouseX: Ref<number> = ref(0);
const mouseY: Ref<number> = ref(0);
const color: Ref<string> = ref(store.getters.systemTheme);

const drawStart = (e: MouseEvent) => {
  context.value.beginPath();
  mouseBeginX.value = e.clientX - canvas.value.offsetLeft - 200;
  mouseBeginY.value = e.clientY - canvas.value.offsetTop - 100;
  context.value.moveTo(mouseBeginX.value, mouseBeginY.value);
  start.value = true;
};
const drawing = (e: MouseEvent) => {
  if (start.value) {
    openDraw(e);
  }
};
const drawEnd = (e: MouseEvent) => {
  start.value = false;
  context.value.closePath();
};
const openDraw = (e: MouseEvent) => {
  context.value.strokeStyle = color.value;
  mouseX.value = e.clientX - canvas.value.offsetLeft - 200;
  mouseY.value = e.clientY - canvas.value.offsetTop - 100;
  context.value.lineTo(mouseX.value, mouseY.value);
  context.value.stroke();
};
const clear = () => {
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
