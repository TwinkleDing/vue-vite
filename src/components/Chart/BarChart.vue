<template>
  <div ref="barChart" class="line-chart" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from "vue";
import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer]);
type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  theme: {
    type: String,
    default: "light",
  },
});
const barChart = ref();
const Option: EChartsOption = reactive({
  title: {
    text: "Referer of a Website",
    subtext: "Fake Data",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
});
let myChart: any = reactive({});

const init = (): void => {
  myChart = echarts.init(barChart.value, props.theme, { renderer: "svg" });
  myChart.setOption({ ...Option, ...props.option });
  resize();
};
const resize = (): void => {
  myChart.resize();
};
onMounted(() => {
  init();
  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style scoped>
.line-chart {
  height: 100%;
  width: 100%;
}
</style>
