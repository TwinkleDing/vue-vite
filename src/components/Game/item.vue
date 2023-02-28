<template>
  <div class="game-item">
    <img :src="item.img" width="80" height="80" alt="" />
    <div>
      <div class="game-name">{{ item.name }}</div>
      <div>
        发行价格：<b>{{ item.price }}</b>
      </div>
      <div>
        发行平台：<b>{{ item.platform }}</b>
      </div>
      <div>
        发行时间：<b>{{ item.time }}</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { GameList } from "@/utils/interface";
const props = defineProps({
  item: {
    type: Object as PropType<GameList>,
    default: () => [],
  },
});
</script>

<style lang="scss" scope>
.game-item {
  display: flex;
  padding: 12px 0;
  cursor: pointer;
  margin-right: 10px;
  font-size: 14px;

  .game-name {
    font-size: 14px;
    font-weight: 700;
  }

  img {
    border-radius: 10px;
    margin-right: 24px;
  }
}
</style>
