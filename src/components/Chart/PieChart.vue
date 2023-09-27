<template>
  <div ref="pieChart" class="pie-chart" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

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
const pieChart = ref();
const Option: EChartsOption = reactive({
  title: {
    text: "Referer of a Website",
    subtext: "Fake Data",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "20%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});
let myChart: any = reactive({});

const init = (): void => {
  myChart = echarts.init(pieChart.value, props.theme, { renderer: "svg" });
  myChart.setOption({ ...Option, ...props.option });
  resize();
};
const resize = (): void => {
  myChart.resize();
};
onMounted(() => {
  init();
});
</script>

<style scoped>
.pie-chart {
  height: 100%;
  width: 100%;
}
</style>
