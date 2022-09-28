<template>
    <div id="svg">
        <svg :width="300" :height="200">
            <g>
                <!-- 矩形 -->
                <rect x="0" y="0" width="300" height="200" fill="yellow"></rect>
                <!-- 线 -->
                <line
                    x1="100"
                    y1="100"
                    x2="200"
                    y2="200"
                    style="stroke: rgb(255, 0, 0); stroke-width: 2"
                />
                <!-- 圆 -->
                <circle
                    cx="100"
                    cy="100"
                    r="20"
                    fill="#ac0"
                    style="stroke: rgb(255, 0, 0); stroke-width: 2"
                />
                <!-- 椭圆 -->
                <ellipse cx="200" cy="50" rx="100" ry="50" fill="green" />

                <rect
                    x="20"
                    y="20"
                    width="60"
                    height="60"
                    fill="green"
                    transform="translate(60 60) rotate(45)"
                ></rect>
            </g>
        </svg>
        <svg id="drawChart" :width="400" :height="200"></svg>
        <svg id="circleChart" :width="400" :height="200"></svg>
        <svg id="lineChart" :width="400" :height="300"></svg>
        <svg id="pieChart" :width="400" :height="400"></svg>
        <svg id="barChart" :width="600" :height="400"></svg>
    </div>
