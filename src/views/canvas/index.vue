<template>
  <div class="canvas">
    <puzzle />
  </div>
</template>

<script lang="ts" setup>
import puzzle from "./puzzle/index.vue";
</script>

<style lang="scss" scoped>
.canvas {
  height: 100%;
  width: 100%;
}
</style>
