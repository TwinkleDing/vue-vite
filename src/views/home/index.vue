<template>
    <line-chart :option="lineOption" height="300px" width="400px" />
    <pie-chart :option="pieOption" height="300px" width="400px" />
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router"
import LineChart from "@/components/Chart/LineChart.vue"
import PieChart from "@/components/Chart/PieChart.vue"

const route = useRoute()
const lineOption = {
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
            type: "line"
        }
    ]
}

const pieOption = {
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
</script>

<style scoped>
</style>