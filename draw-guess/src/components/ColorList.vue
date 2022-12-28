<template>
  <div class="flex">
    <div
      v-for="item in ColorList"
      :style="{ background: item }"
      class="color-item"
      @click="setColor(item)"
    ></div>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["set-color"]);
const ColorList = ["#000", "#00f", "#0f0", "#0ff", "#f00", "#f0f", "#ff0"];
let color = ColorList[0];
const setColor = (e) => {
  color = e;
  emit("set-line-color", color);
};
</script>

<style lang="less" scoped>
.color-item {
  width: 20px;
  height: 20px;
  margin: 10px;
  cursor: pointer;
}
</style>
