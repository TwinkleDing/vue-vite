<template>
  <div
    id="main"
    ref="chartDom"
    style="height: 780px; width: 100%"
    @mouseover="chartMouseover"
    @mouseout="chartMouseout"
  ></div>
</template>
<script setup lang="ts">
import { ref, Ref, reactive, onMounted } from "vue";
import echarts from "@/utils/echarts.ts";
import { LineSeriesOption } from "echarts/charts";
import {
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
} from "echarts/components";

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>;

const weight: Ref<number> = ref([
  "-",
  77.5,
  77.8,
  77.5,
  77.5,
  77.5,
  76.8,
  77.1,
  76.8,
  76.8,
  76.9,
  76.3,
  76.7,
  76.2,
  76.5,
  76.7,
  76.9,
  76.6,
  77.2,
  77.2,
  76.2,
  76,
  75.8,
  76.6,
  76.6,
  76,
  75.8,
  74.6,
  74.6,
  75,
  75,
  75,
  75.6,
  75.3,
  75,
  74.8,
  74.8,
  75.04,
  75.68,
  75.35,
  74.85,
  74.06,
  73.52,
  74.22,
  74.22,
  74.52,
  74.4,
  74.02,
  73.01,
  73.23,
  73.04,
]);

const data: Ref<Array[Array[number]]> = ref([[]]);
for (let i = 0; i < Math.ceil(weight.value.length / 7); i++) {
  data.value[i] = weight.value.slice(i * 7, 7 + i * 7);
}
const colorList: Ref<Array[string]> = ref([
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
]);
const tooltipIndex = ref(0);
const myTimer = ref(null);

const option: EChartsOption = ref({
//   dataset: {
//     dimensions: ["area", "slaj", "bjaj", "zbaj"],
//     source: [],
//   },
  title: {
    text: "减肥体重每周同比图",
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  legend: {},
  xAxis: [
    {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],
    },
  ],
  yAxis: [
    {
      name: "体重：公斤",
      min: 70,
      max: 80,
    },
  ],
  series: [
    ...data.value.map((item, i) => {
      return {
        name: `第${i + 1}周`,
        type: "line",
        color: colorList.value[i % 7],
        lineStyle: {
          width: 2,
        },
        data: item,
      };
    }),
  ],
});
const chartDom = ref("");

let myChart: echarts = reactive(null);

const initChart = (): void => {
  if (!myChart) {
    myChart = echarts.init(chartDom.value);
    tooltipInterval();
    window.onresize = () => {
      myChart.resize();
    };
  }
  option.value && myChart.setOption(option.value);
};

const tooltipInterval = (): void => {
  myTimer.value = setInterval(() => {
    myChart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: tooltipIndex.value,
    });
    tooltipIndex.value++;
    if (tooltipIndex.value > option.value.series[0].data.length) {
      tooltipIndex.value = 0;
    }
  }, 3000);
};

const chartMouseover = (): void => {
  if (myChart) {
    clearInterval(myTimer.value);
  }
};
const chartMouseout = (): void => {
  if (myChart) {
    tooltipInterval();
  }
};

onMounted(() => {
  initChart();
});
</script>

<style scoped lang="scss"></style>