</template>
<script>
    import * as d3 from "d3"
    import { defineComponent, onMounted, ref } from "vue"

    export default defineComponent({
        setup() {
            const width = ref(300)
            const height = ref(200)

            let node
            let link
            let nodesData = [
                { name: "Lillian", sex: "F" },
                { name: "Gordon", sex: "M" },
                { name: "Sylvester", sex: "M" },
                { name: "Mary", sex: "F" },
                { name: "Helen", sex: "F" },
                { name: "Jamie", sex: "M" },
                { name: "Jessie", sex: "F" },
                { name: "Ashton", sex: "M" },
                { name: "Duncan", sex: "M" },
                { name: "Evette", sex: "F" },
                { name: "Mauer", sex: "M" },
                { name: "Fray", sex: "F" },
                { name: "Duke", sex: "M" },
                { name: "Baron", sex: "M" },
                { name: "Infante", sex: "M" },
                { name: "Percy", sex: "M" },
                { name: "Cynthia", sex: "F" }
            ]
            let linksData = [
                { source: "Sylvester", target: "Gordon", type: "A" },
                { source: "Sylvester", target: "Lillian", type: "A" },
                { source: "Sylvester", target: "Mary", type: "A" },
                { source: "Sylvester", target: "Jamie", type: "A" },
                { source: "Sylvester", target: "Jessie", type: "A" },
                { source: "Sylvester", target: "Helen", type: "A" },
                { source: "Helen", target: "Gordon", type: "A" },
                { source: "Mary", target: "Lillian", type: "A" },
                { source: "Ashton", target: "Mary", type: "A" },
                { source: "Duncan", target: "Jamie", type: "A" },
                { source: "Gordon", target: "Jessie", type: "A" },
                { source: "Sylvester", target: "Fray", type: "E" },
                { source: "Fray", target: "Mauer", type: "A" },
                { source: "Fray", target: "Cynthia", type: "A" },
                { source: "Fray", target: "Percy", type: "A" },
                { source: "Percy", target: "Cynthia", type: "A" },
                { source: "Infante", target: "Duke", type: "A" },
                { source: "Duke", target: "Gordon", type: "A" },
                { source: "Duke", target: "Sylvester", type: "A" },
                { source: "Baron", target: "Duke", type: "A" },
                { source: "Baron", target: "Sylvester", type: "E" },
                { source: "Evette", target: "Sylvester", type: "E" },
                { source: "Cynthia", target: "Sylvester", type: "E" },
                { source: "Cynthia", target: "Jamie", type: "E" },
                { source: "Mauer", target: "Jessie", type: "E" }
            ]

            const circleColor = (d) => {
                if (d.sex === "M") {
                    return "blue"
                } else {
                    return "pink"
                }
            }
            const tickAction = () => {
                node.attr("cx", (d) => {
                    return d.x
                }).attr("cy", (d) => {
                    return d.y
                })
                link.attr("x1", (d) => {
                    return d.source.x
                })
                    .attr("y1", (d) => {
                        return d.source.y
                    })
                    .attr("x2", (d) => {
                        return d.target.x
                    })
                    .attr("y2", (d) => {
                        return d.target.y
                    })
            }
            const linkColor = (d) => {
                if (d.type === "A") {
                    return "green"
                } else {
                    return "red"
                }
            }

            const drawChart = () => {
                let svg = d3.select("#drawChart")
                let simulation = d3.forceSimulation().nodes(nodesData)

                simulation
                    .force("charge_force", d3.forceManyBody())
                    .force("center_force", d3.forceCenter(width.value / 2, height.value / 2))

                node = svg
                    .append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(nodesData)
                    .enter()
                    .append("circle")
                    .attr("r", 10)
                    .attr("fill", circleColor)

                simulation.on("tick", tickAction)

                let linkForce = d3.forceLink(linksData).id((d) => {
                    return d.name
                })

                simulation.force("links", linkForce)

                link = svg
                    .append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(linksData)
                    .enter()
                    .append("line")
                    .attr("stroke-width", 2)
                    .style("stroke", linkColor)
                    .style("stroke-opacity", 0.6)
            }

            // 绘制条形图
            const barChart = () => {
                const data = [
                    { year: "2006", population: 40 },
                    { year: "2007", population: 45 },
                    { year: "2008", population: 48 },
                    { year: "2009", population: 51 },
                    { year: "2010", population: 53 },
                    { year: "2011", population: 57 },
                    { year: "2012", population: 68 }
                ]
                const svg = d3.select("#barChart"),
                    margin = 200,
                    width = svg.attr("width") - margin,
                    height = svg.attr("height") - margin
                svg.append("text")
                    .attr("transform", "translate(100,0)")
                    .attr("x", 50)
                    .attr("y", 50)
                    .attr("font-size", "20px")
                    .attr("class", "title")
                    .text("Population bar chart")
                const x = d3.scaleBand().range([0, width]).padding(0.4),
                    y = d3.scaleLinear().range([height, 0])
                const g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")")
                x.domain(
                    data.map(function (d) {
                        return d.year
                    })
                )
                y.domain([
                    0,
                    d3.max(data, function (d) {
                        return d.population
                    })
                ])
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .append("text")
                    .attr("y", height - 150)
                    .attr("x", width - 250)
                    .attr("text-anchor", "end")
                    .attr("font-size", "18px")
                    .attr("stroke", "blue")
                    .text("year")
                g.append("g")
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("dx", "-4em")
                    .attr("dy", "-2em")
                    .attr("text-anchor", "end")
                    .attr("font-size", "18px")
                    .attr("stroke", "blue")
                    .text("population")
                g.append("g").attr("transform", "translate(0, 0)").call(d3.axisLeft(y))
                g.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .on("mouseover", onMouseOver)
                    .on("mouseout", onMouseOut)
                    .attr("x", function (d) {
                        return x(d.year)
                    })
                    .attr("y", function (d) {
                        return y(d.population)
                    })
                    .attr("width", x.bandwidth())
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(200)
                    .delay(function (d, i) {
                        return i * 25
                    })
                    .attr("height", function (d) {
                        return height - y(d.population)
                    })
                    .attr("fill", "#ac0")
                function onMouseOver() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("width", x.bandwidth() + 5)
                        .attr("height", function (d) {
                            return height - y(d.population) + 10
                        })
                        .attr("y", function (d) {
                            return y(d.population) - 10
                        })
                        .attr("fill", "red")
                }
                function onMouseOut() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("width", x.bandwidth())
                        .attr("height", function (d) {
                            return height - y(d.population)
                        })
                        .attr("y", function (d) {
                            return y(d.population)
                        })
                        .attr("fill", "#ac0")
                    d3.selectAll(".val").remove()
                }
            }

            // 绘制圆图
            const circleChart = () => {
                const width = 400
                const height = 400
                const data = [10, 20, 30]
                const colors = ["green", "purple", "yellow"]
                const svg = d3
                    .select("#circleChart")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                const g = svg
                    .selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("transform", function (d, i) {
                        return "translate(0,0)"
                    })
                g.append("circle")
                    .attr("cx", function (d, i) {
                        return i * 75 + 50
                    })
                    .attr("cy", function (d, i) {
                        return 75
                    })
                    .attr("r", function (d) {
                        return d * 1.5
                    })
                    .attr("fill", function (d, i) {
                        return colors[i]
                    })
                g.append("text")
                    .attr("x", function (d, i) {
                        return i * 75 + 25
                    })
                    .attr("y", 80)
                    .attr("stroke", "teal")
                    .attr("font-size", "10px")
                    .attr("font-family", "sans-serif")
                    .text(function (d) {
                        return d
                    })
            }

            // 绘制饼图
            const pieChart = () => {
                const svg = d3.select("#pieChart")
                const width = svg.attr("width")
                const height = svg.attr("height")
                const radius = Math.min(width, height) / 2
                const g = svg
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                const color = d3.scaleOrdinal([
                    "gray",
                    "green",
                    "brown",
                    "orange",
                    "yellow",
                    "red",
                    "purple"
                ])
                const pie = d3.pie().value(function (d) {
                    return d.percent
                })
                const label = d3
                    .arc()
                    .outerRadius(radius)
                    .innerRadius(radius - 220)
                const path = d3
                    .arc()
                    .outerRadius(radius - 80)
                    .innerRadius(40)
                const pieData = [
                    { states: "UP", percent: "80.00" },
                    { states: "Maharaststatesra", percent: "70.00" },
                    { states: "Bihstatesar", percent: "65.0" },
                    { states: "MP", percent: "60.00" },
                    { states: "Gujarstatesat", percent: "50.0" },
                    { states: "WB", percent: "49.0" },
                    { states: "TN", percent: "35.0" }
                ]
                const arc = g
                    .selectAll(".arc")
                    .data(pie(pieData))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                arc.append("path")
                    .attr("d", path)
                    .attr("fill", function (d) {
                        return color(d.data.states)
                    })
                arc.append("text")
                    .attr("transform", function (d) {
                        return "translate(" + label.centroid(d) + ")"
                    })
                    .text(function (d) {
                        return d.data.states
                    })
                    .style("font", "12px arial")
                    .style("text-anchor", "middle")
                svg.append("g")
                    .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
                    .append("text")
                    .text("Top population states in india")
                    .style("font-style", "oblique")
            }

            // 折线图
            const lineChart = () => {
                const data = [
                    { year: "2006", population: 40 },
                    { year: "2007", population: 45 },
                    { year: "2008", population: 48 },
                    { year: "2009", population: 51 },
                    { year: "2010", population: 53 },
                    { year: "2011", population: 57 },
                    { year: "2012", population: 68 }
                ]
                const margin = { top: 20, right: 20, bottom: 30, left: 50 },
                    width = 400 - margin.left - margin.right,
                    height = 300 - margin.top - margin.bottom
                const x = d3.scaleTime().range([0, width])
                const y = d3.scaleLinear().range([height, 0])
                const valueLine = d3
                    .line()
                    .x(function (d) {
                        return x(d.year)
                    })
                    .y(function (d) {
                        return y(d.population)
                    })
                const svg = d3
                    .select("#lineChart")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                x.domain(
                    d3.extent(data, function (d) {
                        return d.year
                    })
                )
                y.domain([
                    0,
                    d3.max(data, function (d) {
                        return d.population
                    })
                ])
                // 代码生成线
                svg.append("path")
                    .data([data])
                    .attr("d", valueLine)
                    .style("fill", "none")
                    .style("stroke", "#ac0")
                    .style("stroke-width", "5px")

                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                svg.append("g").call(d3.axisLeft(y))
            }

            onMounted(() => {
                drawChart()
                barChart()
                circleChart()
                pieChart()
                lineChart()
            })
            return {
                width,
height
            }
        }
    })
</script>
<style lang="scss" scope>
    #svg {
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
    }
</style>
