<template>
  <div ref="barChart" class="line-chart" :style="{ width, height }"></div>
</template>
<script lang="ts">
import { onMounted, getCurrentInstance, reactive } from "vue";
import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer]);
type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

export default {
  name: "LineChart",
  props: {
    option: {
      type: Object,
      default: () => {
        return {
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
        };
      },
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
  },
  setup(props: any) {
    const { proxy }: any = getCurrentInstance();

    const option: EChartsOption = props.option;
    let myChart: any = reactive({});

    const init = (): void => {
      const chartDom = proxy.$refs.barChart!;
      myChart = echarts.init(chartDom, null, { renderer: "svg" });
      option && myChart.setOption(option);
      resize();
    };
    const resize = (): void => {
      myChart.resize();
    };
    onMounted(() => {
      init();
    });
    return {
      init,
      resize,
    };
  },
};
</script>

<style scoped>
.line-chart {
  height: 100%;
  width: 100%;
}
</style>
