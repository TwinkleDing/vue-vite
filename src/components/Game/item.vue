
<template>
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
</template>

<script setup lang="ts">
import { GameList } from "@/utils/interface.ts";
const props = defineProps({
  item: {
    type: Object as PropType<GameList>,
  },
});
</script>

<style lang="scss" scope>
.game-name {
  font-size: 14px;
  font-weight: 700;
}
img {
  border-radius: 10px;
  margin-right: 24px;
}
</style>
