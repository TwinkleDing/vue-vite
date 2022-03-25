<template>
    <div id="chart" class="chart" :style="{ width, height }"></div>
</template>
<script lang="ts">
import { onMounted } from "vue"
import * as echarts from "echarts/core"
import { GridComponent, GridComponentOption } from "echarts/components"
import { LineChart, LineSeriesOption } from "echarts/charts"
import { UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>

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
                            data: [150, 230, 224, 218, 135, 147, 260],
                            type: "round"
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
            const chartDom = document.getElementById("chart")!
            const myChart = echarts.init(chartDom)
            option && myChart.setOption(option)
        })
    }
}
</script>

<style scoped>
.chart {
    height: 100%;
    width: 100%;
}
</style>