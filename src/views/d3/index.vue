<template>
  <div id="svg">
    <svg id="draw-name" :width="width" :height="height"></svg>
    <example />
  </div>
</template>
<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, Ref, ref } from "vue";
import Example from "./example.vue";

const width: Ref<number> = ref(400);
const height: Ref<number> = ref(200);

const drawName = () => {
  const g = d3.select("#draw-name").append("g"); // 偏移属性; // 组标签

  const svg = g
    .attr("width", 300)
    .attr("height", 200)
    // .attr("transform", "translate(80,100)") // 偏移属性
    .append("text") // 文字标签
    .attr("transform", "translate(125,110)")
    .text("TwinkleDing") // 文字内容
    .attr("fill", "#ac0") // 填充色
    .attr("stroke", "#ac0") // 边缘色
    .style("font-size", "28px"); // 文字尺寸

  g.on("mouseover", function () {
    const animation = () => {
      svg
        .transition()
        .attrTween("transform", rotTween)
        // .delay(1000)
        .duration(1000)
        .ease(d3.easeLinear)
        // .transition()
        // .attrTween("transform", rotTween)
        // .delay(1000)
        // .duration(1000)
        // .ease(d3.easeLinear)
        .on("end", animation);
    };
    animation();
  });
  function rotTween() {
    var i = d3.interpolate(0, 360);
    return function (t) {
      return "translate(125,110) rotate(" + i(t) + ",75,-15)";
    };
  }
};


onMounted(() => {
  drawName();
});
</script>
<style lang="scss" scope>
#svg {
  border: 1px solid #ccc;
  box-sizing: border-box;
  #draw-name {
    margin: 0 auto;
    text-align: center;
  }
}
</style>
