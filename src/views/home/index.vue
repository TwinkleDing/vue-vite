<template>
    <line-chart :option="option" height="300px" width="400px" />
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router"
import LineChart from "@/components/Chart/LineChart.vue"

const route = useRoute()
const option = {
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
</script>

<style scoped>
</style>