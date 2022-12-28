<template>
  <div class="flex">
    <div v-for="item in WidthList" class="width-item" @click="setWidth(item)">
      <div
        class="width-item-box"
        :style="{ height: item + 'px', width: item + 'px' }"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["set-width"]);
const WidthList = ["3", "5", "7", "10", "15"];
let width = WidthList[0];
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
