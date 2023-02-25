<template>
  <div>
    <div class="game" v-for="item in list" :key="item.name">
      <item :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { GameList } from "@/utils/interface";
import Item from "./item.vue";
const props = defineProps({
  list: {
    type: Array as PropType<GameList[]>,
  },
});
</script>

<style lang="scss" scope>
.game {
}
</style>
