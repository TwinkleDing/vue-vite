<template>
    <div class="home">
        <div class="left">
            <el-carousel class="carousel" indicator-position="outside">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 text="2xl" justify="center">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
            <div class="charts">
                <div class="chart">
                    <bar-chart ref="bar1" />
                </div>
                <div class="chart">
                    <line-chart ref="line" />
                </div>
                <div class="chart">
                    <pie-chart ref="pie" />
                </div>
                <div class="chart">
                    <bar-chart ref="bar2" />
                </div>
            </div>
        </div>
        <div class="right">
            <el-calendar ref="calendar" class="calendar"> </el-calendar>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, onMounted, ref } from "vue"
    import BarChart from "@/components/Chart/BarChart.vue"
    import LineChart from "@/components/Chart/LineChart.vue"
    import PieChart from "@/components/Chart/PieChart.vue"

    export default defineComponent({
        name: "Home",
        components: { BarChart, LineChart, PieChart },
        setup() {
            const calendar = ref()
            const pie = ref()
            const bar1 = ref()
            const bar2 = ref()
            const line = ref()

            onMounted(() => {
                window.addEventListener("resize", function (e) {
                    pie.value.resize()
                    bar1.value.resize()
                    // bar2.value.resize()
                    line.value.resize()
                })
            })

            return {
                calendar,
                pie,
                bar1,
                bar2,
                line
            }
        }
    })
</script>

<style lang="scss" scoped>
    .home {
        display: flex;
        justify-content: space-between;
        .left,
        .right {
            display: inline-block;
            width: 49%;
            min-width: 600px;
            height: 100%;
        }
        .chart {
            display: inline-block;
            height: 200px;
            width: 50%;
        }
        .calendar {
            height: 300px;
        }
    }
    ::deep {
        .el-calendar {
            --el-calendar-cell-width: 35px;
        }
        .el-carousel__item h3 {
            display: flex;
            color: #475669;
            opacity: 0.75;
            line-height: 300px;
            margin: 0;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n + 1) {
            background-color: #d3dce6;
        }
    }
</style>
