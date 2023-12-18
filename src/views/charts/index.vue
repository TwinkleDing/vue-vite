<template>
  <div class="charts">
    <w-chart />
  </div>
</template>
<script setup lang="ts">
import DChart from "./chart.vue";
import WChart from "./chartWeight.vue";
</script>

<style scoped lang="scss">
.charts {
  height: 100%;
  width: 100%;
}
</style>
