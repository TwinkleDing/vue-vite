<template>
    <div id="pieChart" class="pie-chart" :style="{ width, height }"></div>
</template>
<script lang="ts">
import { onMounted } from "vue"
import * as echarts from "echarts/core"
import {
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption
} from "echarts/components"
import { PieChart, PieSeriesOption } from "echarts/charts"
import { LabelLayout } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"
echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
])

type EChartsOption = echarts.ComposeOption<
    TitleComponentOption | TooltipComponentOption | LegendComponentOption | PieSeriesOption
>

export default {
    name: "PieChart",
    props: {
        option: {
            type: Object,
            default: () => {
                return {
                    title: {
                        text: "Referer of a Website",
                        subtext: "Fake Data",
                        left: "center"
                    },
                    tooltip: {
                        trigger: "item"
                    },
                    legend: {
                        orient: "vertical",
                        left: "left"
                    },
                    series: [
                        {
                            name: "Access From",
                            type: "pie",
                            radius: "50%",
                            data: [
                                { value: 1048, name: "Search Engine" },
                                { value: 735, name: "Direct" },
                                { value: 580, name: "Email" },
                                { value: 484, name: "Union Ads" },
                                { value: 300, name: "Video Ads" }
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
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
            const chartDom = document.getElementById("pieChart")!
            const myChart = echarts.init(chartDom)
            option && myChart.setOption(option)
        })
    }
}
</script>

<style scoped>
.pie-chart {
    height: 100%;
    width: 100%;
}
</style>