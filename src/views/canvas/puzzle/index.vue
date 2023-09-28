<template>
  <div class="puzzle">
    <div
      class="box"
      :style="{
        height: `${width}px`,
        width: `${width}px`,
      }"
    >
      <div
        v-for="item in imgList"
        class="box-img"
        :style="{
          left: `${item.getRandom()[0]}px`,
          top: `${item.getRandom()[1]}px`,
          height: `${itemSize}px`,
          width: `${itemSize}px`,
          backgroundImage: item.getIsImg() ? `url(${cardImg})` : '',
          backgroundPosition: `${-item.getCoordinate()[0]}px ${-item.getCoordinate()[1]}px`,
          backgroundSize: `${width}px ${width}px`,
        }"
        @click="puzzleClick(item)"
      ></div>
    </div>
    <div class="setting">
      <img class="material" :src="img" alt="" />
      <div class="handler">
        <div>步数：{{ count }}</div>
        <div>计时：{{ time }}</div>
        <hr />
        <el-button type="primary" @click="start">开始</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import Puzzle, { Image } from "./puzzle";
import img from "./guoran.jpg";
let puzzle: Puzzle;
const imgList: Ref<Array<Image>> = ref([]);
const count: Ref<number> = ref(0);
const time: Ref<number> = ref(0);
const itemSize: Ref<number> = ref(0);
const cardImg: Ref<any> = ref(null);
const width: Ref<number> = ref(600);
const block: Ref<number> = ref(3);

const init = (): void => {
  puzzle = new Puzzle(img, block.value, width.value);
  itemSize.value = puzzle.getItemSize();
  cardImg.value = puzzle.getImg();
  imgList.value = [...puzzle.getImageList()];
  puzzle.puzzleChange((e: Puzzle): void => {
    time.value = e.getTime();
    count.value = e.getCount();
    imgList.value = [...e.getImageList()];
    console.log(1);
    if (puzzle.getOver()) {
      console.log("Over");
      ElMessage.success("恭喜你，拼图完成！用时" + time.value + "ms");
    }
  });
};
const start = (): void => {
  puzzle.start();
};
const reset = (): void => {
  puzzle.reset();
};

const puzzleClick = (item: Image): void => {
  if (item.getIsImg()) {
    puzzle.itemClick(item);
  }
};

onBeforeMount(() => {
  init();
});
</script>

<style lang="scss" scoped>
.puzzle {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .box {
    border: 1px solid black;
    position: relative;
    &-img {
      position: absolute;
      border: 1px solid #fff;
    }
  }
  .setting {
    .material {
      height: 200px;
      width: 200px;
      background-size: 100% 100%;
    }
    .handler {
      margin-top: 12px;
      text-align: right;
    }
  }
}
</style>
