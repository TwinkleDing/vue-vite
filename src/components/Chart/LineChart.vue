<template>
  <div ref="lineChart" class="line-chart" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from "vue";
import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

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
const lineChart = ref();
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
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
      areaStyle: {},
    },
  ],
});
let myChart: any = reactive({});

const init = (): void => {
  myChart = echarts.init(lineChart.value, props.theme, { renderer: "svg" });
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
