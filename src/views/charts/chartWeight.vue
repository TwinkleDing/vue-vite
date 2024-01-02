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
import Weight, { Dataset } from "./weight.ts";

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>;

const weight: Ref<number[]> = ref(Weight);

const data: Ref<Array[Array[number]]> = ref([[]]);
for (let i = 0; i < Math.ceil(weight.value.length / 7); i++) {
  data.value[i] = [...weight.value.slice(i * 7, 7 + i * 7)];
}
const colorList: Ref<Array[string]> = ref([
  "#f39",
  "#9f3",
  "#39f",
  "#666",
]);

const dataset: Ref<any> = ref(Dataset);
const dimensions: Ref<Array[string]> = ref([]);
data.value.map((item, index) => {
  dimensions.value.push(`第${index + 1}周`);
  item.map((e, i) => {
    dataset.value[i][`第${index + 1}周`] = e;
  });
});
const tooltipIndex = ref(0);
const myTimer = ref(null);
const max: number = Math.max(...weight.value);
const min: number = Math.min(...weight.value);
const option: EChartsOption = ref({
  dataset: {
    dimensions: ["date", ...dimensions.value],
    source: dataset.value,
  },
  title: {
    text: `减肥体重每周同比图：最重${max}；最轻${min}\n
目前${weight.value[weight.value.length - 1]}；平均每周${(
      ((max - weight.value[weight.value.length - 1]) / weight.value.length) *
      7
    ).toFixed(2)}`,
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    top: "13%",
    bottom: "0",
    containLabel: true,
  },
  legend: {},
  xAxis: [
    {
      type: "category",
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
        color: colorList.value[i % 4],
        lineStyle: {
          width: 2,
        },
      };
    }),
  ],
});
const chartDom = ref("");
let myChart: echarts;

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
      dataIndex: tooltipIndex.value % 7,
    });
    tooltipIndex.value++;
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
