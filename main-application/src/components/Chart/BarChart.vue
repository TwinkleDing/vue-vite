<template>
    <div id="barChart" class="line-chart" :style="{ width, height }"></div>
</template>
<script lang="ts">
import { onMounted } from "vue"
import * as echarts from "echarts/core"
import { GridComponent, GridComponentOption } from "echarts/components"
import { BarChart, BarSeriesOption } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([GridComponent, BarChart, CanvasRenderer])
type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>
export default {
    name: "LineChart",
    props: {
        option: {
            type: Object,
            default: () => {
                return {
                    xAxis: {
                        type: "category",
                        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [
                        {
                            data: [120, 200, 150, 80, 70, 110, 130],
                            type: "bar"
                        }
                    ]
                }
            }
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "100%"
        }
    },
    setup(props: any) {
        const option: EChartsOption = props.option

        onMounted(() => {
            const chartDom = document.getElementById("barChart")!
            const myChart = echarts.init(chartDom)
            option && myChart.setOption(option)
        })
    }
}
</script>

<style scoped>
.line-chart {
    height: 100%;
    width: 100%;
}
</style>