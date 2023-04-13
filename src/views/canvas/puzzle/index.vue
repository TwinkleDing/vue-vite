<template>
  <div class="puzzle">
    <div class="box">
      <div
        v-for="item in imgList"
        class="box-img"
        :style="{
          left: `${item.random.length ? item.random[0] : item.coordinate[0]}px`,
          top: `${item.random.length ? item.random[1] : item.coordinate[1]}px`,
          height: `${itemSize}px`,
          width: `${itemSize}px`,
          backgroundImage: item.isImg ? `url(${cardImg})` : '',
          backgroundPosition: `${-item.coordinate[0]}px ${-item.coordinate[1]}px`,
        }"
        @click="puzzleClick(item)"
      ></div>
    </div>
    <div class="handler">
      <span>步数：{{ count }}</span>
      <el-button type="primary" @click="start">开始</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref, Ref } from "vue";
import Puzzle, { Image } from "./puzzle";
import img from "./Pokemon.webp";
let puzzle;
let imgList: Ref<Array<Image>> = ref([]);
let count: Ref<number> = ref(0);
let itemSize: Ref<number> = ref(0);
let cardImg: Ref<any> = ref(null);

const init: void = () => {
  puzzle = new Puzzle(img, 3, 600);
  itemSize.value = puzzle.getItemSize();
  cardImg.value = puzzle.getImg();
  puzzleImgChanged();
};
const start: void = () => {
  puzzle.start();
  puzzleImgChanged();
};
const reset: void = () => {
  puzzle.reset();
  puzzleImgChanged();
};

const puzzleImgChanged: void = () => {
  count.value = puzzle.getCount();
  imgList.value = [...puzzle.getImageList()];
  if (puzzle.getOver()) {
    console.log("Over");
  }
};
const puzzleClick: void = (item: Image) => {
  if (item.isImg) {
    puzzle.itemClick(item);
    puzzleImgChanged();
  }
};

onBeforeMount(() => {
  init();
});
</script>

<style lang="scss" scoped>
.puzzle {
  width: 600px;
  .box {
    height: 600px;
    width: 600px;
    border: 1px solid black;
    position: relative;
    &-img {
      position: absolute;
      border: 1px solid #fff;
    }
  }
  .handler {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
