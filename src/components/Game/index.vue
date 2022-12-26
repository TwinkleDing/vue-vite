<template>
  <div>
    <div class="game" v-for="item in list" :key="item.name">
      <item :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Item from "./item.vue";
import { GameList } from "@/utils/interface.ts";
const props = defineProps({
  list: {
    type: Array as PropType<GameList[]>,
  },
});
</script>

<style lang="scss" scope>
.game {
  display: flex;
  padding: 12px 0;
  cursor: pointer;
  > div {
    margin-right: 10px;
    font-size: 14px;
  }
}
</style>
