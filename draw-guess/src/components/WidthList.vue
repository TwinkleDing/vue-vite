<template>
  <div class="flex">
    <div v-for="item in WidthMap" class="width-item" @click="setWidth(item)">
      <div
        class="width-item-box"
        :style="{ height: item + 'px', width: item + 'px' }"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";
import { WidthMap } from "../config.js";
const emit = defineEmits(["set-width"]);
let width = WidthMap[0];
const setWidth = (e) => {
  width = e;
  emit("set-line-width", width);
};
</script>

<style lang="less" scoped>
.width-item {
  padding: 10px;
  height: 40px;
  width: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  &-box {
    border-radius: 50%;
    background: #000;
  }
}
</style>
