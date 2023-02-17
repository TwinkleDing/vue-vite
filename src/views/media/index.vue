<template>
  <div class="media">
    <div id="container" ref="container"></div>
  </div>
</template>
<script setup lang="ts">
import { markRaw, onMounted, ref } from "vue";
import BpmnJS from "bpmn-js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { bmpmStr } from "./bpmnStr.js";

let bpmnModeler: any = null;
const init: void = async () => {
  bpmnModeler = new BpmnModeler({ container: "#container" });

  try {
    const result = await bpmnModeler.importXML(bmpmStr);
    const { warnings } = result;
    console.log(warnings);
  } catch (err) {
    console.log(err.message, err.warnings);
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.media {
  height: 100%;
  width: 100%;
  #container {
    height: 100%;
    width: 100%;
  }
}
</style>
