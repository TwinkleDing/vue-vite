<template>
  <div id="main" ref="chartDom" style="height: 780px; width: 100%"></div>
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
const colorList = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"];
const option: EChartsOption = ref({
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
        color: colorList[i % 7],
        lineStyle: {
          width: 2,
        },
        data: item,
      };
    }),
  ],
});
const chartDom = ref("");

let myChart: echarts = reactive({});

onMounted(() => {
  myChart = echarts.init(chartDom.value);
  option.value && myChart.setOption(option.value);
  window.onresize = () => {
    myChart.resize();
  };
});
</script>

<style scoped lang="scss"></style>
