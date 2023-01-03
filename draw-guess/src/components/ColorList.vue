<template>
  <div class="flex">
    <div
      v-for="item in ColorMap"
      :style="{ background: item }"
      class="color-item"
      @click="setColor(item)"
    ></div>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";
import { ColorMap } from "../config.js";
const emit = defineEmits(["set-color"]);
let color = ColorMap[0];
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
